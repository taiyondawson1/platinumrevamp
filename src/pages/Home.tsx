
import { useNavigate } from "react-router-dom";
import { SplineSceneBasic } from "@/components/ui/SplineSceneDemo";
import { Card } from "@/components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 relative bg-black">
      {/* 3D Scene at the top */}
      <div className="w-full">
        <SplineSceneBasic />
      </div>
      
      {/* Welcome content with 50px offset */}
      <div className="absolute inset-0 flex flex-col items-center justify-center ml-[50px]">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">Welcome</h1>
          <p className="text-lg md:text-xl text-silver mb-8 max-w-md">
            Welcome to PlatinumAi! Trade smarter with powerful automation and reliable risk management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <RainbowButton onClick={() => navigate("/login")}>
              Login
            </RainbowButton>
            <RainbowButton onClick={() => navigate("/register")}>
              Register
            </RainbowButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
