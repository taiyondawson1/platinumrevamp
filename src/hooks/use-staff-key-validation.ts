
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StaffKeyInfo = {
  isValid: boolean;
  role: string | null;
  status: string | null;
  isAssigned: boolean;
  assignedUserId: string | null;
};

export const useStaffKeyValidation = (staffKey: string) => {
  const [staffKeyInfo, setStaffKeyInfo] = useState<StaffKeyInfo>({
    isValid: false,
    role: null,
    status: null,
    isAssigned: false,
    assignedUserId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial staff key info
  useEffect(() => {
    const fetchStaffKeyInfo = async () => {
      if (!staffKey.trim()) {
        setStaffKeyInfo({
          isValid: false,
          role: null,
          status: null,
          isAssigned: false,
          assignedUserId: null,
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check if this is a valid staff key format first
        const isCEO = /^CEO\d{3}$/.test(staffKey);
        const isADMIN = /^AD\d{4}$/.test(staffKey);
        const isENROLLER = /^EN\d{4}$/.test(staffKey);

        if (!isCEO && !isADMIN && !isENROLLER) {
          setStaffKeyInfo({
            isValid: false,
            role: null,
            status: null,
            isAssigned: false,
            assignedUserId: null,
          });
          setIsLoading(false);
          return;
        }

        // Fetch staff key info from database
        const { data, error } = await supabase
          .from('staff_keys')
          .select('key, role, status')
          .eq('key', staffKey)
          .single();

        if (error) {
          console.error("Error fetching staff key:", error);
          setStaffKeyInfo({
            isValid: false,
            role: null,
            status: null,
            isAssigned: false,
            assignedUserId: null,
          });
          setIsLoading(false);
          return;
        }

        // Check if key is assigned to any user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('staff_key', staffKey)
          .maybeSingle();

        if (profileError) {
          console.error("Error checking profile assignment:", profileError);
        }

        setStaffKeyInfo({
          isValid: data ? data.status === 'active' : false,
          role: data ? data.role : null,
          status: data ? data.status : null,
          isAssigned: profileData ? true : false,
          assignedUserId: profileData ? profileData.id : null,
        });
      } catch (e) {
        console.error("Error in staff key validation:", e);
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffKeyInfo();
  }, [staffKey]);

  // Set up real-time subscription for staff keys
  useEffect(() => {
    if (!staffKey.trim()) return;

    const staffKeysChannel = supabase
      .channel('staff-keys-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_keys',
          filter: `key=eq.${staffKey}`,
        },
        async (payload) => {
          console.log('Staff key changed:', payload);
          // Refresh staff key info
          try {
            const { data } = await supabase
              .from('staff_keys')
              .select('key, role, status')
              .eq('key', staffKey)
              .single();

            if (data) {
              setStaffKeyInfo(prev => ({
                ...prev,
                isValid: data.status === 'active',
                role: data.role,
                status: data.status,
              }));
            }
          } catch (e) {
            console.error("Error refreshing staff key info:", e);
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for profiles
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `staff_key=eq.${staffKey}`,
        },
        async (payload) => {
          console.log('Profile with this staff key changed:', payload);
          // Refresh assignment info
          try {
            const { data } = await supabase
              .from('profiles')
              .select('id')
              .eq('staff_key', staffKey)
              .maybeSingle();

            setStaffKeyInfo(prev => ({
              ...prev,
              isAssigned: data ? true : false,
              assignedUserId: data ? data.id : null,
            }));
          } catch (e) {
            console.error("Error refreshing profile assignment:", e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(staffKeysChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [staffKey]);

  return { staffKeyInfo, isLoading, error };
};
