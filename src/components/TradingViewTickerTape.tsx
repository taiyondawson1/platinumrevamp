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
      "width": "400",
      "height": "465",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(106, 109, 120, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Forex",
          "symbols": [
            {
              "s": "FX:EURUSD",
              "d": "EUR/USD"
            },
            {
              "s": "FX:GBPUSD",
              "d": "GBP/USD"
            },
            {
              "s": "FX:USDJPY",
              "d": "USD/JPY"
            }
          ]
        },
        {
          "title": "Commodities",
          "symbols": [
            {
              "s": "PYTH:XAUUSD",
              "d": "Gold"
            }
          ]
        },
        {
          "title": "Indices",
          "symbols": [
            {
              "s": "GBEBROKERS:DJ30",
              "d": "Dow Jones"
            }
          ]
        },
        {
          "title": "Crypto",
          "symbols": [
            {
              "s": "BITSTAMP:BTCUSD",
              "d": "Bitcoin"
            }
          ]
        }
      ]
    });

    const container = document.querySelector('.tradingview-widget-container__widget');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-[400px] bg-darkBlue/40 rounded-lg border border-mediumGray/20">
      <div className="tradingview-widget-container__widget h-[465px]"></div>
    </div>
  );
};

export default TradingViewTickerTape;