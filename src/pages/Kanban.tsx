
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Calendar, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const Kanban = () => {
  const { projects, updateProject } = useProjects();
  const { teamMembers } = useTeamMembers();
  const { user } = useUser();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    dueDate: "",
    project: ""
  });

  const columns = [
    { id: "Planning", title: "Planning", color: "bg-gray-100" },
    { id: "In Progress", title: "In Progress", color: "bg-blue-100" },
    { id: "Testing", title: "Testing", color: "bg-yellow-100" },
    { id: "Completed", title: "Completed", color: "bg-green-100" },
    { id: "On Hold", title: "On Hold", color: "bg-red-100" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isProjectOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getFilteredProjects = (columnProjects: any[]) => {
    if (taskFilter === "all") return columnProjects;
    if (taskFilter === "overdue") return columnProjects.filter(project => isProjectOverdue(project.dueDate));
    if (taskFilter === "completed") return columnProjects.filter(project => project.status === "Completed");
    if (taskFilter === "active") return columnProjects.filter(project => project.status !== "Completed");
    return columnProjects;
  };

  const moveProject = async (projectId: string, newStatus: string) => {
    try {
      await updateProject(projectId, { status: newStatus as any });
      toast.success(`Project moved to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const updateProjectProgress = async (projectId: string, progress: number) => {
    try {
      await updateProject(projectId, { progress });
      toast.success('Progress updated');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const assignMembersToProject = async (projectId: string, memberIds: string[]) => {
    try {
      await updateProject(projectId, { assignedTo: memberIds });
      toast.success('Team members assigned');
    } catch (error) {
      toast.error('Failed to assign team members');
    }
  };

  const getTaskCounts = () => {
    return {
      active: projects.filter(project => project.status !== "Completed").length,
      completed: projects.filter(project => project.status === "Completed").length,
      overdue: projects.filter(project => isProjectOverdue(project.dueDate) && project.status !== "Completed").length
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
              <p className="text-gray-600 mt-1">Manage your projects across different stages</p>
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
                      View team members available for project assignment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {teamMembers.filter(m => m.status === 'Active').map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {member.projects.length} projects
                        </Badge>
                      </div>
                    ))}
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
                <span>{taskCounts.active} Active Projects</span>
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
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => {
            const columnProjects = projects.filter(p => p.status === column.id);
            const filteredProjects = getFilteredProjects(columnProjects);
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className={`${column.color} border-b border-gray-200`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-gray-900">
                        {column.title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-white text-gray-700">
                        {filteredProjects.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 min-h-96 bg-gray-50">
                    {filteredProjects.map((project) => (
                      <Card 
                        key={project.id} 
                        className={`border-gray-200 bg-white hover:shadow-md transition-shadow ${
                          isProjectOverdue(project.dueDate) && project.status !== "Completed" ? "border-red-200 bg-red-50" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Project Header */}
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                {project.name}
                              </h4>
                              <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </Badge>
                            </div>

                            {/* Project Description */}
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {project.description}
                            </p>

                            {/* Client */}
                            <div className="text-xs text-gray-500">
                              Client: {project.client}
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                value={project.progress}
                                onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                                className="w-full h-2"
                              />
                            </div>

                            {/* Assigned Team */}
                            <div className="space-y-2">
                              <div className="text-xs text-gray-500">Assigned Team:</div>
                              <div className="flex flex-wrap gap-1">
                                {project.assignedTo.map((memberId) => {
                                  const member = teamMembers.find(m => m.id === memberId);
                                  return member ? (
                                    <Badge key={memberId} variant="outline" className="text-xs">
                                      {member.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                              <Select 
                                value=""
                                onValueChange={(memberId) => {
                                  const currentAssigned = project.assignedTo || [];
                                  if (!currentAssigned.includes(memberId)) {
                                    assignMembersToProject(project.id, [...currentAssigned, memberId]);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-6 text-xs">
                                  <SelectValue placeholder="Assign member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teamMembers.filter(m => m.status === 'Active' && !project.assignedTo.includes(m.id)).map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name} - {member.role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Project Footer */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                              <div className={`flex items-center gap-1 text-xs ${
                                isProjectOverdue(project.dueDate) && project.status !== "Completed" 
                                  ? "text-red-600 font-medium" 
                                  : "text-gray-500"
                              }`}>
                                <Calendar className="w-3 h-3" />
                                <span>{project.dueDate || 'No due date'}</span>
                              </div>
                              <div className="text-xs text-emerald-600 font-medium">
                                KES {project.budget.toLocaleString()}
                              </div>
                            </div>

                            {/* Move Project Buttons */}
                            <div className="flex gap-1 pt-2 flex-wrap">
                              {columns.map((col) => {
                                if (col.id !== column.id) {
                                  return (
                                    <Button
                                      key={col.id}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-6 px-2"
                                      onClick={() => moveProject(project.id, col.id)}
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
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Kanban;
