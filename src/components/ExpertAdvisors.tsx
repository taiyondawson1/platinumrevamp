import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const ExpertAdvisors = () => {
  const { toast } = useToast();

  const experts = [
    {
      name: "Zennbot Nexus",
      image: "/lovable-uploads/12df9962-125a-4b67-8df4-2d76c0473e9d.png",
      description: "Cutting-edge EA utilizing mean reversion strategies to capitalize on consolidating market periods, delivering outstanding results on both personal and funded accounts.",
      subtitle: "Perfect for passing prop firm challenges and seamlessly managing all stages of a prop firm account, from qualification to consistent profitability.",
      presets: "8 presets available",
      path: "/expert-advisors/zennbot-nexus"
    },
    {
      name: "Zennbot Prime",
      description: "Our most advanced bot. Use with caution.",
      presets: "7 presets available",
      path: "/expert-advisors/zennbot-prime"
    },
    {
      name: "Zennbot Zero",
      description: "Minimal manual intervention required, with a \"one shot, one entry at a time\" approach. Utilizes dynamic trailing stop-losses to lock in profits as trades move in your favor. Simply run it as-is and let it work its magic.",
      subtitle: "Ideal for personal capital, with plans underway to optimize it for prop firm capital - stay tuned!",
      presets: "5 presets available",
      path: "/expert-advisors/zennbot-zero"
    },
  ];

  const handleBrowsePresets = (expertName: string) => {
    toast({
      title: "Accessing Presets",
      description: `Loading presets for ${expertName}...`,
    });
  };

  const handleSetupGuide = (expertName: string) => {
    toast({
      title: "Setup Guide",
      description: `Opening setup guide for ${expertName}...`,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-4">Expert Advisors</h1>
      <div className="flex flex-col gap-4">
        {experts.map((expert) => (
          <div 
            key={expert.name}
            className="bg-[#0D1117]/60 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                {expert.image ? (
                  <img src={expert.image} alt={expert.name} className="w-14 h-14" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-1">{expert.name}</h2>
                <p className="text-gray-300 text-sm mb-1">{expert.description}</p>
                {expert.subtitle && (
                  <p className="text-gray-400 text-xs mb-2">{expert.subtitle}</p>
                )}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400">
                    <span className="inline-block mr-1">📄</span>
                    {expert.presets}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBrowsePresets(expert.name)}
                      className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white text-xs px-3 py-1 h-8 rounded-full shadow-embossed hover:shadow-embossed-hover transition-all duration-300"
                    >
                      Browse presets
                    </Button>
                    <Button
                      onClick={() => handleSetupGuide(expert.name)}
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-800 text-gray-300 text-xs px-3 py-1 h-8"
                    >
                      Setup guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertAdvisors;