
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const MAX_ACCOUNTS = 5;

const LicenseKey = () => {
  const { toast } = useToast();
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [newAccount, setNewAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Fetch license key and account numbers
  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Error",
            description: "You must be logged in to view your license key",
            variant: "destructive",
          });
          return;
        }
        
        // Get license key for current user
        const { data: licenseData, error } = await supabase
          .from('license_keys')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found"
          throw error;
        }
        
        if (licenseData) {
          setLicenseKey(licenseData.license_key);
          setAccountNumbers(licenseData.account_numbers || []);
        } else {
          // Generate a new license key if none exists
          await createNewLicenseKey(user.id);
        }
      } catch (error) {
        console.error("Error fetching license data:", error);
        toast({
          title: "Error fetching license data",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLicenseData();
  }, [toast]);
  
  // Create a new license key
  const createNewLicenseKey = async (userId: string) => {
    try {
      // Generate a random license key
      const newKey = generateLicenseKey();
      
      // Insert new license key
      const { data, error } = await supabase
        .from('license_keys')
        .insert([
          { 
            user_id: userId, 
            license_key: newKey,
            account_numbers: [],
            status: 'active',
            subscription_type: 'standard',
            name: 'User', // Default values
            email: 'user@example.com',
            phone: '',
            product_code: 'EA-001',
            e_key: 'default'
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setLicenseKey(data.license_key);
        setAccountNumbers(data.account_numbers || []);
        toast({
          title: "License key generated",
          description: "A new license key has been generated for you",
        });
      }
    } catch (error) {
      console.error("Error creating license key:", error);
      toast({
        title: "Error creating license key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  // Generate a random license key
  const generateLicenseKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 4) result += "-";
    }
    return result;
  };
  
  // Add new account number
  const handleAddAccount = async () => {
    if (!newAccount.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account number",
        variant: "destructive",
      });
      return;
    }
    
    if (accountNumbers.includes(newAccount.trim())) {
      toast({
        title: "Error",
        description: "Account number already exists",
        variant: "destructive",
      });
      return;
    }
    
    if (accountNumbers.length >= MAX_ACCOUNTS) {
      toast({
        title: "Error",
        description: `Maximum ${MAX_ACCOUNTS} account numbers allowed. Please remove one first.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedAccounts = [...accountNumbers, newAccount.trim()];
      
      // Update license key record
      const { error } = await supabase
        .from('license_keys')
        .update({ account_numbers: updatedAccounts })
        .eq('license_key', licenseKey);
      
      if (error) throw error;
      
      setAccountNumbers(updatedAccounts);
      setNewAccount("");
      toast({
        title: "Success",
        description: "Account number added",
      });
    } catch (error) {
      console.error("Error adding account number:", error);
      toast({
        title: "Error adding account number",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  // Remove account number
  const handleRemoveAccount = async (accountNumber: string) => {
    try {
      const updatedAccounts = accountNumbers.filter(acc => acc !== accountNumber);
      
      // Update license key record
      const { error } = await supabase
        .from('license_keys')
        .update({ account_numbers: updatedAccounts })
        .eq('license_key', licenseKey);
      
      if (error) throw error;
      
      setAccountNumbers(updatedAccounts);
      toast({
        title: "Success",
        description: "Account number removed",
      });
    } catch (error) {
      console.error("Error removing account number:", error);
      toast({
        title: "Error removing account number",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  // Copy license key to clipboard
  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setIsCopied(true);
    toast({
      title: "Copied",
      description: "License key copied to clipboard",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <main className="flex-1 p-6 max-w-[1400px] mx-auto">
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-pulse text-softWhite">Loading license data...</div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-6">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-softWhite">License Key Management</h1>
          <p className="text-mediumGray text-lg max-w-2xl">
            Manage your license key and authorized MT4 account numbers here.
            You can add up to {MAX_ACCOUNTS} MT4 accounts with your license.
          </p>
        </section>
        
        {/* License Key Display */}
        <Card className="!rounded-none bg-darkBlue/60 border-silver/20 backdrop-blur-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-softWhite">Your License Key</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-darkGrey/50 p-4 border border-silver/20 font-mono text-lg text-softWhite">
              {licenseKey}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyKey}
              className="h-12 w-12"
            >
              {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-sm text-mediumGray">
            Use this key to activate your Expert Advisor. Keep your license key secure.
          </p>
        </Card>
        
        {/* Account Numbers Management */}
        <Card className="!rounded-none bg-darkBlue/60 border-silver/20 backdrop-blur-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-softWhite">MT4 Account Numbers</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Enter MT4 account number"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                className="flex-1 bg-darkGrey/50 border-silver/20"
              />
              <Button 
                onClick={handleAddAccount}
                disabled={accountNumbers.length >= MAX_ACCOUNTS}
                className="min-w-[100px]"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {accountNumbers.length === 0 ? (
              <div className="text-center p-4 text-mediumGray">
                No account numbers added yet. Add up to {MAX_ACCOUNTS} MT4 account numbers.
              </div>
            ) : (
              <div className="space-y-2">
                {accountNumbers.map((account, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-darkGrey/30 border border-silver/20"
                  >
                    <span className="font-mono text-softWhite">{account}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveAccount(account)}
                    >
                      <XCircle className="h-5 w-5 text-accent-red" />
                    </Button>
                  </div>
                ))}
                <div className="text-right text-sm text-mediumGray">
                  {accountNumbers.length} of {MAX_ACCOUNTS} accounts used
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Instructions */}
        <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-softWhite">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-mediumGray">
            <li>Copy your license key from above</li>
            <li>Paste the key into your Expert Advisor's LicenseKey variable</li>
            <li>Add your MT4 account numbers (up to {MAX_ACCOUNTS}) to authorize them</li>
            <li>The EA will only work on authorized accounts</li>
          </ol>
        </Card>
      </div>
    </main>
  );
};

export default LicenseKey;
