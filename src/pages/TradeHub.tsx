
import BitcoinAnalysisWidget from "@/components/BitcoinAnalysisWidget";
import CommunityOutlookWidget from "@/components/CommunityOutlookWidget";
import CustomWidget from "@/components/CustomWidget";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import ToolsBar from "@/components/ToolsBar";
import TotalGainCard from "@/components/TotalGainCard";
import WorldClocks from "@/components/WorldClocks";

const TradeHub = () => {
  return (
    <div className="p-6 min-h-screen bg-darkBase">
      {/* Tools Bar Section */}
      <ToolsBar />
      
      {/* World Clocks */}
      <div className="mb-6">
        <WorldClocks />
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Bitcoin Analysis Widget */}
          <div className="w-full bg-darkBlue/40 border border-mediumGray/20">
            <BitcoinAnalysisWidget />
          </div>
          
          {/* Total Gain Card */}
          <TotalGainCard />
          
          {/* Custom Widget */}
          <CustomWidget 
            session={localStorage.getItem("myfxbook_session") || ""}
            accountId="1234567"
            width={600}
            height={400}
          />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Community Outlook Widget */}
          <CommunityOutlookWidget symbol="eurusd" />
          
          {/* Open Orders Table */}
          <OpenOrdersTable orders={[]} />
        </div>
      </div>
    </div>
  );
};

export default TradeHub;
