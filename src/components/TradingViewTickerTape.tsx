import { useEffect } from 'react';

const TradingViewTickerTape = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "250",
      "height": "600",
      "tabs": [
        {
          "title": "Forex",
          "symbols": [
            {
              "s": "FX:EURUSD"
            },
            {
              "s": "FX:GBPUSD"
            },
            {
              "s": "FX:USDJPY"
            }
          ]
        },
        {
          "title": "Indices",
          "symbols": [
            {
              "s": "FOREXCOM:SPXUSD"
            },
            {
              "s": "FOREXCOM:NSXUSD"
            },
            {
              "s": "FOREXCOM:DJI"
            }
          ]
        },
        {
          "title": "Commodities",
          "symbols": [
            {
              "s": "COMEX:GC1!"
            },
            {
              "s": "TVC:USOIL"
            },
            {
              "s": "TVC:SILVER"
            }
          ]
        }
      ]
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
    <div className="tradingview-widget-container fixed left-16 top-0 h-screen z-40 bg-darkBlue/40 backdrop-blur-sm border-r border-mediumGray/20">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a 
          href="https://www.tradingview.com/" 
          rel="noopener nofollow" 
          target="_blank"
          className="text-blue-500 hover:text-blue-600 transition-colors text-xs"
        >
          Powered by TradingView
        </a>
      </div>
    </div>
  );
};

export default TradingViewTickerTape;