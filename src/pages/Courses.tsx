
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const CoursesPage = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>, courseName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload video to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${courseName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(filePath);

      // Update the courses table with video information
      const { error: dbError } = await supabase
        .from('courses')
        .upsert({
          name: courseName,
          video_url: publicUrl,
          path: courses.find(c => c.name === courseName)?.path || '',
          description: courses.find(c => c.name === courseName)?.description || '',
          duration: courses.find(c => c.name === courseName)?.duration || '',
          lessons: courses.find(c => c.name === courseName)?.lessons || 0,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 ml-[64px] relative">
      <h1 className="text-xl font-semibold text-softWhite mb-4">Courses</h1>
      
      <div className="grid gap-3 relative">
        {courses.map((course) => (
          <div 
            key={course.name}
            className="tradehub-card p-4 flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-medium text-softWhite">{course.name}</h2>
                <p className="text-sm text-mediumGray max-w-xl">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-mediumGray mt-2">
                  <span>⏱️ {course.duration}</span>
                  <span>📚 {course.lessons} lessons</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleStartCourse(course.name)}
                  size="sm"
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-3 h-8
                           shadow-embossed hover:shadow-embossed-hover transition-all duration-300
                           border border-[#FFD700]/30 hover:border-[#FFD700]/40"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Course
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, course.name)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-mediumGray/30 hover:border-mediumGray/40 h-8"
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
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
