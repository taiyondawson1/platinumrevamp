
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const courses = [
  {
    name: "**[START HERE] HOW TO INSTALL**",
    description: "Learn how to properly install and set up your Expert Advisor",
    externalUrl: "https://classroom.google.com/c/NzQ4Mjg0ODU3NDE4?cjc=4lz6o2f"
  },
  {
    name: "PlatinumAi: Pulse",
    description: "Master the Pulse trading strategy",
    externalUrl: "https://classroom.google.com/c/NzQ4NzMxODEwNjQ4?cjc=btoyiex"
  },
  {
    name: "PlatinumAi: Stealth",
    description: "Master the Stealth trading strategy",
    externalUrl: "https://classroom.google.com/c/NzQ4NDY0MzQ1NzA2?cjc=exwjfjx"
  },
  {
    name: "PlatinumAi: Infinity",
    description: "Learn the Infinity trading approach",
    externalUrl: "https://classroom.google.com/c/NzQ4NDY3OTY2NjU5?cjc=cz4udgo"
  }
];

const CoursesPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px] relative">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-semibold text-softWhite">Courses</h2>
      </div>

      <div className="grid gap-3 relative">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-darkBase to-transparent z-10" />
        
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-darkBase to-transparent z-10" />
        
        {courses.map((course, index) => (
          <div 
            key={index}
            className="group bg-darkBlue/40 backdrop-blur-sm p-3 border border-mediumGray/20 
                     hover:border-mediumGray/30 transition-all duration-300
                     relative overflow-hidden !rounded-none"
          >
            {/* Shiny gold reflective effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                          bg-gradient-to-r from-transparent via-[#ffd70022] to-transparent
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
                          pointer-events-none" />
            
            <div className="flex flex-col items-center justify-center gap-3 relative">
              <div className="space-y-1.5 text-center">
                <div>
                  <h2 className="text-base font-medium text-softWhite">{course.name}</h2>
                  <p className="text-sm text-mediumGray leading-relaxed">{course.description}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 pt-1.5">
                  <Button
                    onClick={() => window.open(course.externalUrl, '_blank')}
                    size="sm"
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-3 
                             shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                             border border-[#FFD700]/30 hover:border-[#FFD700]/40 text-xs h-7
                             relative overflow-hidden group !rounded-none"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                                  bg-gradient-to-r from-transparent via-[#ffd70022] to-transparent
                                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
                                  pointer-events-none" />
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    Open Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
