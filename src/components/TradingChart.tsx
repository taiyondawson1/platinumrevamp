import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "OANDA:XAUUSD",
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
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
      script.remove();
    };
  }, []);

  console.log("TradingView chart container rendered");

  return (
    <div className="chart-container h-[600px] bg-black/20 p-1 rounded-lg w-full">
      <div 
        id="tradingview_chart" 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default TradingChart;