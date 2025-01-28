import { useEffect, useRef } from "react";

const TradingViewTickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          description: "",
          proName: "PYTH:XAUUSD"
        },
        {
          description: "",
          proName: "GBEBROKERS:DJ30"
        },
        {
          description: "",
          proName: "FX:EURUSD"
        },
        {
          description: "",
          proName: "BITSTAMP:BTCUSD"
        },
        {
          description: "",
          proName: "FX:GBPUSD"
        }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en"
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
    <div className="w-full bg-darkBlue/40 rounded-lg border border-mediumGray/20 p-4 mb-6">
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
        <div ref={containerRef}></div>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;