interface CustomWidgetProps {
  session?: string;
  accountId?: string;
  width?: number;
  height?: number;
}

const CustomWidget = ({ session, accountId, width = 300, height = 200 }: CustomWidgetProps) => {
  console.log("CustomWidget props:", { session, accountId, width, height });
  
  if (!session || !accountId) {
    console.log("Missing required props:", { session, accountId });
    return null;
  }

  const widgetUrl = `https://widgets.myfxbook.com/api/get-custom-widget.png?session=${session}&id=${accountId}&width=${width}&height=${height}&bart=1&linet=0&bgColor=000000&gridColor=BDBDBD&lineColor=00CB05&barColor=FF8D0A&fontColor=FFFFFF&titles=20&chartbgc=474747`;
  
  console.log("Widget URL:", widgetUrl);

  return (
    <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden bg-black/40 border border-mediumGray/20">
      <img 
        src={widgetUrl} 
        alt="MyFxBook Custom Widget"
        className="w-full h-full object-contain"
        onError={(e) => {
          console.error("Failed to load widget image");
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default CustomWidget;