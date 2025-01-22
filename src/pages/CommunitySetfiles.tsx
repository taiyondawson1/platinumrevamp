import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, Info, ThumbsUp, Upload } from "lucide-react";
import { useState } from "react";

type Risk = "Low Risk" | "Medium Risk" | "High Risk";
type Timeframe = "1 MIN" | "5 MIN" | "15 MIN" | "30 MIN" | "1 HOUR" | "4 HOUR";

interface Setfile {
  name: string;
  author: string;
  risk: Risk;
  timeframe: Timeframe;
  pair: string;
  upvotes: number;
}

const CommunitySetfiles = () => {
  const { toast } = useToast();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe | null>(null);

  const setfiles: Setfile[] = [
    {
      name: "BOLT_15TF_SCALP_XAU",
      author: "Syed Hassan",
      risk: "Medium Risk",
      timeframe: "15 MIN",
      pair: "XAUUSD",
      upvotes: 111
    },
    {
      name: "15TF_BEST_BTCUSD_SCALPING_BOLT",
      author: "Syed Hassan",
      risk: "Medium Risk",
      timeframe: "15 MIN",
      pair: "BTCUSD",
      upvotes: 27
    }
  ];

  const handleUpload = () => {
    toast({
      title: "Upload Setfile",
      description: "This feature is coming soon!",
    });
  };

  const handleClearFilter = (type: 'risk' | 'timeframe') => {
    if (type === 'risk') setSelectedRisk(null);
    else setSelectedTimeframe(null);
  };

  const risks: Risk[] = ["Low Risk", "Medium Risk", "High Risk"];
  const timeframes: Timeframe[] = ["1 MIN", "5 MIN", "15 MIN", "30 MIN", "1 HOUR", "4 HOUR"];

  return (
    <div className="p-6 ml-[240px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-softWhite">Community Setfiles</h1>
          <p className="text-mediumGray mt-1">14 Setfiles</p>
        </div>
        <Button 
          onClick={handleUpload}
          className="bg-white/10 hover:bg-white/20 text-softWhite border-none"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Setfile
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-6 mb-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-mediumGray" />
              <span className="text-mediumGray">Risk</span>
            </div>
            {selectedRisk && (
              <button 
                onClick={() => handleClearFilter('risk')}
                className="text-sm text-[#FF6B6B] hover:text-[#FF8787]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {risks.map((risk) => (
              <Button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`h-8 text-sm ${
                  selectedRisk === risk
                    ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90'
                    : 'bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5]/20'
                }`}
              >
                {risk}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-mediumGray" />
              <span className="text-mediumGray">Timeframe</span>
            </div>
            {selectedTimeframe && (
              <button 
                onClick={() => handleClearFilter('timeframe')}
                className="text-sm text-[#FF6B6B] hover:text-[#FF8787]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`h-8 text-sm ${
                  selectedTimeframe === timeframe
                    ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90'
                    : 'bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5]/20'
                }`}
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Setfile listings */}
      <div className="space-y-4">
        {setfiles.map((setfile) => (
          <div 
            key={setfile.name}
            className="bg-darkBlue/40 rounded-lg p-4 border border-mediumGray/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-softWhite font-medium">{setfile.name}</h3>
                <p className="text-mediumGray text-sm mt-1">By {setfile.author}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-[#FFB86C]/20 text-[#FFB86C]">
                    {setfile.risk}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-[#00ADB5]/20 text-[#00ADB5]">
                    {setfile.timeframe}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-[#00ADB5]/20 text-[#00ADB5]">
                    {setfile.pair}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-mediumGray hover:text-softWhite"
                >
                  <Info className="w-4 h-4 mr-2" />
                  DETAILS
                </Button>
                <Button
                  className="bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5]/20"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {setfile.upvotes} UPVOTES
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySetfiles;