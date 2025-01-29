import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Info, X, Clock, CheckCircle, BarChart, Asterisk, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SetfilesPage = () => {
  const navigate = useNavigate();
  const [selectedRisk, setSelectedRisk] = useState<string>("Balanced");
  const [accountBalance, setAccountBalance] = useState<number>(100000);
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<string>("PlatinumAi: Pulse");

  const experts = [
    {
      name: "PlatinumAi: Pulse",
      description: "Advanced mean reversion strategy"
    },
    {
      name: "PlatinumAi: Stealth",
      description: "High-performance trading system"
    },
    {
      name: "PlatinumAi: Infinity",
      description: "Minimal intervention strategy"
    }
  ];

  const defaultRiskLevels = ["Ultrasoft", "Conservative", "Balanced", "Aggressive"];
  const stealthPhases = ["Phase 1", "Phase 2", "Live"];
  const infinityLevels = ["Trend", "Consolodation (XAUUSD)", "Consolodation (US30)", "STRIKER"];

  const getRiskLevels = () => {
    if (selectedExpert === "PlatinumAi: Stealth") return stealthPhases;
    if (selectedExpert === "PlatinumAi: Infinity") return infinityLevels;
    return defaultRiskLevels;
  };

  const getRiskLevelProfitPercentage = (risk: string): number => {
    switch (risk) {
      case "Ultrasoft":
        return 0.3;
      case "Conservative":
        return 0.4;
      case "Balanced":
        return 1.0;
      case "Aggressive":
        return 2.5;
      case "Phase 1":
        return 0.5; // Example value for Phase 1
      case "Phase 2":
        return 1.5; // Example value for Phase 2
      case "Live":
        return 2.0; // Example value for Live
      default:
        return 1.0;
    }
  };

  const getRiskLevelLossPercentage = (risk: string): number => {
    switch (risk) {
      case "Ultrasoft":
        return 4.5;
      case "Conservative":
        return 1.1;
      case "Balanced":
        return 2.3;
      case "Aggressive":
        return 4.5;
      case "Phase 1":
        return 1.0; // Example value for Phase 1
      case "Phase 2":
        return 2.0; // Example value for Phase 2
      case "Live":
        return 3.0; // Example value for Live
      default:
        return 2.3;
    }
  };

  const calculateDailyProfit = (balance: number, risk: string): number => {
    return (balance * getRiskLevelProfitPercentage(risk)) / 100;
  };

  const calculateMaxDailyLoss = (balance: number, risk: string): number => {
    return (balance * getRiskLevelLossPercentage(risk)) / 100;
  };

  const handleRiskSelect = (risk: string) => {
    console.log("Selected risk level:", risk);
    setSelectedRisk(risk);
  };

  const handleExpertSelect = (expert: string) => {
    console.log("Selected expert:", expert);
    setSelectedExpert(expert);
    // Reset risk selection when switching experts
    setSelectedRisk(expert === "PlatinumAi: Stealth" ? "Phase 1" : "Balanced");
  };

  const getRiskDescription = (risk: string) => {
    if (selectedExpert === "PlatinumAi: Stealth" && risk === "Phase 1") {
      return "Phase 1 approach with 1.5% risk.";
    }
    return risk === "Balanced" 
      ? "A balanced approach offering higher potential returns while maintaining reasonable risk control."
      : risk === "Conservative"
      ? "A conservative approach focused on capital preservation with moderate returns."
      : risk === "Ultrasoft"
      ? "The safest approach with minimal risk and steady, smaller returns."
      : risk === "Phase 1"
      ? "Phase 1 approach with controlled risk."
      : risk === "Phase 2"
      ? "Intermediate phase with moderate risk."
      : "An aggressive approach targeting maximum returns with higher risk tolerance.";
  };

  const getSymbolForSelectedRisk = () => {
    if (selectedExpert === "PlatinumAi: Infinity" && (selectedRisk === "Trend" || selectedRisk === "Consolodation (US30)")) {
      return "US30";
    }
    return selectedExpert === "PlatinumAi: Stealth" ? "US30" : "XAUUSD";
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/expert-advisors')}
          className="hover:bg-darkBlue/40"
        >
          <ArrowLeft className="h-5 w-5 text-mediumGray" />
        </Button>
      </div>

      <div className="flex justify-center items-center mb-8">
        <div className="flex gap-2 bg-darkBlue/40 p-1 rounded-lg">
          {experts.map((expert) => (
            <Button
              key={expert.name}
              onClick={() => handleExpertSelect(expert.name)}
              className={`px-6 py-2 h-10 transition-all duration-300 ${
                expert.name === selectedExpert
                  ? "bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 animate-[scale-in_0.2s_ease-out]"
                  : "bg-darkBlue/40 text-mediumGray hover:bg-darkBlue/60 hover:text-softWhite"
              }`}
            >
              <span className="animate-[fade-in_0.3s_ease-out]">{expert.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Alert 
            variant="destructive" 
            className="mb-6 bg-gradient-to-r from-red-950/80 to-red-900/80 border-red-800/30 
                       cursor-pointer hover:from-red-900/90 hover:to-red-800/90 
                       transition-all duration-300 shadow-lg backdrop-blur-sm"
          >
            <Info className="h-4 w-4 text-red-300" />
            <AlertDescription className="text-red-100 font-medium">
              Important: What You Need to Know About Risk
            </AlertDescription>
          </Alert>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-red-950/95 border-red-900/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-50 mb-4">Critical Market Conditions</AlertDialogTitle>
            <AlertDialogDescription className="text-red-200/90 space-y-6">
              <div className="space-y-4">
                <p>
                  While PlatinumAi Quantum's safety features provide robust protection, pay special attention when the EA opens its first trade during a strong trend. In rare cases, sustained market movement against this position may require manual intervention to protect your account.
                </p>

                <div>
                  <h3 className="text-red-50 font-medium mb-2">Daily Analysis Requirement</h3>
                  <p>
                    For Conservative, Balanced, and Aggressive setfiles, it's mandatory to follow our daily market analysis posted in the #daily-analysis channel. This analysis helps optimize your trading by aligning the EA with predicted market direction through the ForceMarketCond parameter.
                  </p>
                </div>

                <div>
                  <h3 className="text-red-50 font-medium mb-2">Recommended Safety Measures</h3>
                  <ul className="space-y-2 list-disc pl-4">
                    <li>Always disable the EA during high-impact news events</li>
                    <li>Monitor and close positions if market conditions deteriorate</li>
                    <li>Check #daily-analysis before each trading session</li>
                    <li>Update ForceMarketCond according to daily predictions</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-950 border-red-900/50 text-red-200 hover:bg-red-900/50 hover:text-red-100">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-[900px] mx-auto border border-mediumGray/20 rounded-xl p-8 bg-darkBlue/20 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-[fade-in_0.3s_ease-out]">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-softWhite tracking-tight mb-1">Setfiles</h1>
          <p className="text-mediumGray text-sm font-normal">Official Setfiles released by PlatinumAi</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2 bg-darkBlue/40 p-1 rounded-lg">
            {getRiskLevels().map((risk) => (
              <Button
                key={risk}
                onClick={() => handleRiskSelect(risk)}
                className={`px-6 py-2 h-10 transition-all duration-300 ${
                  risk === selectedRisk
                    ? risk === "Conservative" || risk === "Phase 1" 
                      ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 animate-[scale-in_0.2s_ease-out]"
                      : "bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 animate-[scale-in_0.2s_ease-out]"
                    : "bg-darkBlue/40 text-mediumGray hover:bg-darkBlue/60 hover:text-softWhite"
                }`}
              >
                <span className="animate-[fade-in_0.3s_ease-out]">{risk}</span>
              </Button>
            ))}
          </div>
          <Button className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 h-10 px-6">
            <Download className="w-5 h-5 mr-2" />
            Download Setfile
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-softWhite tracking-tight mb-2">{selectedRisk}</h2>
          <p className="text-mediumGray text-sm font-normal leading-relaxed">
            {getRiskDescription(selectedRisk)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_4px_20px rgba(0,0,0,0.25)]">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={`${
                  selectedRisk === "Aggressive" 
                    ? "bg-red-500/20 text-red-300"
                    : selectedRisk === "Conservative" || selectedRisk === "Phase 1" || selectedRisk === "Phase 2" || selectedRisk === "Live" 
                    ? "bg-blue-500/20 text-blue-300"
                    : selectedRisk === "Ultrasoft"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-orange-500/20 text-orange-300"
                } text-xs px-2 py-1 rounded flex items-center gap-1`}>
                  <Asterisk className="w-3 h-3" />
                  {selectedRisk === "Aggressive" 
                    ? "High Risk" 
                    : selectedRisk === "Conservative" || selectedRisk === "Phase 1" || selectedRisk === "Phase 2" || selectedRisk === "Live" 
                      ? "Low Risk" 
                      : selectedRisk === "Ultrasoft" 
                        ? "Minimal Risk" 
                        : "Medium Risk"}
                </span>
                <span className="text-softWhite text-sm font-semibold tracking-tight">Risk Level</span>
              </div>
              <p className="text-mediumGray text-sm font-normal">
                {selectedExpert === "PlatinumAi: Stealth" && selectedRisk === "Phase 1"
                  ? "Phase 1 approach with 1.5% risk."
                  : `${selectedRisk.toLowerCase()} approach with ${
                      selectedRisk === "Aggressive" ? "high" :
                      selectedRisk === "Conservative" || selectedRisk === "Phase 1" ? "low" :
                      selectedRisk === "Ultrasoft" ? "minimal" : "moderate"
                    } risk`
                }
              </p>
            </div>
          </Card>

          <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_4px_20px rgba(0,0,0,0.25)]">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                  {getSymbolForSelectedRisk()}
                </span>
                <span className="text-softWhite text-sm font-semibold tracking-tight">Symbol</span>
              </div>
              <p className="text-mediumGray text-sm font-normal">
                Primary trading instrument
              </p>
            </div>
          </Card>

          <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_4px_20px rgba(0,0,0,0.25)]">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {selectedExpert === "PlatinumAi: Stealth" ? "15 MIN" : "5 MIN"}
                </span>
                <span className="text-softWhite text-sm font-semibold tracking-tight">Timeframe</span>
              </div>
              <p className="text-mediumGray text-sm font-normal">
                Optimal trading interval for this strategy
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_8px_32px rgba(0,0,0,0.4)] h-full">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <span className="bg-green-500/10 text-green-300 text-xs px-4 py-1 rounded-lg whitespace-nowrap w-full flex items-center gap-1">
                    <BarChart className="w-3 h-3" />
                    Daily Targets
                  </span>
                </div>
                <h3 className="text-softWhite font-medium mb-0">Profit & Loss Limits</h3>
                <p className="text-xs text-mediumGray mb-4">Recommended daily targets based on account balance</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-mediumGray text-sm block mb-2">
                      Enter Account Balance:
                    </label>
                    <input
                      type="number"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Number(e.target.value))}
                      className="w-full bg-black/40 border border-mediumGray/20 rounded p-2 text-softWhite"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mediumGray text-sm">Daily Profit Target:</span>
                    <div className="flex items-center px-2 py-1 rounded bg-green-500/20 text-green-300">
                      <span className="font-bold text-[10px]">
                        ${calculateDailyProfit(accountBalance, selectedRisk).toFixed(2)}
                      </span>
                      <span className="ml-0.5 text-[10px]">
                        ({getRiskLevelProfitPercentage(selectedRisk)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mediumGray text-sm">Max Daily Loss:</span>
                    <div className="flex items-center px-2 py-1 rounded bg-red-500/20 text-red-300">
                      <span className="font-bold text-[10px]">
                        ${calculateMaxDailyLoss(accountBalance, selectedRisk).toFixed(2)}
                      </span>
                      <span className="ml-0.5 text-[10px]">
                        ({getRiskLevelLossPercentage(selectedRisk)}%)
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-mediumGray">
                    <p className="mb-1">Important: Use these exact values when configuring your EA</p>
                    <ul className="space-y-1 -mt-10">
                      <li>• DailyProfitTarget: 250 (2.5%)</li>
                      <li>• MaxDailyLoss: 450 (4.5%)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-mediumGray mt-2">Recommended daily targets based on account balance</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_8px_32px rgba(0,0,0,0.4)] h-full">
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center mb-4">
                    <span className={`${
                      selectedRisk === "Conservative" || selectedRisk === "Balanced" || selectedRisk === "Aggressive"
                        ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" 
                        : "bg-green-500/10 text-green-300"
                    } text-xs px-4 py-1 rounded-lg whitespace-nowrap w-full flex items-center gap-1`}>
                      <CheckCircle className="w-3 h-3" />
                      {selectedRisk === "Conservative" || selectedRisk === "Balanced" || selectedRisk === "Aggressive" 
                        ? "Daily Analysis Required" 
                        : "Hand-Free operation"}
                    </span>
                  </div>

                  {selectedRisk === "Conservative" || selectedRisk === "Balanced" || selectedRisk === "Aggressive" ? (
                    <div className="space-y-4">
                      <div className="bg-darkBlue/60 border border-mediumGray/20 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_10px_#0EA5E9] animate-pulse mt-[-4px]" />
                          <h3 className="text-softWhite font-bold text-lg mb-2">Market Direction</h3>
                        </div>
                        <p className="text-mediumGray text-sm mb-3">
                          Must be used in accordance with daily market analysis from #daily-analysis
                        </p>
                        <button 
                          onClick={() => setShowNewsDialog(true)}
                          className="text-[#0EA5E9] text-sm hover:underline"
                        >
                          Learn more about market analysis
                        </button>
                      </div>
                    </div>

                  ) : selectedRisk === "Ultrasoft" ? (
                    <>
                      <div className="mb-4">
                        <div className="bg-darkBlue/60 border border-mediumGray/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse"></div>
                            </div>
                            <span className="text-softWhite font-medium">Automated Trading</span>
                          </div>
                          <p className="text-mediumGray text-sm mb-4">
                            Can run autonomously with minimal intervention, except during high-impact news
                          </p>
                          <Button variant="link" className="text-green-400 p-0 h-auto" onClick={() => setShowNewsDialog(true)}>
                            Learn about news handling
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-mediumGray text-sm mb-6">
                        Automatically detect current market analysis from 4-day analysis
                      </p>
                      <div className="mt-auto">
                        <Button variant="link" className="text-green-400 p-0 h-auto" onClick={() => setShowNewsDialog(true)}>
                          Learn about news handling
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-darkBlue/40 border-mediumGray/20 shadow-[0_4px_20px rgba(0,0,0,0.25)] p-6">
            <h3 className="text-softWhite font-medium">Instructions</h3>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-mediumGray text-sm font-medium mb-2">Installation Steps</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-mediumGray/40 flex items-center justify-center text-xs">
                      1
                    </div>
                    Download and extract the setfile to your MT4 data folder
                  </li>
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-mediumGray/40 flex items-center justify-center text-xs">
                      2
                    </div>
                    Restart your trading platform
                  </li>
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-mediumGray/40 flex items-center justify-center text-xs">
                      3
                    </div>
                    Load the EA with the provided .set file
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-mediumGray text-sm font-medium mb-2">Best Practices</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-blue-400/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    Avoid trading during high impact news events
                  </li>
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-blue-400/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    Use a VPS for optimal performance
                  </li>
                  <li className="flex items-center gap-2 text-mediumGray text-sm">
                    <div className="w-4 h-4 rounded-full border border-blue-400/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    Monitor system performance regularly
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
        <DialogContent className="bg-darkBlue/95 border-mediumGray/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-softWhite">
              {selectedRisk === "Conservative" ? "Daily Market Analysis System" : "Hands-Free Operation Guide"}
            </DialogTitle>
          </DialogHeader>
          {selectedRisk === "Conservative" ? (
            <div className="text-mediumGray space-y-6">
              <div className="space-y-4">
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <h3 className="text-blue-300 font-medium mb-2">Daily Market Analysis</h3>
                  <p className="text-sm">
                    At the end of each trading day, our expert market analysts provide comprehensive trend predictions for the next trading session. These predictions are based on thorough technical analysis, market sentiment, and current market conditions.
                  </p>
                </div>

                <div className="bg-green-500/10 p-4 rounded-lg">
                  <h3 className="text-green-300 font-medium mb-2">Optimizing Your Strategy</h3>
                  <p className="text-sm">
                    Each analysis includes a recommended bias for the FundedEA strategy to optimize your EA settings. This crucial parameter helps the EA to either buy or sell based on your strategy within the predicted market direction.
                  </p>
                </div>

                <div className="bg-red-500/10 p-4 rounded-lg">
                  <h3 className="text-red-300 font-medium mb-2">Important Note</h3>
                  <p className="text-sm">
                    For optimal results, always check the #daily_analysis channel on Discord before starting your trading session and adjust your EA settings according to the provided recommendations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-mediumGray">
              <p className="mb-4">Important guidelines for automated trading</p>
              
              <div className="space-y-6">
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <h3 className="text-green-300 font-medium">Automated Operation</h3>
                  </div>
                  <p className="text-sm">
                    The Ultrasafe setfile is designed to operate autonomously with minimal user intervention. Its conservative approach and built-in safety features allow for hands-free operation during normal market conditions.
                  </p>
                </div>

                <div className="bg-red-500/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-300">
                      ⚠
                    </div>
                    <h3 className="text-red-300 font-medium">News Event Handling</h3>
                  </div>
                  <p className="text-sm">
                    While the EA can run autonomously, it's crucial to disable it before high-impact news events and re-enable it afterward. This precaution helps avoid potential market volatility risks.
                  </p>
                </div>

                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    </div>
                    <h3 className="text-blue-300 font-medium">Optional Analysis</h3>
                  </div>
                  <p className="text-sm">
                    For enhanced performance, you can optionally follow our daily market analysis on Discord. While not required for Ultrasafe, this additional insight can help optimize your trading results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SetfilesPage;
