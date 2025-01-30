
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen } from "lucide-react";

const CoursesPage = () => {
  const { toast } = useToast();

  const courses = [
    {
      name: "PlatinumAi: Pulse Course",
      description: "Learn how to effectively use mean reversion strategies and master consolidating market periods.",
      duration: "4 hours",
      lessons: 12,
      path: "/courses/platinumai-pulse"
    },
    {
      name: "PlatinumAi: Stealth Course",
      description: "Advanced techniques and strategies for our most sophisticated trading bot.",
      duration: "6 hours",
      lessons: 15,
      path: "/courses/platinumai-stealth"
    },
    {
      name: "PlatinumAi: Infinity Course",
      description: "Master the 'one shot, one entry' approach and optimize for prop firm success.",
      duration: "3 hours",
      lessons: 9,
      path: "/courses/platinumai-infinity"
    }
  ];

  const handleStartCourse = (courseName: string) => {
    toast({
      title: "Course Access",
      description: `Starting ${courseName}...`,
    });
  };

  return (
    <div className="p-4 ml-[240px]">
      <div className="grid gap-3">
        {courses.map((course) => (
          <div 
            key={course.name}
            className="bg-darkBlue/40 backdrop-blur-sm rounded-lg p-3 border border-mediumGray/20 
                     hover:border-mediumGray/30 transition-all duration-300
                     shadow-[0_4px_20px_rgb(0,0,0,0.1)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 
                            flex items-center justify-center p-2 border border-mediumGray/10">
                <BookOpen className="w-6 h-6 text-softWhite/70" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div>
                  <h2 className="text-base font-medium text-softWhite">{course.name}</h2>
                  <p className="text-sm text-mediumGray leading-relaxed">{course.description}</p>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <div className="text-xs text-mediumGray flex items-center gap-4">
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.lessons} lessons</span>
                  </div>
                  <Button
                    onClick={() => handleStartCourse(course.name)}
                    size="sm"
                    className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-softWhite px-3 
                             shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                             border border-[#00ADB5]/30 hover:border-[#00ADB5]/40 text-xs h-7"
                  >
                    Start Course
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
