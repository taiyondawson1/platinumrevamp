import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyFxBookLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<MyFxBookAccount[]>([]);
  const { toast } = useToast();

  const fetchAccounts = async (sessionId: string) => {
    try {
      const response = await fetch(
        `https://www.myfxbook.com/api/get-my-accounts.json?session=${sessionId}`
      );
      const data = await response.json();

      if (!data.error && data.accounts) {
        setAccounts(data.accounts);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch accounts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch accounts data",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://www.myfxbook.com/api/login.json?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );
      const data = await response.json();

      if (!data.error && data.session) {
        setSession(data.session);
        toast({
          title: "Success",
          description: "Successfully logged in to MyFxBook",
        });
        await fetchAccounts(data.session);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to login",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to MyFxBook",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-black/40 rounded-xl p-6 border border-mediumGray/20">
      <h2 className="text-xl font-semibold mb-4 text-softWhite">MyFxBook Login</h2>
      {!session ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-darkGrey border-mediumGray/20"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-darkGrey border-mediumGray/20"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-darkGrey/50 rounded-md">
            <p className="text-sm text-mediumGray">Session ID:</p>
            <p className="text-sm font-mono text-softWhite break-all">{session}</p>
          </div>
          {accounts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-softWhite">Your Accounts</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Gain</TableHead>
                      <TableHead>Equity</TableHead>
                      <TableHead>Currency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="text-softWhite">{account.name}</TableCell>
                        <TableCell className="text-softWhite">
                          {account.balance.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-softWhite">
                          {account.gain.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-softWhite">
                          {account.equity.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-softWhite">{account.currency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyFxBookLogin;