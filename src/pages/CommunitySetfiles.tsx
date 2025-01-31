
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const CommunitySetfiles = () => {
  const { toast } = useToast();
  const [setfiles] = useState([
    {
      name: "AUDNZD Infinity",
      description: "Optimized setfile for AUDNZD pair",
      author: "PlatinumAI",
      date: "2024-01-31",
      downloads: 0,
      rating: "N/A",
      downloadUrl: "https://qzbwxtegqsusmfwjauwh.supabase.co/storage/v1/object/public/expert-advisors//AUDNZD.set"
    }
  ]);

  const handleDownload = (setfile: any) => {
    try {
      const link = document.createElement('a');
      link.href = setfile.downloadUrl;
      link.download = `${setfile.name}.set`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${setfile.name} setfile...`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the setfile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Community Setfiles</h2>
      </div>

      <div className="grid gap-4">
        <Card className="col-span-4 h-full rounded-none">
          <ScrollArea className="h-[450px]">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setfiles.map((setfile, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-gray-100/5">
                      <TableCell>{setfile.name}</TableCell>
                      <TableCell>{setfile.description}</TableCell>
                      <TableCell>{setfile.author}</TableCell>
                      <TableCell>{setfile.date}</TableCell>
                      <TableCell>{setfile.downloads}</TableCell>
                      <TableCell>{setfile.rating}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDownload(setfile)}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          Download
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CommunitySetfiles;
