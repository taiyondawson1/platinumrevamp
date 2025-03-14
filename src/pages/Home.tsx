
import { useNavigate } from "react-router-dom";
import { SplineSceneBasic } from "@/components/ui/SplineSceneDemo";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 relative bg-black">
      {/* 3D Scene at the top */}
      <div className="w-full">
        <SplineSceneBasic />
      </div>
      
      {/* Additional content below */}
      
    </div>
  );
};

export default Home;
