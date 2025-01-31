
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ExpertAdvisors = () => {
  const { toast } = useToast();

  // Mock connected account ID - replace this with actual account connection logic
  const connectedAccountId = "demo123";

  const experts = [
    {
      name: "PlatinumAi: Stealth",
      description: "Our most advanced bot. Use with caution.",
      subtitle: "Ideal for personal capital, optimized for prop firm capital.",
      presets: "7 presets available",
      path: "/expert-advisors/platinumai-stealth",
      filename: "PlatinumAI Stealth.ex4",
      downloadUrl: "https://qzbwxtegqsusmfwjauwh.supabase.co/storage/v1/object/public/expert-advisors//PlatinumAI%20Stealth.ex4"
    },
    {
      name: "PlatinumAi: Infinity",
      description: "Minimal manual intervention required, with a \"one shot, one entry at a time\" approach.",
      presets: "5 presets available",
      path: "/expert-advisors/platinumai-infinity",
      filename: "platinumai-infinity.ex4"
    },
  ];

  const handleDownload = async (expert: typeof experts[0]) => {
    try {
      toast({
        title: "Starting Download",
        description: `Downloading ${expert.name}...`,
      });

      // If we have a direct download URL, use it
      if (expert.downloadUrl) {
        const link = document.createElement('a');
        link.href = expert.downloadUrl;
        link.download = expert.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fall back to signed URL for other files
        const { data, error } = await supabase.storage
          .from('expert-advisors')
          .createSignedUrl(expert.filename, 60);

        if (error) {
          throw error;
        }

        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = expert.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Download Complete",
        description: `Successfully downloaded ${expert.name}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetupGuide = (expertName: string) => {
    toast({
      title: "Setup Guide",
      description: `Opening setup guide for ${expertName}...`,
    });
  };

  return (
    <div className="p-4 ml-[64px] relative">
      <h1 className="text-xl font-semibold text-softWhite mb-4">Expert Advisors</h1>
      
      <div className="grid gap-3 relative">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-darkBase to-transparent z-10" />
        
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-darkBase to-transparent z-10" />
        
        {experts.map((expert) => (
          <div 
            key={expert.name}
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
                  <h2 className="text-base font-medium text-softWhite">{expert.name}</h2>
                  <p className="text-sm text-mediumGray leading-relaxed">{expert.description}</p>
                  {expert.subtitle && (
                    <p className="text-xs text-mediumGray/80 mt-1 leading-relaxed">{expert.subtitle}</p>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center gap-2 pt-1.5">
                  <div className="text-xs text-mediumGray flex items-center mb-2">
                    <span className="inline-block mr-1">📄</span>
                    {expert.presets}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(expert)}
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
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleSetupGuide(expert.name)}
                      variant="outline"
                      size="sm"
                      className="border-mediumGray/20 hover:bg-mediumGray/10 text-mediumGray 
                               hover:text-softWhite transition-colors duration-300 text-xs h-7 !rounded-none"
                    >
                      Setup guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertAdvisors;

