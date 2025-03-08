
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useNavigate } from "react-router-dom";

interface GridItemProps {
  area?: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  path?: string;
}

const DashboardGridItem = ({ area, icon, title, description, path }: GridItemProps) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <li className={cn("min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] list-none", area)}>
      <div 
        className="relative h-full rounded-xl border-[0.75px] border-silver/20 p-1 sm:p-1.5 md:p-2 cursor-pointer"
        onClick={handleNavigation}
      >
        <GlowingEffect
          spread={20}
          glow={true}
          disabled={false}
          proximity={50}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col justify-between gap-2 sm:gap-3 overflow-hidden rounded-xl border-[0.75px] border-silver/20 bg-darkBlue/40 p-2 sm:p-3 md:p-4 shadow-sm shadow-[0px_0px_15px_0px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <div className="relative flex flex-1 flex-col justify-between gap-1 sm:gap-2">
            <div className="w-fit rounded-lg border-[0.75px] border-silver/20 bg-darkGrey p-1 sm:p-1.5">
              {icon}
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-sm sm:text-base md:text-lg leading-tight font-semibold font-sans tracking-[-0.02em] text-balance text-softWhite">
                {title}
              </h3>
              <p className="font-sans text-xs leading-tight md:text-sm text-mediumGray">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default DashboardGridItem;
