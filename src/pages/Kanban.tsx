
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Briefcase, Plus, Edit, MoreVertical } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useProjects, Project } from "@/hooks/useProjects";
import { useTeamMembers, TeamMember } from "@/hooks/useTeamMembers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Kanban = () => {
  const { user, isCompany } = useUser();
  const { projects, updateProject, fetchProjects } = useProjects();
  const { teamMembers } = useTeamMembers();
  const [groupedProjects, setGroupedProjects] = useState<{ [key: string]: Project[] }>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    groupProjects();
  }, [projects]);

  const groupProjects = () => {
    const grouped = projects.reduce((acc: { [key: string]: Project[] }, project) => {
      if (!acc[project.status]) {
        acc[project.status] = [];
      }
      acc[project.status].push(project);
      return acc;
    }, {});
    setGroupedProjects(grouped);
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const project = projects.find((p) => p.id === draggableId);
    if (!project) return;

    const newStatus = destination.droppableId;

    try {
      await updateProject(draggableId, { status: newStatus as Project['status'] });
      toast.success('Project status updated successfully');
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    
    try {
      await updateProject(selectedProject.id, {
        name: selectedProject.name,
        progress: selectedProject.progress,
        assignedTo: selectedProject.assignedTo,
        priority: selectedProject.priority,
        dueDate: selectedProject.dueDate
      });
      
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      
      // Refresh projects to ensure UI updates
      await fetchProjects();
      
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject({
      ...project,
      assignedTo: project.assignedTo
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-50 border-blue-200";
      case "Planning": return "bg-yellow-50 border-yellow-200";
      case "Completed": return "bg-green-50 border-green-200";
      case "Testing": return "bg-purple-50 border-purple-200";
      case "On Hold": return "bg-red-50 border-red-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!isCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-700">Access Denied</CardTitle>
            <CardDescription className="text-gray-600">
              Sorry, you do not have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Please contact your administrator for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                Kanban Board
              </h1>
              <p className="text-gray-600 mt-2">Manage your projects in a visual way</p>
            </div>
            <Button
              onClick={fetchProjects}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Refresh Projects
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupedProjects).map(([status, statusProjects]) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">{status}</h3>
                  <Badge variant="outline" className="bg-white">
                    {statusProjects.length}
                  </Badge>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'border-emerald-400 bg-emerald-50' 
                          : getStatusColor(status)
                      }`}
                    >
                      <div className="space-y-3">
                        {statusProjects.map((project, index) => (
                          <Draggable key={project.id} draggableId={project.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                                onClick={() => handleProjectClick(project)}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                      {project.name}
                                    </h4>
                                    <Badge className={getPriorityColor(project.priority)} variant="outline">
                                      {project.priority}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {project.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Avatar className="w-5 h-5">
                                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                        {project.client.substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{project.client}</span>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600">Progress</span>
                                      <span className="font-medium text-emerald-600">{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {project.assignedTo?.length || 0}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {project.dueDate || 'No due date'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Project Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update project details and progress
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={selectedProject.name}
                    onChange={(e) => setSelectedProject(prev => prev ? {...prev, name: e.target.value} : null)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="progress">Progress ({selectedProject.progress}%)</Label>
                  <Slider
                    value={[selectedProject.progress]}
                    onValueChange={(value) => setSelectedProject(prev => prev ? {...prev, progress: value[0]} : null)}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <Progress value={selectedProject.progress} className="mt-2 h-3" />
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={selectedProject.priority} 
                    onValueChange={(value) => setSelectedProject(prev => prev ? {...prev, priority: value as any} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={selectedProject.dueDate}
                    onChange={(e) => setSelectedProject(prev => prev ? {...prev, dueDate: e.target.value} : null)}
                  />
                </div>
                
                <div>
                  <Label>Assigned Team Members</Label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {teamMembers.filter(m => m.status === 'Active').map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProject.assignedTo?.includes(member.userId || member.id) || false}
                          onChange={(e) => {
                            const memberId = member.userId || member.id;
                            setSelectedProject(prev => {
                              if (!prev) return null;
                              const currentMembers = prev.assignedTo || [];
                              const newMembers = e.target.checked
                                ? [...currentMembers, memberId]
                                : currentMembers.filter(id => id !== memberId);
                              return {...prev, assignedTo: newMembers};
                            });
                          }}
                          className="rounded border-gray-300"
                        />
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Kanban;
