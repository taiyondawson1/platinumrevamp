import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomWidgetChartProps {
  accountId?: string;
  width?: number;
  height?: number;
}

const CustomWidgetChart = ({ 
  accountId = "12345",  // Default account ID
  width = 300,
  height = 200 
}: CustomWidgetChartProps) => {
  const session = localStorage.getItem("myfxbook_session") || "DSL07vu14QxHWErTIAFrH40"; // Default session

  console.log("CustomWidgetChart: Rendering with", { accountId, session, width, height });

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
    <Card className="w-full bg-white relative z-50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">Performance Widget</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center min-h-[300px] p-4">
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
      </CardContent>
    </Card>
  );
};

export default CustomWidgetChart;