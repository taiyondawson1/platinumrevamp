
'use client';

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { StarBorder } from "@/components/ui/star-border";

export function SplineSceneBasic() {
  return <Card className="w-full h-[70vh] bg-black/[0.96] relative overflow-hidden border-0 rounded-none shadow-xl">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Welcome</h1>
          <p className="mt-4 text-neutral-300 max-w-lg text-lg">Welcome to PlatinumAi!  Trade smarter with powerful automation and reliable risk management.</p>
          <div className="mt-8 flex gap-4">
            <StarBorder color="white">
              Learn More
            </StarBorder>
            <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
        </div>
      </div>
    </Card>;
}
