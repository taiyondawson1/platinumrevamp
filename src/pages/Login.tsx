
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import { useStaffKeyValidation } from "@/hooks/use-staff-key-validation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showKeyUpdateDialog, setShowKeyUpdateDialog] = useState(false);
  const [oldStaffKey, setOldStaffKey] = useState<string | null>(null);
  
  // Use our custom hook for real-time staff key validation
  const { staffKeyInfo, isLoading: isValidating, canUserUseKey } = useStaffKeyValidation(staffKey);

  // Helper function to get alert message based on staff key info
  const getStaffKeyAlertMessage = () => {
    if (!staffKey || isValidating) return null;
    
    if (!staffKeyInfo.isProperFormat) {
      return {
        variant: "destructive" as const,
        title: "Invalid Format",
        description: "Please use CEO### for CEO, AD#### for Admin, or EN#### for Enroller"
      };
    }
    
    if (!staffKeyInfo.isValid) {
      return {
        variant: "destructive" as const,
        title: "Invalid Key", 
        description: "This staff key is invalid or inactive"
      };
    }
    
    if (staffKeyInfo.isAssigned && staffKeyInfo.assignedUserId !== userId) {
      return {
        variant: "warning" as const,
        title: "Key Already Assigned",
        description: "This staff key is assigned to another account. You cannot use it."
      };
    }
    
    return {
      variant: "success" as const,
      title: `Valid ${staffKeyInfo.keyType} Key`,
      description: staffKeyInfo.isAssigned && staffKeyInfo.assignedUserId === userId 
        ? "This staff key is assigned to your account" 
        : "This staff key is valid and available"
    };
  };

  // Update user's staff key 
  const updateUserStaffKey = async () => {
    if (!userId || !staffKey || !staffKeyInfo.isValid || !staffKeyInfo.isProperFormat) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ staff_key: staffKey })
        .eq('id', userId);
      
      if (error) {
        console.error("Error updating staff key:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update your staff key. Please try again.",
        });
        return false;
      }
      
      toast({
        title: "Staff Key Updated",
        description: `Your staff key has been updated to ${staffKey}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateUserStaffKey:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during staff key update",
      });
      return false;
    }
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
    if (!staffKeyInfo.isProperFormat) {
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
        setUserId(data.user.id);
        
        // Check the profiles table for staff key validation
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('staff_key')
          .eq('id', data.user.id)
          .single();
        
        // Only validate if staff key was returned from profiles
        if (profileError || !profileData) {
          console.error("Profile fetch error:", profileError);
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: "Could not validate your account. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        const currentStaffKey = profileData.staff_key;
        
        // If the entered staff key is different from the one in the profile
        if (currentStaffKey && currentStaffKey !== staffKey) {
          console.log(`Staff key mismatch: profile has ${currentStaffKey}, user entered ${staffKey}`);
          
          // If the new key is valid and available or assigned to this user
          if (staffKeyInfo.isValid && (
              !staffKeyInfo.isAssigned || 
              staffKeyInfo.assignedUserId === data.user.id
          )) {
            // Store the old key for reference
            setOldStaffKey(currentStaffKey);
            // Show dialog to ask user if they want to update their staff key
            setShowKeyUpdateDialog(true);
            setIsLoading(false);
            return;
          } else if (staffKeyInfo.isAssigned && staffKeyInfo.assignedUserId !== data.user.id) {
            // Key is assigned to someone else, can't use it
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Invalid Staff Key",
              description: "This staff key is assigned to another user and cannot be used for your account",
            });
            setIsLoading(false);
            return;
          }
          
          // If key is different but not valid, invalid format, or otherwise problematic
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Invalid Staff Key",
            description: `Your account uses the staff key ${currentStaffKey}. Please use that key to log in.`,
          });
          setIsLoading(false);
          return;
        }

        // Login successful with matching staff key
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
      setIsLoading(false);
    }
  };

  // Handle user confirming staff key update
  const handleConfirmKeyUpdate = async () => {
    setIsLoading(true);
    
    const updated = await updateUserStaffKey();
    setShowKeyUpdateDialog(false);
    
    if (updated) {
      // Success, navigate to dashboard
      navigate("/dashboard");
    } else {
      // Failed to update key, but already logged in
      // We can still let the user proceed with their old key
      navigate("/dashboard");
    }
  };

  // Handle user canceling staff key update
  const handleCancelKeyUpdate = () => {
    setShowKeyUpdateDialog(false);
    // User doesn't want to update, continue with login using old key
    navigate("/dashboard");
  };

  // Get alert message information
  const alertInfo = getStaffKeyAlertMessage();

  return (
    <>
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
                      (staffKeyInfo.isValid && (!staffKeyInfo.isAssigned || staffKeyInfo.assignedUserId === userId) ? 'border-green-500' : 
                       !staffKeyInfo.isProperFormat || !staffKeyInfo.isValid ? 'border-red-500' : 
                       'border-amber-500') : 
                      ''
                  }`}
                />
                <p className="text-xs text-silver/70">
                  Enter your staff key (CEO###, AD####, or EN####)
                </p>
                
                {staffKey && !isValidating && alertInfo && (
                  <Alert 
                    variant={
                      alertInfo.variant === "success" ? "default" : 
                      alertInfo.variant === "warning" ? undefined : 
                      "destructive"
                    }
                    className={
                      alertInfo.variant === "success" ? "mt-2 py-2 bg-green-500/20 border-green-500 text-green-200" : 
                      alertInfo.variant === "warning" ? "mt-2 py-2 bg-amber-500/20 border-amber-500 text-amber-200" : 
                      "mt-2 py-2"
                    }
                  >
                    <AlertTitle>{alertInfo.title}</AlertTitle>
                    <AlertDescription>
                      {alertInfo.description}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isValidating || (staffKey && (!staffKeyInfo.isValid || !staffKeyInfo.isProperFormat))}
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

      {/* Staff Key Update Dialog */}
      <AlertDialog open={showKeyUpdateDialog} onOpenChange={setShowKeyUpdateDialog}>
        <AlertDialogContent className="bg-darkBlue border-silver/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Staff Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account currently uses staff key <span className="font-mono text-white">{oldStaffKey}</span>. 
              Would you like to update it to <span className="font-mono text-white">{staffKey}</span>?
              <br /><br />
              {staffKeyInfo.role && (
                <span>
                  This will change your role to <span className="font-bold text-white">{staffKeyInfo.role}</span>.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelKeyUpdate}
              className="bg-darkGrey text-softWhite"
            >
              Keep old key
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmKeyUpdate}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Staff Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Login;
