import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "TradeHub", path: "/tradehub" },
  { label: "Expert Advisors", path: "/expert-advisors" },
  { label: "Setfiles", path: "/setfiles" },
  { label: "Courses", path: "/courses" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed left-4 mt-[300px]">
      <div className="bg-darkGrey/30 backdrop-blur-sm border border-silver/20 p-4 w-[250px]">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 text-xs",
                  "hover:bg-highlightGray/5 text-left",
                  isActive ? "text-softWhite bg-highlightGray/10" : "text-mediumGray"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-[50px] h-[2px] bg-silver/20 mx-auto mt-6"></div>
    </div>
  );
};

export default Sidebar;