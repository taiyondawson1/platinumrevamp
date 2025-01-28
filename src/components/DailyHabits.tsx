import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, Book, Share2, Plus, Activity, LineChart, PenLine } from "lucide-react";

const DailyHabits = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="chart-container p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" className="bg-accent-blue/10 hover:bg-accent-blue/20 text-softWhite">
          New Day Today
        </Button>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-black/20">
            <TabsTrigger value="today" className="data-[state=active]:bg-accent-blue/20">Today</TabsTrigger>
            <TabsTrigger value="week" className="data-[state=active]:bg-accent-blue/20">This Week</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-accent-blue/20">This Month</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-accent-blue/20">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-silver/20">
            <TableHead className="text-mediumGray">Name</TableHead>
            <TableHead className="text-mediumGray">Date</TableHead>
            <TableHead className="text-mediumGray">
              <PenLine className="h-4 w-4" />
              <span className="sr-only">Journaling</span>
            </TableHead>
            <TableHead className="text-mediumGray">
              <LineChart className="h-4 w-4" />
              <span className="sr-only">Backtesting</span>
            </TableHead>
            <TableHead className="text-mediumGray">
              <Activity className="h-4 w-4" />
              <span className="sr-only">Exercise</span>
            </TableHead>
            <TableHead className="text-mediumGray">
              <Book className="h-4 w-4" />
              <span className="sr-only">Reading</span>
            </TableHead>
            <TableHead className="text-mediumGray">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share in Discord</span>
            </TableHead>
            <TableHead className="text-mediumGray">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-black/20 border-silver/20">
            <TableCell colSpan={8} className="text-mediumGray">
              <Button variant="ghost" className="w-full justify-start px-0 hover:bg-transparent hover:text-accent-blue">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DailyHabits;