
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="flex-1 w-full scrollarea-mobile-fix">
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 pt-3 sm:pt-4 lg:pt-6 w-full mobile-full-height">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-softWhite">Courses</h2>
        </div>

        <div className="grid gap-3 max-w-[1000px] mx-auto relative">
          {/* Course grid */}
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {courses.map((course, index) => (
              <div 
                key={index}
                className="group bg-darkBlue/40 backdrop-blur-sm p-2 sm:p-3 border border-mediumGray/20 
                         hover:border-mediumGray/30 transition-all duration-300
                         relative overflow-hidden !rounded-none"
              >
                {/* Shiny gold reflective effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                              bg-gradient-to-r from-transparent via-[#ffd70022] to-transparent
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
                              pointer-events-none" />
                
                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 relative h-full">
                  <div className="space-y-1 sm:space-y-1.5 text-center">
                    <div>
                      <h2 className="text-sm sm:text-base font-medium text-softWhite line-clamp-2">{course.name}</h2>
                      <p className="text-xs text-mediumGray leading-relaxed line-clamp-2 mt-1">{course.description}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center pt-1 sm:pt-1.5 mt-auto">
                      <Button
                        onClick={() => window.open(course.externalUrl, '_blank')}
                        size="sm"
                        className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-2 sm:px-3
                                 shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                                 border border-[#FFD700]/30 hover:border-[#FFD700]/40 text-xs h-6 sm:h-7
                                 relative overflow-hidden group rounded-full w-full max-w-[120px]"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                                      bg-gradient-to-r from-transparent via-[#ffd70022] to-transparent
                                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
                                      pointer-events-none" />
                        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        Open Course
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default CoursesPage;
