
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Calendar, Archive, User } from "lucide-react";

const Kanban = () => {
  const [selectedProject] = useState("Website Redesign");

  const columns = [
    { id: "backlog", title: "Backlog", color: "bg-gray-100" },
    { id: "todo", title: "To Do", color: "bg-blue-100" },
    { id: "in-progress", title: "In Progress", color: "bg-yellow-100" },
    { id: "review", title: "Review", color: "bg-purple-100" },
    { id: "done", title: "Done", color: "bg-green-100" }
  ];

  const tasks = {
    backlog: [
      {
        id: "1",
        title: "User Research & Analysis",
        description: "Conduct user interviews and analyze current website usage",
        priority: "Medium",
        assignee: { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC" },
        dueDate: "2024-06-10",
        tags: ["Research", "UX"]
      },
      {
        id: "2",
        title: "Competitor Analysis",
        description: "Research and document competitor websites and features",
        priority: "Low",
        assignee: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", initials: "MJ" },
        dueDate: "2024-06-12",
        tags: ["Research"]
      }
    ],
    todo: [
      {
        id: "3",
        title: "Homepage Wireframes",
        description: "Create wireframes for the new homepage design",
        priority: "High",
        assignee: { name: "Emma Davis", avatar: "/avatars/emma.jpg", initials: "ED" },
        dueDate: "2024-06-08",
        tags: ["Design", "Wireframes"]
      },
      {
        id: "4",
        title: "Navigation Structure",
        description: "Design and plan the new website navigation",
        priority: "High",
        assignee: { name: "Alex Rodriguez", avatar: "/avatars/alex.jpg", initials: "AR" },
        dueDate: "2024-06-09",
        tags: ["UX", "Navigation"]
      }
    ],
    "in-progress": [
      {
        id: "5",
        title: "Design System Setup",
        description: "Create comprehensive design system with components",
        priority: "High",
        assignee: { name: "Emma Davis", avatar: "/avatars/emma.jpg", initials: "ED" },
        dueDate: "2024-06-15",
        tags: ["Design", "Components"]
      },
      {
        id: "6",
        title: "Backend API Integration",
        description: "Connect frontend with existing backend APIs",
        priority: "Medium",
        assignee: { name: "Tom Wilson", avatar: "/avatars/tom.jpg", initials: "TW" },
        dueDate: "2024-06-20",
        tags: ["Development", "API"]
      }
    ],
    review: [
      {
        id: "7",
        title: "Mobile Responsiveness",
        description: "Ensure all pages are properly responsive",
        priority: "High",
        assignee: { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC" },
        dueDate: "2024-06-05",
        tags: ["Development", "Mobile"]
      }
    ],
    done: [
      {
        id: "8",
        title: "Project Setup & Planning",
        description: "Initial project setup and team planning session",
        priority: "Medium",
        assignee: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", initials: "MJ" },
        dueDate: "2024-05-28",
        tags: ["Planning"]
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
              <p className="text-gray-600 mt-1">Project: {selectedProject}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-300">
                <Users className="w-4 h-4 mr-2" />
                Team (8)
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>12 Active Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>5 Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>3 Overdue</span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className={`${column.color} border-b border-gray-200`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-gray-900">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white text-gray-700">
                      {tasks[column.id as keyof typeof tasks]?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 min-h-96 bg-gray-50">
                  {tasks[column.id as keyof typeof tasks]?.map((task) => (
                    <Card key={task.id} className="border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Task Header */}
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                              {task.title}
                            </h4>
                            <Badge 
                              className={`text-xs ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority}
                            </Badge>
                          </div>

                          {/* Task Description */}
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Task Footer */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                                  {task.assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">{task.assignee.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Task Button */}
                  <Button 
                    variant="dashed" 
                    className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
