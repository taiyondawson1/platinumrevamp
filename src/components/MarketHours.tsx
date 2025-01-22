import React, { useEffect, useRef } from "react";

const MarketHours = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MarketHours mounting...");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://widgets.myfxbook.com/scripts/fxMarketHours.js";
    script.async = true;

    script.onload = () => {
      console.log("Myfxbook script loaded");
      if (window.fxMarketHours) {
        console.log("Initializing Myfxbook widget");
        window.fxMarketHours();
      }
    };

    document.head.appendChild(script);

    return () => {
      console.log("MarketHours unmounting...");
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <div ref={containerRef} id="myfxbook-market-hours-widget"></div>
    </div>
  );
};

export default MarketHours;