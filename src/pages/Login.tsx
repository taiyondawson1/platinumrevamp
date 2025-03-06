
import { useState, useEffect } from "react";
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
    let debugData: any = {
      email
    };

    try {
      console.log("Attempting login with email:", email);
      
      try {
        console.log("Fixing database triggers before login...");
        const { error: fixError } = await supabase.functions.invoke('fix-handle-new-user');
        if (fixError) {
          console.warn("Non-blocking warning - Error fixing triggers:", fixError);
        }
      } catch (fixErr) {
        console.warn("Non-blocking warning - Failed to call fix function:", fixErr);
      }
      
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
          try {
            console.log("Repairing customer records if needed...");
            const { error: repairError } = await supabase.functions.invoke('repair-customer-records');
            if (repairError) {
              console.warn("Non-blocking warning - Error repairing customer records:", repairError);
            }
          } catch (repairErr) {
            console.warn("Non-blocking warning - Failed to repair customer records:", repairErr);
          }

          let { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, staff_key, enrolled_by, enroller')
            .eq('id', data.user.id)
            .maybeSingle();
          
          debugData.profileData = profileData;
          debugData.profileError = profileError;
          
          if (profileError || !profileData) {
            console.error("Profile fetch error or missing profile:", profileError);
            setDebugInfo(debugData);
            
            try {
              console.log("Attempting to fix profile issues...");
              const { error: fixError } = await supabase.functions.invoke('fix-handle-new-user');
              if (fixError) {
                console.error("Error fixing triggers:", fixError);
              }

              const { data: retryProfileData, error: retryProfileError } = await supabase
                .from('profiles')
                .select('role, staff_key, enrolled_by, enroller')
                .eq('id', data.user.id)
                .maybeSingle();
                
              if (retryProfileError || !retryProfileData) {
                const { error: createProfileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    role: 'customer',
                    staff_key: null
                  })
                  .single();
                
                if (createProfileError) {
                  console.error("Failed to create profile as last resort:", createProfileError);
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
                
                debugData.retryProfileData = { role: 'customer', staff_key: null };
                profileData = { role: 'customer', staff_key: null };
                console.log("Created new profile as last resort");
              } else {
                debugData.retryProfileData = retryProfileData;
                profileData = retryProfileData;
                console.log("Successfully fixed and fetched profile:", retryProfileData);
              }
            } catch (fixErr) {
              console.error("Error calling fix function:", fixErr);
              
              try {
                const { error: createProfileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    role: 'customer',
                    staff_key: null
                  })
                  .single();
                
                if (createProfileError) {
                  console.error("Failed to create profile as last resort:", createProfileError);
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
                
                debugData.retryProfileData = { role: 'customer', staff_key: null };
                profileData = { role: 'customer', staff_key: null };
                console.log("Created new profile as last resort");
              } catch (createErr) {
                console.error("Error in last resort profile creation:", createErr);
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
          }

          const userRole = profileData?.role || 'customer';
          console.log("User role:", userRole);
          debugData.userRole = userRole;

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
