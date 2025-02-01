
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { CheckCircle } from "lucide-react";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: progress } = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const updateProgress = useMutation({
    mutationFn: async ({ watchTime, completed }: { watchTime: number, completed: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          watch_time: watchTime,
          completed
        });

      if (error) throw error;
    },
    onSuccess: () => {
      if (!isCompleted) {
        toast({
          title: "Progress saved",
          description: "Your progress has been updated.",
        });
      }
    }
  });

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let timeUpdateInterval: NodeJS.Timeout;

    const handleTimeUpdate = () => {
      const currentTime = Math.floor(video.currentTime);
      setWatchTime(currentTime);
      
      // Update progress every 30 seconds
      if (currentTime % 30 === 0 && currentTime > 0) {
        updateProgress.mutate({ watchTime: currentTime, completed: false });
      }

      // Enable complete button after 4 minutes (240 seconds)
      if (currentTime >= 240 && !isCompleted) {
        setIsCompleted(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    };
  }, [videoRef.current]);

  const handleComplete = () => {
    updateProgress.mutate({ 
      watchTime, 
      completed: true 
    }, {
      onSuccess: () => {
        toast({
          title: "Course Completed!",
          description: "Congratulations on completing this course!",
        });
        navigate('/courses');
      }
    });
  };

  if (courseLoading || !course) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 ml-[64px] max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-softWhite">{course.name}</h1>
        <p className="text-mediumGray">{course.description}</p>
        
        {course.video_url && (
          <div className="relative aspect-video bg-darkBlue/40 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={course.video_url}
              controls
              className="w-full h-full"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-mediumGray">
            {watchTime >= 240 ? "Ready to complete!" : `Watch time: ${Math.floor(watchTime / 60)}:${(watchTime % 60).toString().padStart(2, '0')}`}
          </div>
          <Button 
            onClick={handleComplete}
            disabled={!isCompleted || progress?.completed}
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {progress?.completed ? "Completed!" : "Mark as Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
