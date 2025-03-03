
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const TradingViewTickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      // Clear previous instances first
      containerRef.current.innerHTML = "";
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
  }, [isDesktop]);

  return (
    <div className="fixed left-0 right-0 top-[85px] lg:top-[135px] z-50">
      <div className="max-w-[1900px] mx-auto pr-4 lg:pr-[44px] relative">
        <div className="absolute left-4 lg:left-[44px] -top-[50px] lg:-top-[90px]">
          <h1 className="text-[28px] lg:text-[40px] font-bold text-softWhite">PlatinumAI</h1>
          <div className="text-xs lg:text-sm text-silver mt-2 space-x-2 lg:space-x-4 overflow-x-auto whitespace-nowrap">
            <span className="underline hover:text-softWhite transition-colors cursor-pointer">TradeHub</span>
            <span className="text-silver hidden lg:inline">•</span>
            <span className="underline hover:text-softWhite transition-colors cursor-pointer">Expert Advisors</span>
            <span className="text-silver hidden lg:inline">•</span>
            <span className="underline hover:text-softWhite transition-colors cursor-pointer">Account Overview</span>
            <span className="text-silver hidden lg:inline">•</span>
            <span className="underline hover:text-softWhite transition-colors cursor-pointer">Habits</span>
            <span className="text-silver hidden lg:inline">•</span>
            <span className="underline hover:text-softWhite transition-colors cursor-pointer">Strategies</span>
          </div>
        </div>
        <div className="tradingview-widget-container ml-4 lg:ml-[44px]">
          <div className="tradingview-widget-container__widget"></div>
          <div ref={containerRef}></div>
        </div>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;
