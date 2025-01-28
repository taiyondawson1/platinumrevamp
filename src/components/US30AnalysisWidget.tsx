import { useEffect } from 'react';

const US30AnalysisWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
        "width": "425",
        "isTransparent": true,
        "height": "450",
        "symbol": "OANDA:US30USD",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }
    `;

    const container = document.querySelector('.tradingview-us30-widget');
    if (container) {
      const widget = document.createElement('div');
      widget.className = 'tradingview-widget-container__widget';
      container.appendChild(widget);
      container.appendChild(script);
    }

    return () => {
      const container = document.querySelector('.tradingview-us30-widget');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-us30-widget">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default US30AnalysisWidget;