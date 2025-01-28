import { useEffect } from 'react';

const TradingViewTickerTape = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
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

    const widgetContainer = document.querySelector('.tradingview-widget-container__widget');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full fixed top-0 left-0 z-50">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a 
          href="https://www.tradingview.com/" 
          rel="noopener nofollow" 
          target="_blank"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;