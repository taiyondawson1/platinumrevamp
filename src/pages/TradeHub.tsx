import React from "react";
import Card from "@/components/Card";

const TradeHub = () => {
  return (
    <div className="p-4">
      <Card className="bg-[#141522]/40 border-0 p-4 backdrop-blur-sm rounded-lg shadow-[inset_0px_2px_4px_rgba(255,255,255,0.1)]">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-[#1D1F33]">
            <svg className="w-6 h-6 text-[#0EA5E9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Result 5 days ago</p>
            <p className="text-2xl font-bold text-white">0.00%</p>
            <p className="text-sm text-gray-400">+0.00$</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#141522]/40 border-0 p-4 backdrop-blur-sm rounded-lg shadow-[inset_0px_2px_4px_rgba(255,255,255,0.1)]">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-[#1D1F33]">
            <svg className="w-6 h-6 text-[#D946EF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Closed drawdown 5 days ago</p>
            <p className="text-2xl font-bold text-white">0.00%</p>
            <p className="text-sm text-gray-400">$0.00</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#141522]/40 border-0 p-4 backdrop-blur-sm rounded-lg shadow-[inset_0px_2px_4px_rgba(255,255,255,0.1)]">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-[#1D1F33]">
            <svg className="w-6 h-6 text-[#8B5CF6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Float</p>
            <p className="text-2xl font-bold text-white">$0.00</p>
            <p className="text-sm text-gray-400">0 orders</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TradeHub;
