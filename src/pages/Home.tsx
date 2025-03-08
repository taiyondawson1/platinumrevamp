
import { useNavigate } from "react-router-dom";
import { SplineSceneBasic } from "@/components/ui/SplineSceneDemo";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 relative">
      {/* 3D Scene at the top */}
      <div className="w-full">
        <SplineSceneBasic />
      </div>
      
      {/* Additional content below */}
      <div className="max-w-4xl w-full mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Welcome to Our Platform
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">Feature {i}</h3>
              <p className="text-gray-300">
                Experience the power of our intuitive platform with advanced capabilities
                designed to enhance your workflow.
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
