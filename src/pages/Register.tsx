
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useStaffKeyValidation } from "@/hooks/use-staff-key-validation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    
    // Check if staff key is already assigned
    if (staffKeyInfo.isAssigned) {
      toast({
        variant: "destructive",
        title: "Staff Key Already Assigned",
        description: "This staff key is already assigned to another account",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Staff key validated, proceeding with registration...");

      // Make sure we pass the staff_key in the correct format
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            staff_key: staffKey
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
    
    if (staffKeyInfo.isAssigned) {
      return {
        variant: "warning" as const,
        title: "Key Already Assigned",
        description: "This staff key is already assigned to another account"
      };
    }
    
    return {
      variant: "success" as const,
      title: `Valid ${staffKeyInfo.keyType} Key`,
      description: "This staff key is valid and available"
    };
  };

  // Get alert message information
  const alertInfo = getStaffKeyAlertMessage();

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
                    (staffKeyInfo.isValid && !staffKeyInfo.isAssigned ? 'border-green-500' : 
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isValidating || (staffKey && (!staffKeyInfo.isValid || !staffKeyInfo.isProperFormat || staffKeyInfo.isAssigned))}
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
