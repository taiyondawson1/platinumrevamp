
import { Card, CardContent } from "@/components/ui/card";

const LoadingCard = () => {
  return (
    <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
      <CardContent className="py-4">
        <p className="text-center text-softWhite">Loading data...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
