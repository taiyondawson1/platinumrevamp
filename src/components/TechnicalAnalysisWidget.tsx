import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TechnicalAnalysisWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "15m",
      "width": 350,
      "isTransparent": false,
      "height": 400,
      "symbol": "FX:XAUUSD",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        const scriptElement = containerRef.current.querySelector("script");
        if (scriptElement) {
          scriptElement.remove();
        }
      }
    };
  }, []);

  console.log("Technical Analysis widget container rendered");

  return (
    <div className="chart-container h-[400px] w-[350px]">
      <div 
        ref={containerRef}
        className="tradingview-widget-container"
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default TechnicalAnalysisWidget;