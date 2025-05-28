
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Calendar, Archive, User, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Kanban = () => {
  const [selectedProject] = useState("Website Redesign");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    dueDate: "",
    tags: ""
  });

  const columns = [
    { id: "backlog", title: "Backlog", color: "bg-gray-100" },
    { id: "todo", title: "To Do", color: "bg-blue-100" },
    { id: "in-progress", title: "In Progress", color: "bg-yellow-100" },
    { id: "review", title: "Review", color: "bg-purple-100" },
    { id: "done", title: "Done", color: "bg-green-100" }
  ];

  const teamMembers = [
    { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC", role: "Project Manager" },
    { name: "Mike Johnson", avatar: "/avatars/mike.jpg", initials: "MJ", role: "Developer" },
    { name: "Emma Davis", avatar: "/avatars/emma.jpg", initials: "ED", role: "Designer" },
    { name: "Alex Rodriguez", avatar: "/avatars/alex.jpg", initials: "AR", role: "Developer" },
    { name: "Tom Wilson", avatar: "/avatars/tom.jpg", initials: "TW", role: "Backend Developer" }
  ];

  const [tasks, setTasks] = useState({
    backlog: [
      {
        id: "1",
        title: "User Research & Analysis",
        description: "Conduct user interviews and analyze current website usage",
        priority: "Medium",
        assignee: { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC" },
        dueDate: "2024-06-10",
        tags: ["Research", "UX"],
        status: "active"
      },
      {
        id: "2",
        title: "Competitor Analysis",
        description: "Research and document competitor websites and features",
        priority: "Low",
        assignee: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", initials: "MJ" },
        dueDate: "2024-06-12",
        tags: ["Research"],
        status: "active"
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
        tags: ["Design", "Wireframes"],
        status: "overdue"
      },
      {
        id: "4",
        title: "Navigation Structure",
        description: "Design and plan the new website navigation",
        priority: "High",
        assignee: { name: "Alex Rodriguez", avatar: "/avatars/alex.jpg", initials: "AR" },
        dueDate: "2024-06-09",
        tags: ["UX", "Navigation"],
        status: "active"
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
        tags: ["Design", "Components"],
        status: "active"
      },
      {
        id: "6",
        title: "Backend API Integration",
        description: "Connect frontend with existing backend APIs",
        priority: "Medium",
        assignee: { name: "Tom Wilson", avatar: "/avatars/tom.jpg", initials: "TW" },
        dueDate: "2024-06-20",
        tags: ["Development", "API"],
        status: "active"
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
        tags: ["Development", "Mobile"],
        status: "overdue"
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
        tags: ["Planning"],
        status: "completed"
      }
    ]
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getFilteredTasks = (columnTasks: any[]) => {
    if (taskFilter === "all") return columnTasks;
    if (taskFilter === "overdue") return columnTasks.filter(task => isTaskOverdue(task.dueDate));
    if (taskFilter === "completed") return columnTasks.filter(task => task.status === "completed");
    if (taskFilter === "active") return columnTasks.filter(task => task.status === "active");
    return columnTasks;
  };

  const handleAddTask = (columnId: string) => {
    if (newTask.title && newTask.description) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        assignee: teamMembers.find(member => member.name === newTask.assignee) || teamMembers[0],
        dueDate: newTask.dueDate,
        tags: newTask.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        status: "active"
      };
      
      setTasks(prev => ({
        ...prev,
        [columnId]: [...prev[columnId as keyof typeof prev], task]
      }));
      
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        assignee: "",
        dueDate: "",
        tags: ""
      });
      setIsAddTaskOpen(false);
    }
  };

  const moveTask = (taskId: string, fromColumn: string, toColumn: string) => {
    const task = tasks[fromColumn as keyof typeof tasks].find(t => t.id === taskId);
    if (task) {
      setTasks(prev => ({
        ...prev,
        [fromColumn]: prev[fromColumn as keyof typeof prev].filter(t => t.id !== taskId),
        [toColumn]: [...prev[toColumn as keyof typeof prev], task]
      }));
    }
  };

  const getTaskCounts = () => {
    const allTasks = Object.values(tasks).flat();
    return {
      active: allTasks.filter(task => task.status === "active").length,
      completed: allTasks.filter(task => task.status === "completed").length,
      overdue: allTasks.filter(task => isTaskOverdue(task.dueDate) && task.status !== "completed").length
    };
  };

  const taskCounts = getTaskCounts();

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
              <Dialog open={isTeamOpen} onOpenChange={setIsTeamOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-gray-300">
                    <Users className="w-4 h-4 mr-2" />
                    Team ({teamMembers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Team Members</DialogTitle>
                    <DialogDescription>
                      View and manage team members for this project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task and assign it to a team member
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.name} value={member.name}>
                              {member.name} - {member.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newTask.tags}
                        onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                        placeholder="frontend, urgent, etc."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleAddTask("backlog")}>Create Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Stats and Filters */}
          <div className="flex justify-between items-center">
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{taskCounts.active} Active Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{taskCounts.completed} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{taskCounts.overdue} Overdue</span>
              </div>
            </div>
            
            <Select value={taskFilter} onValueChange={setTaskFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
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
                      {getFilteredTasks(tasks[column.id as keyof typeof tasks] || []).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 min-h-96 bg-gray-50">
                  {getFilteredTasks(tasks[column.id as keyof typeof tasks] || []).map((task) => (
                    <Card 
                      key={task.id} 
                      className={`border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer ${
                        isTaskOverdue(task.dueDate) && task.status !== "completed" ? "border-red-200 bg-red-50" : ""
                      }`}
                    >
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
                            <div className={`flex items-center gap-1 text-xs ${
                              isTaskOverdue(task.dueDate) && task.status !== "completed" 
                                ? "text-red-600 font-medium" 
                                : "text-gray-500"
                            }`}>
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>

                          {/* Move Task Buttons */}
                          <div className="flex gap-2 pt-2">
                            {columns.map((col) => {
                              if (col.id !== column.id) {
                                return (
                                  <Button
                                    key={col.id}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={() => moveTask(task.id, column.id, col.id)}
                                  >
                                    → {col.title}
                                  </Button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Task Button */}
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    onClick={() => setIsAddTaskOpen(true)}
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
