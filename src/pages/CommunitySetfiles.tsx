import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share2, MessageSquare } from "lucide-react";

const CommunitySetfiles = () => {
  const { toast } = useToast();

  const communitySetfiles = [
    {
      name: "FTMO Challenge Preset",
      author: "ZennTrader",
      description: "Optimized for passing FTMO's phase 1 challenge. Conservative approach with strict risk management.",
      downloads: 1247,
      comments: 32,
    },
    {
      name: "MyForexFunds Aggressive",
      author: "AlgoMaster",
      description: "High-performance settings for experienced traders. Designed for MyForexFunds evaluation phase.",
      downloads: 856,
      comments: 24,
    },
    {
      name: "True Forex Funds Basic",
      author: "PipHunter",
      description: "Balanced configuration suitable for True Forex Funds challenges. Focus on consistent gains.",
      downloads: 673,
      comments: 18,
    }
  ];

  const handleDownload = (setfileName: string) => {
    toast({
      title: "Downloading Setfile",
      description: `Downloading ${setfileName}...`,
    });
  };

  return (
    <div className="p-4 ml-[240px]">
      <h1 className="text-xl font-semibold text-softWhite mb-4">Community Setfiles</h1>
      <div className="grid gap-3">
        {communitySetfiles.map((setfile) => (
          <div 
            key={setfile.name}
            className="bg-darkBlue/40 backdrop-blur-sm rounded-lg p-3 border border-mediumGray/20 
                     hover:border-mediumGray/30 transition-all duration-300
                     shadow-[0_4px_20px_rgb(0,0,0,0.1)]"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-softWhite">{setfile.name}</h3>
                  <p className="text-xs text-mediumGray">by {setfile.author}</p>
                </div>
                <Button
                  onClick={() => handleDownload(setfile.name)}
                  size="sm"
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 text-softWhite px-3 
                           shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                           border border-indigo-500/30 hover:border-indigo-500/40 text-xs h-7"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
              <p className="text-sm text-mediumGray leading-relaxed">{setfile.description}</p>
              <div className="flex items-center gap-4 text-xs text-mediumGray">
                <span className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  {setfile.downloads.toLocaleString()} downloads
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {setfile.comments} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySetfiles;