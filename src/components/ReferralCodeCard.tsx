
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Copy, Share2 } from "lucide-react";

const ReferralCodeCard = () => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferralCode = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          console.log("No user found");
          setIsLoading(false);
          return;
        }
        
        // Get user's referral code
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', userData.user.id)
          .maybeSingle();
          
        if (profileError || !profileData?.referral_code) {
          console.error("Error fetching referral code:", profileError);
          
          // Try to ensure user has a referral code by running migration
          try {
            await supabase.functions.invoke('migrate-to-referral-codes');
            
            // Check if code was generated
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .select('referral_code')
              .eq('id', userData.user.id)
              .maybeSingle();
              
            if (updatedProfile?.referral_code) {
              setReferralCode(updatedProfile.referral_code);
            }
          } catch (err) {
            console.error("Failed to generate referral code:", err);
          }
        } else {
          setReferralCode(profileData.referral_code);
        }
        
        // Count how many people used this referral code
        const { data: referrals, error: referralsError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('referred_by', referralCode);
          
        if (!referralsError) {
          setReferralCount(referrals?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferralCode();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareReferralCode = () => {
    const shareData = {
      title: 'Join with my referral code',
      text: `Use my referral code ${referralCode} to sign up!`,
      url: window.location.origin + '/register'
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .catch(err => console.error('Error sharing:', err));
    } else {
      copyToClipboard();
      toast({
        title: "Link Copied",
        description: "Share the link with your friends",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="h-6 w-24 animate-pulse bg-gray-300 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Input 
                className="font-mono text-lg text-center"
                value={referralCode}
                readOnly
              />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={shareReferralCode}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with friends! You have referred {referralCount} {referralCount === 1 ? 'person' : 'people'} so far.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralCodeCard;
