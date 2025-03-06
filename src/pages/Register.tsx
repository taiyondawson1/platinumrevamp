
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useReferralCodeValidation } from "@/hooks/use-referral-code-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const { referralInfo, isLoading: isValidating } = useReferralCodeValidation(referralCode);

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

    setIsLoading(true);
    let debugData: any = {
      email,
      fullName,
      referralCode,
      referralInfo: JSON.parse(JSON.stringify(referralInfo))
    };

    try {
      // Run migration to ensure database is ready for referral code system
      try {
        console.log("Migrating to referral code system before registration...");
        const { error: migrationError } = await supabase.functions.invoke('migrate-to-referral-codes');
        if (migrationError) {
          console.warn("Non-blocking warning - Error during migration:", migrationError);
        }
      } catch (migrationErr) {
        console.warn("Non-blocking warning - Failed to call migration function:", migrationErr);
      }

      // Now proceed with registration with enhanced user data
      const userData = {
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            role: 'customer', // All users are customers by default
            name: fullName.trim() || email.split('@')[0], // Use name or default to email username
            referred_by: referralCode.trim() || null,
            enrolled_by: referralCode.trim() || null, // For backward compatibility
            phone: '', // Default empty phone
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
        
        // Ensure user records exist in both license_keys and customer_accounts tables
        try {
          // Trigger the repair function to ensure records exist
          const { error: repairError } = await supabase.functions.invoke('repair-customer-records', {
            body: { userId: data.user.id }
          });
          
          if (repairError) {
            console.warn("Non-blocking warning - Error ensuring customer records:", repairError);
          }
        } catch (repairErr) {
          console.warn("Non-blocking warning - Failed to ensure customer records:", repairErr);
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
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                disabled={isLoading}
                className={`bg-darkGrey border-silver/20 ${
                  referralCode && !isValidating ? 
                    (referralInfo.isValid ? 'border-green-500' : 'border-red-500') : 
                    ''
                }`}
              />
              <p className="text-xs text-silver/70">
                Enter a referral code if you have one (4 digits)
              </p>
              
              {referralCode && !isValidating && !referralInfo.isValid && (
                <Alert variant="destructive" className="mt-2 py-2">
                  <AlertDescription>
                    This referral code is invalid
                  </AlertDescription>
                </Alert>
              )}
              
              {referralCode && !isValidating && referralInfo.isValid && referralInfo.referrerName && (
                <Alert className="mt-2 py-2 bg-green-500/20 border-green-500 text-green-200">
                  <AlertDescription>
                    You're being referred by {referralInfo.referrerName}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || (referralCode && isValidating) || (referralCode && !referralInfo.isValid)}
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
