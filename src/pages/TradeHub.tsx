import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import HistoryTable from "@/components/HistoryTable";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import BitcoinAnalysisWidget from "@/components/BitcoinAnalysisWidget";
import US30AnalysisWidget from "@/components/US30AnalysisWidget";
import CommunityOutlookWidget from "@/components/CommunityOutlookWidget";
import DailyDataWidget from "@/components/DailyDataWidget";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";
import DailyGainChart from "@/components/DailyGainChart";

const TradeHub = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const session = localStorage.getItem("myfxbook_session");
      if (!session) return;

      try {
        const response = await fetch(
          `https://www.myfxbook.com/api/get-my-accounts.json?session=${encodeURIComponent(
            session
          )}`
        );
        const data = await response.json();

        if (!data.error && data.accounts) {
          setAccounts(data.accounts);
          if (data.accounts.length > 0) {
            setSelectedAccount(data.accounts[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <select
          value={selectedAccount || ""}
          onChange={handleAccountChange}
          className="bg-darkBlue text-softWhite p-2 rounded-md border border-gray-700"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-b from-[#1D1F33] to-[#141522]/40 border-0 p-4 backdrop-blur-sm rounded-lg shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-[#1D1F33]">
              <svg className="w-6 h-6 text-[#0EA5E9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Last 30 days</p>
              <h4 className="text-2xl font-bold text-white">$71.650</h4>
            </div>
          </div>
        </Card>

        <Card className="bg-darkBlue p-4">
          <DailyDataWidget accountId={selectedAccount || undefined} />
        </Card>

        <Card className="bg-darkBlue p-4">
          <BitcoinAnalysisWidget />
        </Card>

        <Card className="bg-darkBlue p-4">
          <US30AnalysisWidget />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-darkBlue p-4">
          <OpenOrdersTable accountId={selectedAccount || undefined} />
        </Card>
        <Card className="bg-darkBlue p-4">
          <HistoryTable accountId={selectedAccount || undefined} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="bg-darkBlue p-4">
          <DailyGainChart accountId={selectedAccount || undefined} />
        </Card>
        <Card className="bg-darkBlue p-4">
          <CommunityOutlookWidget />
        </Card>
      </div>

      <Card className="bg-darkBlue p-4">
        <TradingViewTickerTape />
      </Card>
    </div>
  );
};

export default TradeHub;
