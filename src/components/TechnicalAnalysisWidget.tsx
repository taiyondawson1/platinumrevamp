import { useEffect } from 'react';

const TechnicalAnalysisWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1h",
        "width": "425",
        "isTransparent": true,
        "height": "450",
        "symbol": "OANDA:XAUUSD",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "light"
      }
    `;

    const container = document.querySelector('.tradingview-technical-widget');
    if (container) {
      const widget = document.createElement('div');
      widget.className = 'tradingview-widget-container__widget';
      container.appendChild(widget);
      container.appendChild(script);
    }

    return () => {
      const container = document.querySelector('.tradingview-technical-widget');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container tradingview-technical-widget tradehub-card">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a 
          href="https://www.tradingview.com/" 
          rel="noopener nofollow" 
          target="_blank"
          className="text-accent-blue hover:underline"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
};

export default TechnicalAnalysisWidget;