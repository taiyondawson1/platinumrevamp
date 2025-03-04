
import { supabase } from "./supabase";

export const registerApprovedUser = async (
  requestId: string,
  staffKey: string,
  handleBy: string
) => {
  try {
    // 1. Get the registration request
    const { data: requestData, error: requestError } = await supabase
      .from('customer_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !requestData) {
      console.error("Error fetching request:", requestError);
      return { success: false, error: requestError };
    }

    // Parse description to get user details
    const userDetails = JSON.parse(requestData.description);
    
    // 2. Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userDetails.email,
      password: userDetails.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          staff_key: userDetails.staff_key
        }
      }
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return { success: false, error: authError };
    }

    // 3. Update the request status
    const { error: updateError } = await supabase
      .from('customer_requests')
      .update({ 
        status: 'approved', 
        handled_by: handleBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error("Error updating request:", updateError);
      return { success: false, error: updateError };
    }

    return { success: true, data: authData };
  } catch (error) {
    console.error("Registration approval error:", error);
    return { success: false, error };
  }
};

export const rejectRegistrationRequest = async (
  requestId: string,
  handleBy: string
) => {
  try {
    const { error } = await supabase
      .from('customer_requests')
      .update({ 
        status: 'rejected', 
        handled_by: handleBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      console.error("Error rejecting request:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration rejection error:", error);
    return { success: false, error };
  }
};
