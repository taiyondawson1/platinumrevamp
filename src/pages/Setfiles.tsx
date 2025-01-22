import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const SetfilesPage = () => {
  const [selectedRisk, setSelectedRisk] = useState<string>("Balanced");
  const [accountBalance, setAccountBalance] = useState<number>(100000);

  const riskLevels = ["Ultrasoft", "Conservative", "Balanced", "Aggressive"];

  const getRiskLevelProfitPercentage = (risk: string): number => {
    switch (risk) {
      case "Ultrasoft":
        return 1.0;
      case "Conservative":
        return 0.4;
      case "Balanced":
        return 1.0;
      case "Aggressive":
        return 2.5;
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

  return (
    <div className="flex-1 p-6 ml-[240px]">
      <div className="max-w-[900px] mx-auto mt-8 border border-mediumGray/20 rounded-xl p-8 bg-darkBlue/20 backdrop-blur-sm">
        {/* Risk Alert */}
        <Alert variant="destructive" className="mb-6 bg-red-50/10 border-red-200/20">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            Important: What You Need to Know About Risk
          </AlertDescription>
        </Alert>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-softWhite mb-1">Setfiles</h1>
          <p className="text-mediumGray text-sm">Official Setfiles released by FundedEA</p>
        </div>

        {/* Risk Level Selector */}
        <div className="flex gap-2 mb-8 bg-darkBlue/40 p-1 rounded-lg w-fit">
          {riskLevels.map((risk) => (
            <Button
              key={risk}
              onClick={() => handleRiskSelect(risk)}
              className={`text-sm ${
                risk === selectedRisk
                  ? "bg-white text-black hover:bg-white/90"
                  : "text-mediumGray hover:text-softWhite"
              }`}
            >
              {risk}
            </Button>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-softWhite mb-2">{selectedRisk}</h2>
          <p className="text-mediumGray">
            {selectedRisk === "Balanced" 
              ? "A balanced approach offering higher potential returns while maintaining reasonable risk control"
              : selectedRisk === "Conservative"
              ? "A conservative approach focused on capital preservation with moderate returns"
              : selectedRisk === "Ultrasoft"
              ? "The safest approach with minimal risk and steady, smaller returns"
              : "An aggressive approach targeting maximum returns with higher risk tolerance"}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Risk Level Card */}
          <Card className="bg-darkBlue/40 border-mediumGray/20">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={`${
                  selectedRisk === "Aggressive" 
                    ? "bg-red-500/20 text-red-300"
                    : selectedRisk === "Conservative"
                    ? "bg-blue-500/20 text-blue-300"
                    : selectedRisk === "Ultrasoft"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-orange-500/20 text-orange-300"
                } text-xs px-2 py-1 rounded`}>
                  {selectedRisk === "Aggressive" ? "High Risk" : 
                   selectedRisk === "Conservative" ? "Low Risk" :
                   selectedRisk === "Ultrasoft" ? "Minimal Risk" : "Medium Risk"}
                </span>
                <span className="text-mediumGray text-sm">Risk Level</span>
              </div>
              <p className="text-mediumGray text-sm">
                {selectedRisk.toLowerCase()} approach with {
                  selectedRisk === "Aggressive" ? "high" :
                  selectedRisk === "Conservative" ? "low" :
                  selectedRisk === "Ultrasoft" ? "minimal" : "moderate"
                } risk
              </p>
            </div>
          </Card>

          {/* Symbol Card */}
          <Card className="bg-darkBlue/40 border-mediumGray/20">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                  XAUUSD
                </span>
                <span className="text-mediumGray text-sm">Symbol</span>
              </div>
              <p className="text-mediumGray text-sm">
                Primary trading instrument
              </p>
            </div>
          </Card>

          {/* Timeframe Card */}
          <Card className="bg-darkBlue/40 border-mediumGray/20">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-mediumGray text-sm">5 MIN</span>
                <span className="text-mediumGray text-sm">Timeframe</span>
              </div>
              <p className="text-mediumGray text-sm">
                Optimal trading interval for this strategy
              </p>
            </div>
          </Card>
        </div>

        {/* Profit & Loss and Market Direction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profit & Loss Card - spans 2 columns */}
          <div className="md:col-span-2">
            <Card className="bg-darkBlue/40 border-mediumGray/20 h-full">
              <div className="p-4">
                <h3 className="text-softWhite font-medium mb-4">Profit & Loss Limits</h3>
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
                    <span className="text-green-400">
                      ${calculateDailyProfit(accountBalance, selectedRisk).toFixed(2)} ({getRiskLevelProfitPercentage(selectedRisk)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mediumGray text-sm">Max Daily Loss:</span>
                    <span className="text-red-400">
                      ${calculateMaxDailyLoss(accountBalance, selectedRisk).toFixed(2)} ({getRiskLevelLossPercentage(selectedRisk)}%)
                    </span>
                  </div>
                  <div className="mt-4 text-xs text-mediumGray">
                    <p className="mb-1">Important: Use these exact values when configuring your EA</p>
                    <ul className="space-y-1">
                      <li>• DailyProfitTarget: 250 (2.5%)</li>
                      <li>• MaxDailyLoss: 450 (4.5%)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Market Direction Card */}
          <div className="md:col-span-1">
            <Card className="bg-darkBlue/40 border-mediumGray/20 h-full">
              <div className="p-4">
                <h3 className="text-softWhite font-medium mb-4">Market Direction</h3>
                <p className="text-mediumGray text-sm mb-4">
                  Automatically detect current market analysis from 4-day analysis
                </p>
                <Button variant="link" className="text-blue-400 p-0 h-auto">
                  Learn more about market analysis
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="space-y-6">
          <h3 className="text-softWhite font-medium">Instructions</h3>
          
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

        {/* Download Button */}
        <div className="fixed bottom-8 right-8">
          <Button className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
            <Download className="w-4 h-4 mr-2" />
            Download Setfile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetfilesPage;
