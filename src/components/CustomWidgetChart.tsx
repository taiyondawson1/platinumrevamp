import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomWidgetChartProps {
  accountId?: string;
  width?: number;
  height?: number;
}

const CustomWidgetChart = ({ 
  accountId,
  width = 600,  // Increased default width
  height = 400  // Increased default height
}: CustomWidgetChartProps) => {
  const session = localStorage.getItem("myfxbook_session");

  console.log("CustomWidgetChart: Rendering with", { accountId, session, width, height });

  if (!accountId || !session) {
    console.log("CustomWidgetChart: Missing required props", { accountId, session });
    return null;
  }

  const widgetUrl = `https://widgets.myfxbook.com/api/get-custom-widget.png?${new URLSearchParams({
    session: session,
    id: accountId,
    width: width.toString(),
    height: height.toString(),
    bart: "1",
    linet: "0",
    bgColor: "FFFFFF",
    gridColor: "BDBDBD",
    lineColor: "00CB05",
    barColor: "FF8D0A",
    fontColor: "000000",
    title: "",
    titles: "20",
    chartbgc: "FFFFFF"
  }).toString()}`;

  console.log("CustomWidgetChart: Generated widget URL", widgetUrl);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Performance Widget</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center p-4">
        <div className="relative w-full h-full">
          <img 
            src={widgetUrl} 
            alt="MyFxBook Custom Widget" 
            width={width} 
            height={height}
            className="rounded-lg max-w-full h-auto"
            onError={(e) => {
              console.error("Error loading widget image:", e);
              const img = e.target as HTMLImageElement;
              console.log("Failed URL:", img.src);
            }}
            onLoad={() => console.log("Widget image loaded successfully")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomWidgetChart;