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
    <div className="p-10 ml-[240px]">
      <h1 className="text-2xl font-bold text-softWhite mb-10">Expert Advisors</h1>
      <div className="flex flex-col gap-8">
        {experts.map((expert) => (
          <div 
            key={expert.name}
            className="bg-darkBlue/40 backdrop-blur-sm rounded-xl p-6 border border-mediumGray/20 
                     hover:border-mediumGray/30 transition-all duration-300
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 
                            flex items-center justify-center p-4 border border-mediumGray/10">
                {expert.image ? (
                  <img src={expert.image} alt={expert.name} className="w-16 h-16" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40" />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-softWhite mb-2">{expert.name}</h2>
                  <p className="text-mediumGray leading-relaxed">{expert.description}</p>
                  {expert.subtitle && (
                    <p className="text-mediumGray/80 text-sm mt-2 leading-relaxed">{expert.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div className="text-sm text-mediumGray flex items-center">
                    <span className="inline-block mr-2">📄</span>
                    {expert.presets}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleBrowsePresets(expert.name)}
                      className="bg-indigo-500/20 hover:bg-indigo-500/30 text-softWhite px-6 
                               shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                               border border-indigo-500/30 hover:border-indigo-500/40"
                    >
                      Browse presets
                    </Button>
                    <Button
                      onClick={() => handleSetupGuide(expert.name)}
                      variant="outline"
                      className="border-mediumGray/20 hover:bg-mediumGray/10 text-mediumGray 
                               hover:text-softWhite transition-colors duration-300"
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