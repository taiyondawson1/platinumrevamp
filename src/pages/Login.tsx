
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    
    setIsLoading(true);

    try {
      // First validate staff key
      const { data: staffKeyData, error: staffKeyError } = await supabase
        .from('staff_keys')
        .select('status')
        .eq('key', staffKey)
        .eq('status', 'active')
        .single();
      
      if (staffKeyError || !staffKeyData) {
        toast({
          variant: "destructive",
          title: "Invalid Staff Key",
          description: "The staff key provided is invalid or inactive",
        });
        setIsLoading(false);
        return;
      }

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

        // Allow login if staff key is not set in profile (legacy users) or if it matches
        if (profileData.staff_key && profileData.staff_key !== staffKey) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Invalid Staff Key",
            description: "The staff key doesn't match the one assigned to your account",
          });
          setIsLoading(false);
          return;
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
                className="bg-darkGrey border-silver/20"
              />
              <p className="text-xs text-silver/70">Enter the staff key provided by your account manager</p>
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/register")}
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
