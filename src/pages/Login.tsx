
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    let debugData: any = { email };

    try {
      // Ensure database is migrated to referral system
      try {
        console.log("Ensuring referral code system is set up...");
        const { error: migrationError } = await supabase.functions.invoke('migrate-to-referral-codes');
        if (migrationError) {
          console.warn("Non-blocking warning - Error during migration:", migrationError);
        }
      } catch (migrationErr) {
        console.warn("Non-blocking warning - Failed to call migration function:", migrationErr);
      }
      
      // Perform login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
        // Check if user has a referral code
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('referral_code, role')
          .eq('id', data.user.id)
          .maybeSingle();
          
        debugData.profileData = profileData;
        
        if (profileError || !profileData?.referral_code) {
          console.log("User doesn't have a referral code, generating one...");
          try {
            await supabase.functions.invoke('migrate-to-referral-codes');
            
            // Verify the code was created
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('referral_code')
              .eq('id', data.user.id)
              .maybeSingle();
              
            if (updatedProfile?.referral_code) {
              console.log("Generated new referral code:", updatedProfile.referral_code);
            }
          } catch (err) {
            console.warn("Non-blocking warning - Failed to generate referral code:", err);
          }
        }
        
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/dashboard");
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
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
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
