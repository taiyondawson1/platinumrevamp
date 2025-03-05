
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
    
    setIsLoading(true);

    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // First we need to determine if this is a staff member or a customer
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: "Could not verify your account role. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        const userRole = profileData?.role;
        
        // Staff members (CEO, ADMIN, ENROLLER) must use their own staff key to login
        if (userRole === 'ceo' || userRole === 'admin' || userRole === 'enroller') {
          // Check if the staff key exists in the staff_keys table
          const { data: staffData, error: staffError } = await supabase
            .from('staff_keys')
            .select('key, user_id, role')
            .eq('key', staffKey)
            .single();
          
          if (staffError || !staffData) {
            console.error("Staff key fetch error:", staffError);
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Invalid Staff Key",
              description: "The staff key doesn't match your account.",
            });
            setIsLoading(false);
            return;
          }
          
          // If the key exists but is assigned to a different user with a different role
          // (This allows the same key to be used for enrollment by multiple staff members)
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
            return;
          }
          
          // If the key exists but is not assigned to any user, update it
          if (!staffData.user_id) {
            const { error: updateError } = await supabase
              .from('staff_keys')
              .update({ user_id: data.user.id })
              .eq('key', staffKey);
            
            if (updateError) {
              console.error("Error assigning staff key:", updateError);
              // Continue with login even if update fails
            }
          }
        } 
        // For customers, check if the entered key is a valid enrolling key
        else if (userRole === 'customer') {
          // For customers, we check if they were enrolled by this staff key
          const { data: licenseData, error: licenseError } = await supabase
            .from('license_keys')
            .select('enrolled_by')
            .eq('user_id', data.user.id)
            .maybeSingle();
          
          // If there's no license record yet or no enrolled_by, update it with this key if valid
          if (licenseError) {
            console.error("License key fetch error:", licenseError);
          }
          
          // If we have a license record with enrolled_by
          if (licenseData && licenseData.enrolled_by) {
            // If the staff key doesn't match the one that enrolled them
            if (licenseData.enrolled_by !== staffKey) {
              // Only if the new key is valid for enrollment, update their enrollment
              if (staffKeyInfo.canBeUsedForEnrollment) {
                // Update the enrolled_by field
                const { error: updateError } = await supabase
                  .from('license_keys')
                  .update({ enrolled_by: staffKey })
                  .eq('user_id', data.user.id);
                
                if (updateError) {
                  console.error("Error updating enrolled_by:", updateError);
                  // Continue with login even if update fails
                }
              } else {
                await supabase.auth.signOut();
                toast({
                  variant: "destructive",
                  title: "Invalid Enrollment Key",
                  description: "The staff key you entered cannot be used for enrollment.",
                });
                setIsLoading(false);
                return;
              }
            }
          } 
          // No license record yet or no enrolled_by
          else {
            // Check if the key can be used for enrollment
            if (staffKeyInfo.canBeUsedForEnrollment) {
              // Create or update license record with this enrollment key
              const { error: upsertError } = await supabase
                .from('license_keys')
                .upsert({
                  user_id: data.user.id,
                  enrolled_by: staffKey,
                  // Add other required fields based on your table structure
                  license_key: 'PENDING',
                  product_code: 'DEFAULT',
                  subscription_type: 'standard',
                  name: data.user.email?.split('@')[0] || 'Customer',
                  email: data.user.email || '',
                  phone: '',
                  account_numbers: [],
                  staff_key: staffKey
                });
              
              if (upsertError) {
                console.error("Error creating license record:", upsertError);
                // Continue with login even if update fails
              }
            } else {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Invalid Enrollment Key",
                description: "The staff key you entered cannot be used for enrollment.",
              });
              setIsLoading(false);
              return;
            }
          }
        }

        console.log("Login successful, user:", data.user);
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
