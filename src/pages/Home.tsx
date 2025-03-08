
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 relative bg-black">
      {/* 3D Scene at the top */}
      <div className="w-full">
        <Card className="w-full h-[70vh] bg-black/[0.96] relative overflow-hidden border-0 rounded-none shadow-xl">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          
          <div className="flex flex-col items-center justify-center h-full">
            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Welcome</h1>
              <p className="mt-4 text-neutral-300 text-lg">Welcome to PlatinumAi! Trade smarter with powerful automation and reliable risk management.</p>
              <div className="mt-8 flex gap-4">
                <RainbowButton onClick={() => navigate("/login")}>
                  Login
                </RainbowButton>
                <button 
                  className="px-6 py-3 h-[44px] bg-transparent border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
