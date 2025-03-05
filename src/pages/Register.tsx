import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useStaffKeyValidation } from "@/hooks/use-staff-key-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STAFF_KEY_PATTERNS = {
  CEO: /^CEO\d{3}$/,    // CEO followed by 3 digits
  ADMIN: /^AD\d{4}$/,   // AD followed by 4 digits
  ENROLLER: /^EN\d{4}$/ // EN followed by 4 digits
};

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const { staffKeyInfo, isLoading: isValidating } = useStaffKeyValidation(staffKey);

  const validateStaffKeyFormat = (key: string): boolean => {
    return (
      STAFF_KEY_PATTERNS.CEO.test(key) ||
      STAFF_KEY_PATTERNS.ADMIN.test(key) ||
      STAFF_KEY_PATTERNS.ENROLLER.test(key)
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (!staffKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Staff key is required",
      });
      return;
    }

    const isStaffKeyFormat = validateStaffKeyFormat(staffKey);
    
    if (isStaffKeyFormat && !staffKeyInfo.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Staff Key",
        description: "The staff key provided is invalid or inactive",
      });
      return;
    }
    
    setIsLoading(true);
    let debugData: any = {
      email,
      staffKey,
      isStaffKeyFormat,
      staffKeyInfo: JSON.parse(JSON.stringify(staffKeyInfo))
    };

    try {
      try {
        console.log("Fixing database triggers before registration...");
        const { error: fixError } = await supabase.functions.invoke('fix-handle-new-user');
        if (fixError) {
          console.warn("Non-blocking warning - Error fixing triggers:", fixError);
        }
      } catch (fixErr) {
        console.warn("Non-blocking warning - Failed to call fix function:", fixErr);
      }

      const isStaffRegistration = isStaffKeyFormat && 
                               (staffKeyInfo.role === 'ceo' || 
                                staffKeyInfo.role === 'admin' || 
                                staffKeyInfo.role === 'enroller');
      
      debugData.isStaffRegistration = isStaffRegistration;
      
      if (!isStaffRegistration && isStaffKeyFormat && !staffKeyInfo.canBeUsedForEnrollment) {
        toast({
          variant: "destructive",
          title: "Invalid Enrollment Key",
          description: "This staff key cannot be used for customer enrollment",
        });
        setDebugInfo(debugData);
        setIsLoading(false);
        return;
      }

      console.log("Registration type:", isStaffRegistration ? "Staff" : "Customer");
      console.log("Registration data:", {
        email,
        staffKey,
        isStaffKeyFormat,
        role: isStaffRegistration ? staffKeyInfo.role : 'customer',
        enrolled_by: !isStaffRegistration && isStaffKeyFormat ? staffKey : null
      });

      const userData = {
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            role: isStaffRegistration ? staffKeyInfo.role : 'customer',
            enrolled_by: !isStaffRegistration && isStaffKeyFormat ? staffKey : null,
            staff_key: isStaffRegistration ? staffKey : null
          }
        }
      };
      
      debugData.userData = userData;

      const { data, error } = await supabase.auth.signUp(userData);
      
      debugData.signupResponse = { data, error };

      if (error) {
        console.error("Registration error details:", error);
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          toast({
            variant: "destructive",
            title: "Too Many Attempts",
            description: "Please wait a few minutes before trying to register again.",
          });
        } else if (error.message.includes('timeout') || error.status === 504) {
          toast({
            variant: "destructive",
            title: "Server Timeout",
            description: "The server is taking too long to respond. Please try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        }
        setDebugInfo(debugData);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        console.log("User created successfully:", data.user);
        
        try {
          console.log("Ensuring customer records are properly created...");
          const { error: repairError } = await supabase.functions.invoke('repair-customer-records');
          if (repairError) {
            console.warn("Non-blocking warning - Error repairing customer records:", repairError);
          }
        } catch (repairErr) {
          console.warn("Non-blocking warning - Failed to repair customer records:", repairErr);
        }
        
        if (!isStaffRegistration) {
          try {
            const { data: licenseData, error: licenseError } = await supabase
              .from('license_keys')
              .select('*')
              .eq('user_id', data.user.id)
              .maybeSingle();
              
            if (licenseError || !licenseData) {
              console.log("No license key found, attempting to create one...");
              
              const { error: createLicenseError } = await supabase
                .from('license_keys')
                .insert({
                  user_id: data.user.id,
                  license_key: 'PENDING-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                  account_numbers: [],
                  status: 'active',
                  subscription_type: 'standard',
                  name: email.split('@')[0],
                  email: email,
                  phone: '',
                  product_code: 'EA-001',
                  enrolled_by: staffKey,
                  staff_key: staffKey
                });
                
              if (createLicenseError) {
                console.error("Error creating license key record:", createLicenseError);
              }
            }
            
            const { data: customerAccountData, error: customerAccountError } = await supabase
              .from('customer_accounts')
              .select('*')
              .eq('user_id', data.user.id)
              .maybeSingle();
              
            if (customerAccountError || !customerAccountData) {
              console.log("No customer_accounts record found, attempting to create one...");
              
              const { error: createCustomerAccountError } = await supabase
                .from('customer_accounts')
                .insert({
                  user_id: data.user.id,
                  name: email.split('@')[0],
                  email: email,
                  phone: '',
                  status: 'active',
                  enrolled_by: staffKey,
                  license_key: licenseData ? licenseData.license_key : 'PENDING-' + Math.random().toString(36).substring(2, 7).toUpperCase()
                });
                
              if (createCustomerAccountError) {
                console.error("Error creating customer_accounts record:", createCustomerAccountError);
              }
            }
            
            const { error: createCustomerError } = await supabase
              .from('customers')
              .insert({
                id: data.user.id,
                name: email.split('@')[0],
                email: email,
                phone: '',
                status: 'Active',
                sales_rep_id: '00000000-0000-0000-0000-000000000000',
                staff_key: staffKey,
                revenue: '$0'
              })
              .onConflict('id')
              .ignore();
              
            if (createCustomerError) {
              console.error("Error creating/updating customer record:", createCustomerError);
            }
          } catch (err) {
            console.error("Error ensuring customer record creation:", err);
          }
        }
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });

        navigate("/login");
      } else {
        console.error("User data not returned after signup");
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: "Unknown error during registration. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      debugData.finalError = error;
      setDebugInfo(debugData);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/login")}
              className="w-8 h-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-softWhite">Create Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-darkGrey border-silver/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-darkGrey border-silver/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-darkGrey border-silver/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Staff Key"
                value={staffKey}
                onChange={(e) => setStaffKey(e.target.value)}
                required
                disabled={isLoading}
                className={`bg-darkGrey border-silver/20 ${
                  staffKey && !isValidating ? 
                    (staffKeyInfo.isValid ? 'border-green-500' : 'border-red-500') : 
                    ''
                }`}
              />
              <p className="text-xs text-silver/70">
                {staffKeyInfo.role === 'ceo' || staffKeyInfo.role === 'admin' || staffKeyInfo.role === 'enroller' 
                  ? "Enter your staff key (CEO###, AD####, or EN####)" 
                  : "Enter the staff key of the person who enrolled you"}
              </p>
              
              {staffKey && !isValidating && !staffKeyInfo.isValid && (
                <Alert variant="destructive" className="mt-2 py-2">
                  <AlertDescription>
                    This staff key is invalid or inactive
                  </AlertDescription>
                </Alert>
              )}
              
              {staffKey && !isValidating && staffKeyInfo.isValid && !staffKeyInfo.canBeUsedForEnrollment && (
                <Alert className="mt-2 py-2 bg-amber-500/20 border-amber-500 text-amber-200">
                  <AlertDescription>
                    This staff key cannot be used for enrollment
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isValidating || (staffKey && !staffKeyInfo.canBeUsedForEnrollment)}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="w-full mt-2 text-xs"
                onClick={() => setShowDebugDialog(true)}
              >
                Debug Info
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      {process.env.NODE_ENV === 'development' && (
        <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Debug Information</DialogTitle>
              <DialogDescription>
                Detailed information about the registration process
              </DialogDescription>
            </DialogHeader>
            <pre className="p-4 bg-darkGrey rounded-md overflow-x-auto">
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'No debug info available'}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Register;
