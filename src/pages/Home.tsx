
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SparklesPreviewDark } from "@/components/ui/SparklesDemo";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 text-center relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesPreviewDark />
      </div>
      
      {/* Content overlay */}
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Hero Section */}
        <section className="space-y-6">
          <h1 className="text-6xl font-bold text-softWhite leading-tight">
            Transform Your Trading with <span className="text-primary">TradeHub</span>
          </h1>
          <p className="text-xl text-mediumGray max-w-2xl mx-auto">
            Advanced trading analytics, expert advisors, and comprehensive market insights
            all in one powerful platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group !rounded-none"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/courses')}
              className="!rounded-none"
            >
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">
          <div className="space-y-3 backdrop-blur-sm p-6 border border-silver/20 rounded-none hover:border-silver/40 transition-all">
            <h3 className="text-xl font-semibold text-softWhite">Real-Time Analytics</h3>
            <p className="text-mediumGray">
              Track your trading performance with advanced metrics and insights.
            </p>
          </div>
          <div className="space-y-3 backdrop-blur-sm p-6 border border-silver/20 rounded-none hover:border-silver/40 transition-all">
            <h3 className="text-xl font-semibold text-softWhite">Expert Advisors</h3>
            <p className="text-mediumGray">
              Automate your trading strategies with powerful expert advisors.
            </p>
          </div>
          <div className="space-y-3 backdrop-blur-sm p-6 border border-silver/20 rounded-none hover:border-silver/40 transition-all">
            <h3 className="text-xl font-semibold text-softWhite">Market Education</h3>
            <p className="text-mediumGray">
              Access comprehensive trading courses and resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
