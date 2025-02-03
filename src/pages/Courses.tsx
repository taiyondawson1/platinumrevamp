import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const courses = [
  {
    name: "**[START HERE] HOW TO INSTALL**",
    description: "Learn how to properly install and set up your Expert Advisor",
    externalUrl: "https://classroom.google.com/c/NzQ4Mjg0ODU3NDE4?cjc=4lz6o2f"
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Card key={index} className="metric-card">
            <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
            <p className="text-sm text-mediumGray mb-6">{course.description}</p>
            <Button
              variant="outline"
              className="w-full bg-black/20 hover:bg-black/30 border-silver/20 hover:border-silver/30"
              onClick={() => window.open(course.externalUrl, '_blank')}
            >
              Open Course
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;