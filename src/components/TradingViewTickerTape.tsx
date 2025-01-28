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
          proName: "FX:EURUSD"
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
    <div className="fixed left-0 right-0 top-[200px] z-50">
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
        <div ref={containerRef}></div>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;