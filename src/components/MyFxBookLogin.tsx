import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const MyFxBookLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<string | null>(null);
  const { toast } = useToast();

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
      {session && (
        <div className="mt-4 p-4 bg-darkGrey/50 rounded-md">
          <p className="text-sm text-mediumGray">Session ID:</p>
          <p className="text-sm font-mono text-softWhite break-all">{session}</p>
        </div>
      )}
    </div>
  );
};

export default MyFxBookLogin;