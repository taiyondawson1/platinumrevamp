import { Shield, Star, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const ExpertAdvisors = () => {
  const { toast } = useToast();

  const experts = [
    {
      name: "Trend Master Pro",
      icon: Star,
      description: "Advanced trend following strategy with dynamic position sizing",
      stats: "Win Rate: 68% | Profit Factor: 2.1",
      path: "/expert-advisors/trend-master-pro"
    },
    {
      name: "Scalping Wizard",
      icon: Sparkles,
      description: "High-frequency trading bot optimized for short timeframes",
      stats: "Win Rate: 75% | Profit Factor: 1.8",
      path: "/expert-advisors/scalping-wizard"
    },
    {
      name: "Smart Grid Expert",
      icon: Shield,
      description: "Intelligent grid trading system with risk management",
      stats: "Win Rate: 62% | Profit Factor: 2.4",
      path: "/expert-advisors/smart-grid-expert"
    },
  ];

  const handleActivate = (expertName: string) => {
    toast({
      title: "Expert Advisor Activated",
      description: `${expertName} has been activated successfully.`,
    });
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold text-white mb-3 fixed top-8 left-24">Home</h1>
      <div className="grid grid-cols-3 gap-3 pt-32">
        {experts.map((expert) => (
          <Link to={expert.path} key={expert.name} className="block">
            <Card className="metric-card relative group overflow-hidden h-full transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 ease-in-out backdrop-blur-sm"></div>
              <CardHeader className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <expert.icon className="w-5 h-5 text-softWhite" />
                  <CardTitle className="text-softWhite text-lg">{expert.name}</CardTitle>
                </div>
                <CardDescription className="text-mediumGray text-sm">
                  {expert.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-mediumGray mb-3">{expert.stats}</p>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleActivate(expert.name);
                  }}
                  className="w-full bg-black/40 hover:bg-black/60 text-softWhite border border-mediumGray/20"
                >
                  Activate
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExpertAdvisors;