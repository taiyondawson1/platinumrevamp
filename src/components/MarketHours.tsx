import React, { useEffect, useRef } from "react";

const MarketHours = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MarketHours mounting...");
  }, []);

  return (
    <div className="chart-container">
      <div className="flex flex-col gap-2">
        <iframe 
          src="https://widget.myfxbook.com/widget/market-hours.html" 
          className="w-full h-[400px] border-0"
          title="Market Hours"
        />
        <div className="text-center text-sm text-lightGrey font-['Roboto',sans-serif]">
          <a 
            href="https://www.myfxbook.com/market-hours" 
            title="Forex Market Hours" 
            className="hover:text-neonBlue transition-colors"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <b>Market Hours</b>
          </a>
          {" "}by Myfxbook.com
        </div>
      </div>
    </div>
  );
};

export default MarketHours;