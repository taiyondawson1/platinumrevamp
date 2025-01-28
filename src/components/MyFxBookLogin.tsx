import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MyFxBookResponse {
  error: boolean;
  message: string;
  session?: string;
}

const MyFxBookLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("myfxbook_session"));
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://www.myfxbook.com/api/login.json?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data: MyFxBookResponse = await response.json();

      if (!data.error && data.session) {
        toast({
          title: "Success",
          description: "Successfully logged in to MyFxBook",
        });
        localStorage.setItem("myfxbook_session", data.session);
        setIsLoggedIn(true);
      } else {
        throw new Error(data.message || "Failed to login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const session = localStorage.getItem("myfxbook_session");
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.myfxbook.com/api/logout.json?session=${encodeURIComponent(session)}`
      );

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      const data: MyFxBookResponse = await response.json();

      if (!data.error) {
        toast({
          title: "Success",
          description: data.message || "Successfully logged out",
        });
        localStorage.removeItem("myfxbook_session");
        setIsLoggedIn(false);
      } else {
        throw new Error(data.message || "Failed to logout");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MyFxBook Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogout} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>MyFxBook Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MyFxBookLogin;