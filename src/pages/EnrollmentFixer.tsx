
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useStaffKeyValidation } from "@/hooks/use-staff-key-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EnrollmentFixer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [staffKey, setStaffKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const { staffKeyInfo, isLoading: isValidating } = useStaffKeyValidation(staffKey);

  const fixEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !staffKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email and enrollment key are required",
      });
      return;
    }

    if (!staffKeyInfo.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Enrollment Key",
        description: "The enrollment key provided is invalid or inactive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log(`Fixing enrollment data for ${email} with key ${staffKey}`);
      
      const { data, error } = await supabase.functions.invoke('fix-enrollment-data', {
        body: { userEmail: email, enrollmentKey: staffKey }
      });

      if (error) {
        console.error("Error fixing enrollment data:", error);
        setResult({
          success: false,
          message: error.message || "Failed to fix enrollment data"
        });
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fix enrollment data",
        });
      } else {
        console.log("Fixed enrollment data:", data);
        setResult({
          success: true,
          message: "Successfully fixed enrollment data"
        });
        toast({
          title: "Success",
          description: "Enrollment data has been fixed",
        });
      }
    } catch (error) {
      console.error("Error fixing enrollment data:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fix enrollment data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-softWhite">Fix Enrollment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={fixEnrollment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-softWhite">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-darkGrey border-silver/20"
              />
              <p className="text-xs text-silver/70">
                Enter the email address of the user whose enrollment data needs to be fixed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staffKey" className="text-softWhite">Enrollment Key</Label>
              <Input
                id="staffKey"
                type="text"
                placeholder="Enrollment key"
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
                Enter the enrollment key that should be associated with this user (CEO###, AD####, or EN####)
              </p>
              
              {staffKey && !isValidating && !staffKeyInfo.isValid && (
                <Alert variant="destructive" className="mt-2 py-2">
                  <AlertDescription>
                    This enrollment key is invalid or inactive
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {result && (
              <Alert 
                variant={result.success ? "default" : "destructive"} 
                className={`mt-4 ${result.success ? 'bg-green-500/20 border-green-500' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  {result.success ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <AlertCircle className="h-4 w-4" />
                  }
                  <AlertDescription>{result.message}</AlertDescription>
                </div>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isValidating || !staffKeyInfo.isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing Enrollment Data...
                </>
              ) : "Fix Enrollment Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentFixer;
