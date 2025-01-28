import { useEffect } from "react";

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TechnicalAnalysisWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": "OANDA:XAUUSD",
        "showIntervalTabs": true,
        "locale": "en",
        "colorTheme": "dark"
      }
    `;

    const widgetContainer = document.querySelector(".tradingview-widget-container__widget");
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && script) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-technical-widget min-w-[450px] h-[450px]">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TechnicalAnalysisWidget;