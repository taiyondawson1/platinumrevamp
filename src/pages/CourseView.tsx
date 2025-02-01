
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle } from "lucide-react";

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course with ID:', id);
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (courseError) throw courseError;
        
        if (!courseData) {
          console.log('Course not found with id:', id);
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          });
          navigate('/courses');
          return;
        }

        console.log('Found course:', courseData);
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: "Error",
          description: "Failed to load course content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, toast, navigate]);

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('course_progress')
        .upsert({
          course_id: course.id,
          completed: true,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course completed!",
      });
      
      navigate('/courses');
    } catch (error) {
      console.error('Error marking course as complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark course as complete",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!course) {
    return <div className="p-4 text-center">Course not found</div>;
  }

  return (
    <div className="p-4 ml-[64px] relative">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/courses')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-softWhite mb-4">{course.name}</h1>
        <p className="text-mediumGray mb-6">{course.description}</p>
        
        <div className="aspect-video mb-6 bg-darkBlue/40 rounded-lg overflow-hidden">
          <video
            src={course.video_url}
            controls
            className="w-full h-full"
          />
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete and Continue
        </Button>
      </div>
    </div>
  );
};

export default CourseView;
