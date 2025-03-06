
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
      // First check if the database schema needs to be updated
      try {
        console.log("Checking if database schema needs updating...");
        const { error: schemaError } = await supabase.functions.invoke('repair-customer-records');
        
        if (schemaError) {
          console.warn("Non-blocking warning: Schema repair error:", schemaError);
        }
      } catch (schemaErr) {
        console.warn("Non-blocking warning: Schema repair function error:", schemaErr);
      }
      
      // Call our edge function to fix the user records
      const { data, error } = await supabase.functions.invoke('fix-missing-user-records', {
        body: userId || userEmail ? { userId, userEmail } : undefined
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
      
      // Also try to fix the database triggers that create records automatically
      try {
        console.log("Fixing database triggers...");
        const { error: triggerError } = await supabase.functions.invoke('fix-handle-new-user');
        
        if (triggerError) {
          console.warn("Non-blocking warning: Trigger fix error:", triggerError);
        }
      } catch (triggerErr) {
        console.warn("Non-blocking warning: Trigger fix function error:", triggerErr);
      }
      
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
