import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type StaffKeyInfo = {
  isValid: boolean;
  role: string | null;
  status: string | null;
  isAssigned: boolean;
  assignedUserId: string | null;
  keyType: 'CEO' | 'ADMIN' | 'ENROLLER' | 'UNKNOWN' | null;
  isProperFormat: boolean;
};

export const useStaffKeyValidation = (staffKey: string) => {
  const [staffKeyInfo, setStaffKeyInfo] = useState<StaffKeyInfo>({
    isValid: false,
    role: null,
    status: null,
    isAssigned: false,
    assignedUserId: null,
    keyType: null,
    isProperFormat: false
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
          keyType: null,
          isProperFormat: false
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
        const isProperFormat = isCEO || isADMIN || isENROLLER;
        
        let keyType: StaffKeyInfo['keyType'] = null;
        if (isCEO) keyType = 'CEO';
        else if (isADMIN) keyType = 'ADMIN';
        else if (isENROLLER) keyType = 'ENROLLER';
        else keyType = 'UNKNOWN';

        if (!isProperFormat) {
          setStaffKeyInfo({
            isValid: false,
            role: null,
            status: null,
            isAssigned: false,
            assignedUserId: null,
            keyType,
            isProperFormat
          });
          setIsLoading(false);
          return;
        }

        // Get staff key info using the database function
        const { data: keyInfo, error: dbFunctionError } = await supabase
          .rpc('get_staff_key_info', { staff_key_param: staffKey });

        if (dbFunctionError) {
          console.error("Error calling get_staff_key_info:", dbFunctionError);
          
          // Fallback to direct query if the function fails
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
              keyType,
              isProperFormat
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
            keyType,
            isProperFormat
          });
        } else if (keyInfo && keyInfo.length > 0) {
          // Process data from the database function
          const info = keyInfo[0];
          setStaffKeyInfo({
            isValid: info.status === 'active',
            role: info.role,
            status: info.status,
            isAssigned: info.assigned_user !== null,
            assignedUserId: info.assigned_user || null,
            keyType,
            isProperFormat
          });
        } else {
          // No data returned from function
          setStaffKeyInfo({
            isValid: false,
            role: null,
            status: null,
            isAssigned: false,
            assignedUserId: null,
            keyType,
            isProperFormat
          });
        }
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

    // Channel for staff_keys table changes
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
            // Get updated key information
            const { data: keyInfo, error: dbFunctionError } = await supabase
              .rpc('get_staff_key_info', { staff_key_param: staffKey });

            if (dbFunctionError) {
              console.error("Error calling get_staff_key_info:", dbFunctionError);
              
              // Fallback to direct query
              const { data } = await supabase
                .from('staff_keys')
                .select('key, role, status')
                .eq('key', staffKey)
                .single();

              if (data) {
                // Keep existing properties but update what we know
                setStaffKeyInfo(prev => ({
                  ...prev,
                  isValid: data.status === 'active',
                  role: data.role,
                  status: data.status,
                }));
              }
            } else if (keyInfo && keyInfo.length > 0) {
              const info = keyInfo[0];
              setStaffKeyInfo(prev => ({
                ...prev,
                isValid: info.status === 'active',
                role: info.role,
                status: info.status,
                isAssigned: info.assigned_user !== null,
                assignedUserId: info.assigned_user || null,
              }));
            }
          } catch (e) {
            console.error("Error refreshing staff key info:", e);
          }
        }
      )
      .subscribe();

    // Channel for profiles table changes
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
            const { data: keyInfo, error: dbFunctionError } = await supabase
              .rpc('get_staff_key_info', { staff_key_param: staffKey });

            if (dbFunctionError) {
              console.error("Error calling get_staff_key_info:", dbFunctionError);
              
              // Fallback to direct query
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
            } else if (keyInfo && keyInfo.length > 0) {
              const info = keyInfo[0];
              setStaffKeyInfo(prev => ({
                ...prev,
                isAssigned: info.assigned_user !== null,
                assignedUserId: info.assigned_user || null,
              }));
            }
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

  // Helper method to check if user can use this key
  const canUserUseKey = (userId: string | null): boolean => {
    if (!staffKeyInfo.isValid || !staffKeyInfo.isProperFormat) {
      return false;
    }
    
    if (!staffKeyInfo.isAssigned) {
      return true; // Not assigned, so can be used
    }
    
    // Is assigned but checking if assigned to current user
    return userId !== null && staffKeyInfo.assignedUserId === userId;
  };

  return { 
    staffKeyInfo, 
    isLoading, 
    error,
    canUserUseKey
  };
};
