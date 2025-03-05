
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import { useStaffKeyValidation } from "@/hooks/use-staff-key-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Staff key validation regex patterns
const STAFF_KEY_PATTERNS = {
  CEO: /^CEO\d{3}$/,    // CEO followed by 3 digits
  ADMIN: /^AD\d{4}$/,   // AD followed by 4 digits
  ENROLLER: /^EN\d{4}$/ // EN followed by 4 digits
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Use our custom hook for real-time staff key validation
  const { staffKeyInfo, isLoading: isValidating } = useStaffKeyValidation(staffKey);

  // Function to validate staff key format
  const validateStaffKeyFormat = (key: string): boolean => {
    return (
      STAFF_KEY_PATTERNS.CEO.test(key) ||
      STAFF_KEY_PATTERNS.ADMIN.test(key) ||
      STAFF_KEY_PATTERNS.ENROLLER.test(key)
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Staff key is required",
      });
      return;
    }

    // Validate staff key format for staff members
    const isStaffKeyFormat = validateStaffKeyFormat(staffKey);
    
    setIsLoading(true);
    let debugData: any = {
      email,
      staffKey,
      isStaffKeyFormat,
      staffKeyInfo: JSON.parse(JSON.stringify(staffKeyInfo))
    };

    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error });
      debugData.signInResponse = { data, error };

      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setIsLoading(false);
        setDebugInfo(debugData);
        return;
      }

      if (data?.user) {
        try {
          // First we need to determine if this is a staff member or a customer
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, staff_key')
            .eq('id', data.user.id)
            .maybeSingle(); // Using maybeSingle instead of single to prevent errors if profile doesn't exist
          
          debugData.profileData = profileData;
          debugData.profileError = profileError;
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setDebugInfo(debugData);
            
            // Fix the profile by calling our edge function
            try {
              const { error: fixError } = await supabase.functions.invoke('fix-handle-new-user');
              if (fixError) {
                console.error("Error fixing triggers:", fixError);
              }

              // Try to fetch the profile again after fixing
              const { data: retryProfileData, error: retryProfileError } = await supabase
                .from('profiles')
                .select('role, staff_key')
                .eq('id', data.user.id)
                .maybeSingle();
                
              if (retryProfileError || !retryProfileData) {
                await supabase.auth.signOut();
                toast({
                  variant: "destructive",
                  title: "Profile Error",
                  description: "Could not verify your account role. Please try again.",
                });
                setIsLoading(false);
                setDebugInfo(debugData);
                return;
              }
              
              // Continue with the retry data
              debugData.retryProfileData = retryProfileData;
              console.log("Successfully fixed and fetched profile:", retryProfileData);
            } catch (fixErr) {
              console.error("Error calling fix function:", fixErr);
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Profile Error",
                description: "Could not verify your account role. Please try again.",
              });
              setIsLoading(false);
              setDebugInfo(debugData);
              return;
            }
          }

          const userRole = profileData?.role || 'customer';
          console.log("User role:", userRole);
          debugData.userRole = userRole;
          
          // Staff members (CEO, ADMIN, ENROLLER) must use a staff key format and it must be valid
          if (userRole === 'ceo' || userRole === 'admin' || userRole === 'enroller') {
            if (!isStaffKeyFormat) {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Invalid Staff Key Format",
                description: "Staff members must use a valid staff key format (CEO###, AD####, or EN####).",
              });
              setIsLoading(false);
              setDebugInfo(debugData);
              return;
            }
            
            // Check if the staff key exists in the staff_keys table
            const { data: staffData, error: staffError } = await supabase
              .from('staff_keys')
              .select('key, user_id, role')
              .eq('key', staffKey)
              .maybeSingle();
            
            debugData.staffData = staffData;
            debugData.staffError = staffError;
            
            if (staffError || !staffData) {
              console.error("Staff key fetch error:", staffError);
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Invalid Staff Key",
                description: "The staff key doesn't match your account.",
              });
              setIsLoading(false);
              setDebugInfo(debugData);
              return;
            }
            
            // If the key exists but is assigned to a different user with a different role
            if (staffData.user_id && 
                staffData.user_id !== data.user.id && 
                staffData.role !== userRole) {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Staff Key Error",
                description: "This staff key doesn't match your role.",
              });
              setIsLoading(false);
              setDebugInfo(debugData);
              return;
            }
            
            // If the key exists but is not assigned to any user, update it
            if (!staffData.user_id) {
              const { error: updateError } = await supabase
                .from('staff_keys')
                .update({ user_id: data.user.id })
                .eq('key', staffKey);
              
              debugData.staffKeyUpdateError = updateError;
              
              if (updateError) {
                console.error("Error assigning staff key:", updateError);
                // Continue with login even if update fails
              }
            }
          } 
          // For customers, we don't need staff key format validation
          else if (userRole === 'customer') {
            // For customers, we check if they have a license key
            const { data: licenseData, error: licenseError } = await supabase
              .from('license_keys')
              .select('enrolled_by, license_key')
              .eq('user_id', data.user.id)
              .maybeSingle();
            
            debugData.licenseData = licenseData;
            debugData.licenseError = licenseError;
            
            if (licenseError) {
              console.error("License key fetch error:", licenseError);
              // Don't fail login if we can't fetch license info
            }
            
            // If we have a license record with enrolled_by
            if (licenseData && licenseData.enrolled_by) {
              // If the staff key doesn't match the one that enrolled them
              if (licenseData.enrolled_by !== staffKey) {
                // Only if the new key is valid for enrollment, update their enrollment
                if (isStaffKeyFormat && staffKeyInfo.canBeUsedForEnrollment) {
                  // Update the enrolled_by field
                  const { error: updateError } = await supabase
                    .from('license_keys')
                    .update({ enrolled_by: staffKey, staff_key: staffKey })
                    .eq('user_id', data.user.id);
                  
                  debugData.licenseUpdateError = updateError;
                  
                  if (updateError) {
                    console.error("Error updating enrolled_by:", updateError);
                    // Continue with login even if update fails
                  }
                }
                // If not a valid staff key, just continue with login using their existing enrollment
              }
            } 
            // No license record yet or no enrolled_by
            else if (isStaffKeyFormat && staffKeyInfo.canBeUsedForEnrollment) {
              // Create or update license record with this enrollment key
              const { error: upsertError } = await supabase
                .from('license_keys')
                .upsert({
                  user_id: data.user.id,
                  enrolled_by: staffKey,
                  // Add other required fields based on your table structure
                  license_key: licenseData?.license_key || 'PENDING',
                  product_code: 'EA-001',
                  subscription_type: 'standard',
                  name: data.user.email?.split('@')[0] || 'Customer',
                  email: data.user.email || '',
                  phone: '',
                  account_numbers: [],
                  staff_key: staffKey
                });
              
              debugData.licenseUpsertError = upsertError;
              
              if (upsertError) {
                console.error("Error creating license record:", upsertError);
                // Continue with login even if update fails
              }
            }
            // If customer tried to use a non-enrolling key, we still let them login
            // but we don't update their license record
          } else {
            // Unknown role, this is a server error, role should be set in the profiles table
            console.error("Unknown user role:", userRole);
            // Instead of failing, we'll attempt to fix the profile by setting to customer
            try {
              const { error: fixProfileError } = await supabase
                .from('profiles')
                .upsert({
                  id: data.user.id,
                  role: 'customer',
                  updated_at: new Date().toISOString()
                });
                
              debugData.fixProfileError = fixProfileError;
              
              if (fixProfileError) {
                console.error("Error fixing profile:", fixProfileError);
                await supabase.auth.signOut();
                toast({
                  variant: "destructive",
                  title: "Account Error",
                  description: "Could not fix your account role. Please contact support.",
                });
                setIsLoading(false);
                setDebugInfo(debugData);
                return;
              }
            } catch (fixErr) {
              console.error("Error fixing profile:", fixErr);
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Account Error",
                description: "Could not fix your account role. Please contact support.",
              });
              setIsLoading(false);
              setDebugInfo(debugData);
              return;
            }
          }

          console.log("Login successful, user:", data.user);
          toast({
            title: "Success",
            description: "Successfully logged in",
          });
          navigate("/dashboard");
        } catch (error) {
          console.error("Error during login process:", error);
          debugData.processingError = error;
          setDebugInfo(debugData);
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Login Error",
            description: "An unexpected error occurred. Please try again.",
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      debugData.finalError = error;
      setDebugInfo(debugData);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-softWhite">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                className={`bg-darkGrey border-silver/20 ${
                  staffKey && !isValidating ? 
                    (staffKeyInfo.isValid ? 'border-green-500' : 'border-red-500') : 
                    ''
                }`}
              />
              <p className="text-xs text-silver/70">
                Enter your staff key (CEO###, AD####, or EN####)
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
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || isValidating}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/register")}
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </div>
            
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
      
      {/* Debug Dialog (only shown in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Debug Information</DialogTitle>
              <DialogDescription>
                Detailed information about the login process
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

export default Login;
