import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const MT4ConnectionForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('mt4_accounts')
        .insert([
          {
            account_number: accountNumber,
            server: server,
            // Note: In a production environment, you should never store plain text passwords
            // This is just for demo purposes
            password: password,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "MT4 account connected successfully!",
      });

      // Clear form
      setAccountNumber("");
      setPassword("");
      setServer("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to connect MT4 account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-softWhite">Connect MT4 Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="accountNumber" className="text-sm font-medium text-softWhite">
              Account Number
            </label>
            <Input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your MT4 account number"
              className="bg-darkBase/50 border-mediumGray/20 text-softWhite"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="server" className="text-sm font-medium text-softWhite">
              Server
            </label>
            <Input
              id="server"
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              placeholder="Enter your MT4 server address"
              className="bg-darkBase/50 border-mediumGray/20 text-softWhite"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-softWhite">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your MT4 password"
              className="bg-darkBase/50 border-mediumGray/20 text-softWhite"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MT4ConnectionForm;