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

const CommunitySetfiles = () => {
  const [setfiles, setSetfiles] = useState([]);

  useEffect(() => {
    const fetchSetfiles = async () => {
      const response = await fetch('/api/setfiles');
      const data = await response.json();
      setSetfiles(data);
    };
    fetchSetfiles();
  }, []);

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setfiles.map((setfile, index) => (
                    <TableRow key={index}>
                      <TableCell>{setfile.name}</TableCell>
                      <TableCell>{setfile.description}</TableCell>
                      <TableCell>{setfile.author}</TableCell>
                      <TableCell>{setfile.date}</TableCell>
                      <TableCell>{setfile.downloads}</TableCell>
                      <TableCell>{setfile.rating}</TableCell>
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
