
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
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

      console.log("Staff key validated, proceeding with registration request...");

      // Create a customer request for account registration approval using supabase functions
      const response = await fetch('/.netlify/functions/create-registration-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: email.split('@')[0],
          request_type: 'registration',
          description: JSON.stringify({
            email,
            password, // Note: In production, consider more secure approaches
            staff_key: staffKey
          })
        })
      });

      console.log("Registration response status:", response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("Response text:", text);
        
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned an invalid response: ${text || 'Empty response'}`);
        }
        
        throw new Error(errorData.message || 'Failed to submit registration request');
      }
      
      const responseData = await response.json();
      console.log("Registration response data:", responseData);
      
      // Show success message
      setRequestSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your registration request has been submitted for approval. You will receive an email once it's approved."
      });

    } catch (error) {
      console.error("Registration error:", error);
      const message = error instanceof Error ? error.message : "Failed to register";
      setErrorMessage(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (requestSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-softWhite">Registration Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-darkGrey border-silver/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Registration Request Submitted</AlertTitle>
              <AlertDescription>
                Your registration request has been submitted and is pending approval by our staff. 
                You will receive a confirmation email once your account has been approved.
              </AlertDescription>
            </Alert>
            <Button 
              type="button" 
              className="w-full" 
              onClick={() => navigate("/login")}
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
            {errorMessage && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-200">
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
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
                className="bg-darkGrey border-silver/20"
              />
              <p className="text-xs text-silver/70">Enter the staff key provided by your account manager</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting Request..." : "Submit Registration Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
