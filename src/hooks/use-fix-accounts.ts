
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useFixAccounts = () => {
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  /**
   * Fix user records by ensuring all required tables have records
   * 
   * @param userId Optional user ID to fix specific account
   * @param userEmail Optional email to fix specific account
   * @returns Promise<boolean> True if successful, false otherwise
   */
  const fixUserRecords = async (userId?: string, userEmail?: string) => {
    setIsFixing(true);
    
    try {
      // Call our edge function to fix the user records
      const { data, error } = await supabase.functions.invoke('fix-missing-user-records', {
        body: userId || userEmail ? { 
          userId, 
          userEmail, 
          fixSchema: true,  // Tell the function to also fix the schema
          fixTriggers: true // Tell the function to also fix triggers
        } : { 
          fixSchema: true, 
          fixTriggers: true 
        }
      });
      
      if (error) {
        console.error("Error fixing user records:", error);
        toast({
          variant: "destructive", 
          title: "Error", 
          description: "Failed to fix user records. Please try again."
        });
        return false;
      }
      
      console.log("User records fix response:", data);
      
      toast({
        title: "Success", 
        description: "User records have been fixed successfully."
      });
      
      return true;
    } catch (err) {
      console.error("Exception when fixing user records:", err);
      toast({
        variant: "destructive", 
        title: "Error", 
        description: "An unexpected error occurred while fixing user records."
      });
      return false;
    } finally {
      setIsFixing(false);
    }
  };
  
  return {
    isFixing,
    fixUserRecords,
  };
};
