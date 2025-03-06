
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useReferralCodeValidation } from "@/hooks/use-referral-code-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EnrollmentFixer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { referralInfo, isLoading: isValidating } = useReferralCodeValidation(referralCode);

  const handleFixEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !referralCode.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both email and referral code",
      });
      return;
    }

    if (!referralInfo.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Referral Code",
        description: "The referral code provided is invalid",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get user by email first
      const { data: authUser, error: authUserError } = await supabase.auth.admin.listUsers({
        filter: {
          email: email.trim()
        }
      });
      
      if (authUserError || !authUser || !authUser.users || authUser.users.length === 0) {
        console.error("Error finding auth user:", authUserError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find user with that email",
        });
        setIsLoading(false);
        return;
      }
      
      const userId = authUser.users[0].id;
      
      // Get user profile to confirm it exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (userError || !userData) {
        console.error("Error finding user profile:", userError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find user profile with that email",
        });
        setIsLoading(false);
        return;
      }
      
      // Update user's referred_by field
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode,  // Keep for backward compatibility
          enroller: referralCode      // Keep for backward compatibility
        })
        .eq('id', userData.id);
        
      if (updateError) {
        console.error("Error updating referral:", updateError);
        toast({
          variant: "destructive",
          title: "Error",
          description: updateError.message || "Failed to update referral information",
        });
        setIsLoading(false);
        return;
      }
      
      // Update license_keys and customer_accounts for consistency
      await supabase
        .from('license_keys')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode,
          enroller: referralCode
        })
        .eq('user_id', userData.id);
        
      await supabase
        .from('customer_accounts')
        .update({ 
          referred_by: referralCode,
          enrolled_by: referralCode
        })
        .eq('user_id', userData.id);
        
      await supabase
        .from('customers')
        .update({ 
          enroller: referralCode
        })
        .eq('id', userData.id);
      
      toast({
        title: "Success",
        description: "User referral information has been updated",
      });
      
      setEmail("");
      setReferralCode("");
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
          <CardTitle>Update User Referral</CardTitle>
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
            
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter 4-digit code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                required
                disabled={isLoading}
                className={`${
                  referralCode && !isValidating ? 
                    (referralInfo.isValid ? 'border-green-500' : 'border-red-500') : 
                    ''
                }`}
              />
              
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
                    User will be referred by {referralInfo.referrerName}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || isValidating || !referralInfo.isValid}
            >
              {isLoading ? "Updating Referral..." : "Update Referral"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentFixer;
