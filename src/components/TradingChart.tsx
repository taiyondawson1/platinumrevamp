import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create script element for TradingView
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
          hide_side_toolbar: false,
        });
      }
    };

    // Add script to document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      script.remove();
    };
  }, []);

  console.log("TradingView chart container rendered");

  return (
    <div className="chart-container h-[650px] bg-black/20 p-4 rounded-lg w-full">
      <h2 className="text-xl font-bold mb-4 text-white">XAUUSD Live Chart</h2>
      <div 
        id="tradingview_chart" 
        ref={containerRef} 
        className="w-full h-[calc(100%-2rem)]"
      />
    </div>
  );
};

export default TradingChart;