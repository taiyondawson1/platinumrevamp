
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReferralCodeInfo = {
  isValid: boolean;
  referrerRole: string | null;
  referrerName: string | null;
};

export const useReferralCodeValidation = (referralCode: string) => {
  const [referralInfo, setReferralInfo] = useState<ReferralCodeInfo>({
    isValid: false,
    referrerRole: null,
    referrerName: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch referral code info
  useEffect(() => {
    const fetchReferralInfo = async () => {
      if (!referralCode || referralCode.trim().length === 0) {
        setReferralInfo({
          isValid: false,
          referrerRole: null,
          referrerName: null,
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Query for the profile with the given referral code
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role, referred_by')
          .eq('referral_code', referralCode.trim())
          .maybeSingle();

        if (error) {
          console.error("Error validating referral code:", error);
          setReferralInfo({
            isValid: false,
            referrerRole: null,
            referrerName: null,
          });
          setError(error.message);
          setIsLoading(false);
          return;
        }

        // Get the user's name from customer or license_keys tables
        let referrerName = null;
        if (data) {
          const { data: userData } = await supabase
            .from('customers')
            .select('name, email')
            .eq('id', data.id)
            .maybeSingle();

          if (userData) {
            referrerName = userData.name || userData.email?.split('@')[0] || 'User';
          } else {
            const { data: licenseData } = await supabase
              .from('license_keys')
              .select('name, email')
              .eq('user_id', data.id)
              .maybeSingle();

            if (licenseData) {
              referrerName = licenseData.name || licenseData.email?.split('@')[0] || 'User';
            }
          }
        }

        setReferralInfo({
          isValid: !!data,
          referrerRole: data ? data.role : null,
          referrerName: referrerName,
        });
      } catch (e) {
        console.error("Error in referral code validation:", e);
        setError(e instanceof Error ? e.message : "Unknown error");
        setReferralInfo({
          isValid: false,
          referrerRole: null,
          referrerName: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralInfo();
  }, [referralCode]);

  // Set up real-time subscription for referral codes
  useEffect(() => {
    if (!referralCode || referralCode.trim().length === 0) return;

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `referral_code=eq.${referralCode.trim()}`,
        },
        async (payload) => {
          console.log('Profile changed:', payload);
          // Refresh referral code info
          try {
            const { data } = await supabase
              .from('profiles')
              .select('id, role')
              .eq('referral_code', referralCode.trim())
              .maybeSingle();

            let referrerName = null;
            if (data) {
              const { data: userData } = await supabase
                .from('customers')
                .select('name, email')
                .eq('id', data.id)
                .maybeSingle();

              if (userData) {
                referrerName = userData.name || userData.email?.split('@')[0] || 'User';
              }
            }

            if (data) {
              setReferralInfo(prev => ({
                ...prev,
                isValid: true,
                referrerRole: data.role,
                referrerName: referrerName,
              }));
            } else {
              setReferralInfo({
                isValid: false,
                referrerRole: null,
                referrerName: null,
              });
            }
          } catch (e) {
            console.error("Error refreshing referral code info:", e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [referralCode]);

  return { referralInfo, isLoading, error };
};
