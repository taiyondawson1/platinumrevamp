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
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Expert Advisors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <Card
            key={expert.name}
            className="metric-card"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <expert.icon className="w-6 h-6 text-softWhite" />
                <CardTitle className="text-softWhite">{expert.name}</CardTitle>
              </div>
              <CardDescription className="text-mediumGray">
                {expert.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-mediumGray mb-4">{expert.stats}</p>
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