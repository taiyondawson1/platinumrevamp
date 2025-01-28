import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, Book, Share2, Plus, Activity, LineChart, PenLine } from "lucide-react";

const DailyHabits = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="border border-silver/20 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" className="bg-accent-blue/10 hover:bg-accent-blue/20 text-softWhite">
            New Day Today
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent w-full justify-start border-b border-silver/20">
            <TabsTrigger value="today" className="data-[state=active]:bg-accent-blue/20">Today</TabsTrigger>
            <TabsTrigger value="week" className="data-[state=active]:bg-accent-blue/20">This Week</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-accent-blue/20">This Month</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-accent-blue/20">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-silver/20">
              <TableHead className="text-mediumGray h-6 py-1">Name</TableHead>
              <TableHead className="text-mediumGray h-6 py-1">Date</TableHead>
              <TableHead className="text-mediumGray h-6 py-1">
                <PenLine className="h-4 w-4" />
                <span className="sr-only">Journaling</span>
              </TableHead>
              <TableHead className="text-mediumGray h-6 py-1">
                <LineChart className="h-4 w-4" />
                <span className="sr-only">Backtesting</span>
              </TableHead>
              <TableHead className="text-mediumGray h-6 py-1">
                <Activity className="h-4 w-4" />
                <span className="sr-only">Exercise</span>
              </TableHead>
              <TableHead className="text-mediumGray h-6 py-1">
                <Book className="h-4 w-4" />
                <span className="sr-only">Reading</span>
              </TableHead>
              <TableHead className="text-mediumGray h-6 py-1">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share in Discord</span>
              </TableHead>
              <TableHead className="text-mediumGray h-6 py-1">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-black/20 border-silver/20">
              <TableCell colSpan={8} className="text-mediumGray h-6 py-1">
                <Button variant="ghost" className="w-full justify-start px-0 hover:bg-transparent hover:text-accent-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DailyHabits;