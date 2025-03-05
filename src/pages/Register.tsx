
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

// Staff key validation regex patterns
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

    // Validate staff key format
    if (!validateStaffKeyFormat(staffKey)) {
      toast({
        variant: "destructive",
        title: "Invalid Staff Key Format",
        description: "Please use CEO### for CEO, AD#### for Admin, or EN#### for Enroller",
      });
      return;
    }

    // Check if staff key is valid according to real-time validation
    if (!staffKeyInfo.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Staff Key",
        description: "The staff key provided is invalid or inactive",
      });
      return;
    }
    
    // Determine if this is a customer registration or staff registration
    const isStaffRegistration = staffKeyInfo.role === 'ceo' || 
                                staffKeyInfo.role === 'admin' || 
                                staffKeyInfo.role === 'enroller';
    
    // If this is a customer registration, check if the staff key can be used for enrollment
    if (!isStaffRegistration && !staffKeyInfo.canBeUsedForEnrollment) {
      toast({
        variant: "destructive",
        title: "Invalid Enrollment Key",
        description: "This staff key cannot be used for customer enrollment",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Staff key validated, proceeding with registration...");

      // If this is a staff registration, check if the key is already assigned
      if (isStaffRegistration) {
        const { data: keyData, error: keyError } = await supabase
          .from('staff_keys')
          .select('user_id')
          .eq('key', staffKey)
          .single();
          
        if (keyError) {
          console.error("Staff key check error:", keyError);
        } else if (keyData && keyData.user_id) {
          toast({
            variant: "destructive",
            title: "Staff Key Already Assigned",
            description: "This staff key is already assigned to another account",
          });
          setIsLoading(false);
          return;
        }
      }

      // Make sure we pass the appropriate data for the user type
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            // For staff members we'll associate the staff key directly
            // For customers, we'll use enrolled_by in the license_keys table
            role: isStaffRegistration ? staffKeyInfo.role : 'customer',
            // For customers, we'll still pass the enrolling staff key
            // to be used in the handle_new_user trigger
            enrolled_by: isStaffRegistration ? null : staffKey
          }
        }
      });

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
        setIsLoading(false);
        return;
      }

      // If this is a staff registration, update the staff_keys table
      if (isStaffRegistration) {
        // We'll update the user_id in the staff_keys table when they confirm their email
      }

      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
