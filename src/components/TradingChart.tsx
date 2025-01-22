import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("TradingChart mounting...");
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      console.log("TradingView script loaded");
      if (containerRef.current && window.TradingView) {
        console.log("Initializing TradingView widget");
        new window.TradingView.widget({
          autosize: true,
          symbol: "OANDA:XAUUSD",
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_widget",
          hide_side_toolbar: true,
          hide_volume: true,
          studies: [],
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          gridColor: "rgba(255, 255, 255, 0.05)",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      console.log("TradingChart unmounting...");
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="chart-container h-[600px] bg-black/40 p-0.5 rounded-lg w-full shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-800/50 hover:border-gray-700/50">
      <div 
        id="tradingview_widget" 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default TradingChart;