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

const ExpertAdvisors = () => {
  const { toast } = useToast();

  const experts = [
    {
      name: "Trend Master Pro",
      icon: Star,
      description: "Advanced trend following strategy with dynamic position sizing",
      stats: "Win Rate: 68% | Profit Factor: 2.1",
    },
    {
      name: "Scalping Wizard",
      icon: Sparkles,
      description: "High-frequency trading bot optimized for short timeframes",
      stats: "Win Rate: 75% | Profit Factor: 1.8",
    },
    {
      name: "Smart Grid Expert",
      icon: Shield,
      description: "Intelligent grid trading system with risk management",
      stats: "Win Rate: 62% | Profit Factor: 2.4",
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
      <h1 className="text-2xl font-bold text-white mb-3">Home</h1>
      <div className="grid grid-cols-3 gap-3">
        {experts.map((expert) => (
          <Card
            key={expert.name}
            className="metric-card"
          >
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
                onClick={() => handleActivate(expert.name)}
                className="w-full bg-black/40 hover:bg-black/60 text-softWhite border border-mediumGray/20"
              >
                Activate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpertAdvisors;