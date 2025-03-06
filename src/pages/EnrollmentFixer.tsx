
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const EnrollmentFixer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFixEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a valid email address",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('fix-enrollment-data', {
        body: { userEmail: email }
      });
      
      if (error) {
        console.error("Error fixing enrollment data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fix enrollment data",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "User enrollment data has been fixed",
      });
      
      setEmail("");
    } catch (error) {
      console.error("Error fixing enrollment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Fix User Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFixEnrollment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Fixing Enrollment..." : "Fix Enrollment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentFixer;
