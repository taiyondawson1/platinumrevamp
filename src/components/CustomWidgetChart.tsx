import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomWidgetChartProps {
  accountId?: string;
  width?: number;
  height?: number;
}

const CustomWidgetChart = ({ 
  accountId,
  width = 300,
  height = 200 
}: CustomWidgetChartProps) => {
  const session = localStorage.getItem("myfxbook_session");

  if (!accountId || !session) {
    console.log("CustomWidgetChart: Missing accountId or session", { accountId, session });
    return null;
  }

  const widgetUrl = `https://widgets.myfxbook.com/api/get-custom-widget.png?${new URLSearchParams({
    session: session,
    id: accountId,
    width: width.toString(),
    height: height.toString(),
    bart: "1",
    linet: "0",
    bgColor: "000000",
    gridColor: "BDBDBD",
    lineColor: "00CB05",
    barColor: "FF8D0A",
    fontColor: "FFFFFF",
    title: "",
    titles: "20",
    chartbgc: "474747"
  }).toString()}`;

  console.log("CustomWidgetChart: Generated widget URL", widgetUrl);

  return (
    <Card className="w-full bg-black/40 p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Performance Widget</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center min-h-[300px]">
        <img 
          src={widgetUrl} 
          alt="MyFxBook Custom Widget" 
          width={width} 
          height={height}
          className="rounded-lg max-w-full h-auto"
          onError={(e) => console.error("Error loading widget image:", e)}
        />
      </CardContent>
    </Card>
  );
};

export default CustomWidgetChart;