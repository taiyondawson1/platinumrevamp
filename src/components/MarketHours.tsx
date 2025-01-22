import React, { useEffect, useRef } from "react";

const MarketHours = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MarketHours mounting...");
    console.log("Container dimensions:", {
      width: containerRef.current?.offsetWidth,
      height: containerRef.current?.offsetHeight
    });
  }, []);

  return (
    <div ref={containerRef} className="chart-container w-full">
      <div className="flex flex-col gap-2">
        <div className="w-full h-[400px]">
          <iframe 
            src="https://widget.myfxbook.com/widget/market-hours.html" 
            className="w-full h-full border-0"
            title="Market Hours"
            allow="fullscreen"
            loading="eager"
            onLoad={() => console.log("iframe loaded")}
          />
        </div>
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