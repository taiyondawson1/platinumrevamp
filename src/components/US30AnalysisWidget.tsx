import { useEffect, useRef } from 'react';

const US30AnalysisWidget = () => {
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
    <div ref={containerRef} className="tradingview-us30-widget min-w-[425px] min-h-[450px]">
    </div>
  );
};

export default US30AnalysisWidget;