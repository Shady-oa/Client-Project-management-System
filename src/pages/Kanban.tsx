
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Calendar, Users } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useUser } from "@/contexts/UserContext";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { toast } from "sonner";

const Kanban = () => {
  const { user, isCompany } = useUser();
  const { projects, updateProject } = useProjects();
  const { teamMembers } = useTeamMembers();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Group projects by status
  const groupedProjects = {
    'Planning': projects.filter(p => p.status === 'Planning'),
    'In Progress': projects.filter(p => p.status === 'In Progress'),
    'Testing': projects.filter(p => p.status === 'Testing'),
    'Completed': projects.filter(p => p.status === 'Completed')
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    try {
      await updateProject(draggableId, { status: newStatus });
      toast.success(`Project moved to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject({
      ...project,
      assignedMembers: project.assignedTo || []
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;

    try {
      await updateProject(selectedProject.id, {
        name: selectedProject.name,
        progress: selectedProject.progress,
        assignedTo: selectedProject.assignedMembers,
        priority: selectedProject.priority,
        dueDate: selectedProject.dueDate
      });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast.success('Project updated successfully');
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 border-yellow-300';
      case 'In Progress': return 'bg-blue-100 border-blue-300';
      case 'Testing': return 'bg-purple-100 border-purple-300';
      case 'Completed': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600">Kanban board is only available for company users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
            Project Kanban
          </h1>
          <p className="text-gray-600 mt-2">Drag and drop projects to update their status</p>
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
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                  snapshot.isDragging ? 'rotate-2 shadow-xl' : ''
                                }`}
                                onClick={() => handleProjectClick(project)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <CardTitle className="text-sm font-medium line-clamp-2">
                                      {project.name}
                                    </CardTitle>
                                    <Badge className={getPriorityColor(project.priority)}>
                                      {project.priority}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <Users className="w-3 h-3" />
                                      {project.assignedTo?.length || 0} members
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                                          style={{ width: `${project.progress}%` }}
                                        />
                                      </div>
                                    </div>
                                    
                                    {project.dueDate && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        Due {new Date(project.dueDate).toLocaleDateString()}
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1">
                                      {project.assignedTo?.slice(0, 3).map((memberId, idx) => {
                                        const member = teamMembers.find(m => m.id === memberId);
                                        return (
                                          <Avatar key={idx} className="w-6 h-6">
                                            <AvatarFallback className="bg-emerald-500 text-white text-xs">
                                              {member?.avatar || 'U'}
                                            </AvatarFallback>
                                          </Avatar>
                                        );
                                      })}
                                      {project.assignedTo?.length > 3 && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          +{project.assignedTo.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Edit Project Dialog */}
        {selectedProject && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Update project details and track progress
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={selectedProject.name}
                    onChange={(e) => setSelectedProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={selectedProject.priority} 
                    onValueChange={(value) => setSelectedProject(prev => ({ ...prev, priority: value }))}
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
                  <Label htmlFor="progress">Progress: {selectedProject.progress}%</Label>
                  <Slider
                    value={[selectedProject.progress]}
                    onValueChange={(value) => setSelectedProject(prev => ({ ...prev, progress: value[0] }))}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={selectedProject.dueDate || ''}
                    onChange={(e) => setSelectedProject(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Assigned Team Members</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {teamMembers.filter(m => m.status === 'Active').map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedProject.assignedMembers?.includes(member.id) || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedProject(prev => ({
                              ...prev,
                              assignedMembers: checked
                                ? [...(prev.assignedMembers || []), member.id]
                                : (prev.assignedMembers || []).filter(id => id !== member.id)
                            }));
                          }}
                        />
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
        )}
      </div>
    </div>
  );
};

export default Kanban;
