
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, InfoIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [requestStatus, setRequestStatus] = useState("pending");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    staffKey?: string;
  }>({});

  // Subscribe to real-time updates for the customer_requests table
  useEffect(() => {
    if (!requestId) return;
    
    console.log("Setting up real-time subscription for request ID:", requestId);
    
    const channel = supabase
      .channel('registration-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_requests',
          filter: `id=eq.${requestId}`
        },
        (payload) => {
          console.log("Received real-time update:", payload);
          
          const newStatus = payload.new.status;
          setRequestStatus(newStatus);
          
          if (newStatus === 'approved') {
            toast({
              title: "Registration Approved!",
              description: "Your registration has been approved. You can now log in.",
            });
            setTimeout(() => navigate("/login"), 2000);
          } else if (newStatus === 'rejected') {
            toast({
              variant: "destructive",
              title: "Registration Rejected",
              description: "Your registration request has been rejected. Please contact support.",
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, navigate, toast]);

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      staffKey?: string;
    } = {};
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Staff key validation
    if (!staffKey.trim()) {
      errors.staffKey = "Staff key is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});
    
    if (!validateForm()) {
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
        setValidationErrors({ staffKey: "The staff key provided is invalid or inactive" });
        setIsLoading(false);
        return;
      }

      console.log("Staff key validated, proceeding with registration request...");

      // Create a customer request for account registration approval
      const requestBody = {
        customer_name: email.split('@')[0],
        request_type: 'registration',
        description: JSON.stringify({
          email,
          password, // Note: In production, consider more secure approaches
          staff_key: staffKey
        })
      };
      
      console.log("Sending registration request with body:", JSON.stringify(requestBody));

      // Create a customer request for account registration approval
      try {
        const response = await fetch('/.netlify/functions/create-registration-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log("Registration response status:", response.status);
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error("Error response:", responseText);
          
          let errorData;
          try {
            // Try to parse as JSON, but handle case where it's not valid JSON
            errorData = responseText ? JSON.parse(responseText) : { message: "Unknown error occurred" };
          } catch (e) {
            console.error("Failed to parse error response:", e);
            throw new Error(`Server returned an invalid response: ${responseText || "Empty response"}`);
          }
          
          throw new Error(errorData.message || 'Failed to submit registration request');
        }
        
        const responseText = await response.text();
        const responseData = responseText ? JSON.parse(responseText) : {};
        
        console.log("Registration response data:", responseData);
        
        // Save the request ID for real-time updates
        if (responseData.data && responseData.data[0]) {
          setRequestId(responseData.data[0].id);
        }
        
        // Show success message
        setRequestSubmitted(true);
        toast({
          title: "Request Submitted",
          description: "Your registration request has been submitted for approval. You will receive an email once it's approved."
        });
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }

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
            <CardTitle className="text-2xl font-bold text-softWhite">Registration {requestStatus !== "pending" ? requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1) : "Pending"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className={`bg-darkGrey border-silver/20 ${
              requestStatus === 'approved' ? 'border-green-500/50' : 
              requestStatus === 'rejected' ? 'border-red-500/50' : ''
            }`}>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>
                {requestStatus === 'approved' ? 'Registration Approved!' : 
                 requestStatus === 'rejected' ? 'Registration Rejected' : 
                 'Registration Request Submitted'}
              </AlertTitle>
              <AlertDescription>
                {requestStatus === 'approved' ? 
                  'Your registration has been approved. You will be redirected to the login page.' : 
                 requestStatus === 'rejected' ? 
                  'Your registration request has been rejected. Please contact support for assistance.' : 
                  'Your registration request has been submitted and is pending approval by our staff. You will see updates here when your account status changes.'}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col space-y-2">
              {requestStatus === 'pending' && (
                <div className="flex items-center justify-center space-x-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-silver" />
                  <span className="text-silver text-sm">Waiting for approval...</span>
                </div>
              )}
              <Button 
                type="button" 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
            </div>
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
                className={`bg-darkGrey border-silver/20 ${validationErrors.email ? 'border-red-500' : ''}`}
              />
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={`bg-darkGrey border-silver/20 ${validationErrors.password ? 'border-red-500' : ''}`}
              />
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className={`bg-darkGrey border-silver/20 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Staff Key"
                value={staffKey}
                onChange={(e) => setStaffKey(e.target.value)}
                required
                disabled={isLoading}
                className={`bg-darkGrey border-silver/20 ${validationErrors.staffKey ? 'border-red-500' : ''}`}
              />
              {validationErrors.staffKey ? (
                <p className="text-red-400 text-xs mt-1">{validationErrors.staffKey}</p>
              ) : (
                <p className="text-xs text-silver/70">Enter the staff key provided by your account manager</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : "Submit Registration Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
