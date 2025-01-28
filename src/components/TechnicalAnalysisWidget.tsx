import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TechnicalAnalysisWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    scriptRef.current = script;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1h",
        "width": "450",
        "isTransparent": true,
        "height": "450",
        "symbol": "OANDA:XAUUSD",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }
    `;

    const widget = document.createElement('div');
    widgetRef.current = widget;
    widget.className = 'tradingview-widget-container__widget';
    containerRef.current.appendChild(widget);
    containerRef.current.appendChild(script);

    return () => {
      if (widgetRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(widgetRef.current);
        } catch (e) {
          console.log('Widget already removed');
        }
      }
      if (scriptRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(scriptRef.current);
        } catch (e) {
          console.log('Script already removed');
        }
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="tradingview-technical-widget min-w-[450px] min-h-[450px]">
    </div>
  );
};

export default TechnicalAnalysisWidget;