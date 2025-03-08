
import { useNavigate } from "react-router-dom";
import { LampDemo } from "@/components/ui/LampDemo";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 relative overflow-hidden">
      {/* Lamp background */}
      <div className="absolute inset-0 w-full h-full">
        <LampDemo />
      </div>
      
      {/* Empty content overlay with clickable area */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Clickable area that takes up the whole screen */}
        <div 
          className="absolute inset-0 w-screen h-screen cursor-pointer" 
          onClick={() => navigate('/dashboard')}
          aria-label="Enter dashboard"
        />
      </div>
    </div>
  );
};

export default Home;
