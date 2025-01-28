import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TechnicalAnalysisLightWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": 425,
      "isTransparent": true,
      "height": 450,
      "symbol": "PYTH:XAUUSD",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "light"
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

  return (
    <div className="chart-container h-[450px] w-[425px]">
      <div 
        ref={containerRef}
        className="tradingview-widget-container"
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default TechnicalAnalysisLightWidget;