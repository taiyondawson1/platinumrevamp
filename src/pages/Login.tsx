
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);

  // Check if there's a pending registration request for this email
  const checkPendingRequest = async (email: string) => {
    const { data, error } = await supabase
      .from('customer_requests')
      .select('*')
      .eq('request_type', 'registration')
      .eq('status', 'pending')
      .like('description', `%${email}%`)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking pending request:", error);
      return false;
    }
    
    if (data) {
      setPendingRequestId(data.id);
      return true;
    }
    
    return false;
  };

  // Subscribe to real-time updates for the pending request
  useRealtimeSubscription({
    table: 'customer_requests',
    event: 'UPDATE',
    filter: pendingRequestId ? 'id' : undefined,
    filterValue: pendingRequestId || '',
    onDataChange: (payload) => {
      console.log("Received real-time update for request:", payload);
      if (payload.new.status === 'approved') {
        setPendingRequest(false);
        toast({
          title: "Registration Approved",
          description: "Your registration has been approved. You can now log in.",
        });
      } else if (payload.new.status === 'rejected') {
        toast({
          variant: "destructive",
          title: "Registration Rejected",
          description: "Your registration request has been rejected. Please contact support.",
        });
      }
    }
  });

  // Fetch the pending request ID when email changes
  useEffect(() => {
    if (email) {
      const getPendingRequestId = async () => {
        const { data, error } = await supabase
          .from('customer_requests')
          .select('id')
          .eq('request_type', 'registration')
          .eq('status', 'pending')
          .like('description', `%${email}%`)
          .maybeSingle();
        
        if (!error && data) {
          setPendingRequestId(data.id);
        }
      };
      
      getPendingRequestId();
    }
  }, [email, pendingRequest]);

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
      const hasPendingRequest = await checkPendingRequest(email);
      
      if (hasPendingRequest) {
        setPendingRequest(true);
        setIsLoading(false);
        return;
      }

      const { data: staffKeyData, error: staffKeyError } = await supabase
        .from('staff_keys')
        .select('status')
        .eq('key', staffKey)
        .eq('status', 'active')
        .maybeSingle();
      
      if (staffKeyError) {
        console.error("Staff key validation error:", staffKeyError);
        throw new Error(`Database error: ${staffKeyError.message}`);
      }
      
      if (!staffKeyData) {
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
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('staff_key')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
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

        if (!profileData) {
          console.error("No profile found");
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: "Could not find your profile. Please contact support.",
          });
          setIsLoading(false);
          return;
        }

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

  if (pendingRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-softWhite">Registration Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-darkGrey border-silver/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Account Pending Approval</AlertTitle>
              <AlertDescription>
                Your registration request has been submitted and is pending approval. 
                You will receive a confirmation email once your account has been approved.
              </AlertDescription>
            </Alert>
            <Button 
              type="button" 
              className="w-full" 
              onClick={() => {
                setPendingRequest(false);
                setEmail("");
                setPassword("");
                setStaffKey("");
              }}
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
