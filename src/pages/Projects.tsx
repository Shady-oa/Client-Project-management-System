import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Archive, Search, Plus, Grid, List, Settings, Eye, Play, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useProject } from "@/contexts/ProjectContext";

const Projects = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isCompany, isClient } = useUser();
  const { getProjectsByRole, addProject, updateProject, getTeamMembersByRole } = useProject();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    client: "",
    budget: "",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High" | "Critical"
  });

  const projects = getProjectsByRole();
  const teamMembers = getTeamMembersByRole();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "Testing": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         project.status.toLowerCase().replace(" ", "-") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      addProject({
        name: newProject.name,
        description: newProject.description,
        status: "Planning",
        progress: 0,
        team: [],
        dueDate: newProject.dueDate,
        priority: newProject.priority,
        client: newProject.client || "Internal",
        budget: parseInt(newProject.budget) || 0,
        spent: 0,
        phase: "Initial Planning",
        nextMilestone: "Project Kickoff",
        lastUpdate: new Date().toISOString().split('T')[0],
        createdBy: user?.id || 'unknown',
        assignedTo: []
      });
      
      setNewProject({
        name: "",
        description: "",
        client: "",
        budget: "",
        dueDate: "",
        priority: "Medium"
      });
      setIsNewProjectOpen(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    if (isClient) {
      // Client can only view project details
      alert(`Viewing project details for ${projectId}`);
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

  const handleProgressUpdate = (projectId: string, newProgress: number) => {
    if (isCompany || isAdmin) {
      updateProject(projectId, { progress: newProgress });
    }
  };

  const getActionButtons = (project: any) => {
    if (isClient) {
      return (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Testing project: ${project.name}`);
            }}
            className="border-emerald-300 hover:bg-emerald-50"
          >
            <Play className="w-4 h-4 mr-1" />
            Test
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Downloading report for: ${project.name}`);
            }}
            className="border-emerald-300 hover:bg-emerald-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Report
          </Button>
        </div>
      );
    } else if (isCompany || isAdmin) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}/settings`);
          }}
          className="hover:bg-emerald-50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                {isClient ? "My Projects" : isAdmin ? "All Projects" : "Company Projects"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isClient ? "Track your project progress" : "Manage your projects"}
              </p>
            </div>
            {(isCompany || isAdmin) && (
              <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-emerald-700">Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to your workspace. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        placeholder="Enter project name"
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Project description"
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        value={newProject.client}
                        onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                        placeholder="Client name"
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Budget (KES)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                        placeholder="Project budget"
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                        className="border-emerald-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value as any})}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
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
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject} className="bg-emerald-600 hover:bg-emerald-700">
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-300"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-300"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle 
                      className="text-lg text-gray-900 hover:text-emerald-600 cursor-pointer"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {project.name}
                    </CardTitle>
                    <div className="flex gap-2 items-center">
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                      {getActionButtons(project)}
                    </div>
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </CardHeader>
                <CardContent onClick={() => handleProjectClick(project.id)}>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.assignedTo.length} members
                      </div>
                      <span className="font-medium text-emerald-600">
                        KES {project.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due {project.dueDate}
                      </div>
                      <span className="text-gray-500">{project.client}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-emerald-100">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="p-6 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer animate-fade-in" onClick={() => handleProjectClick(project.id)} style={{animationDelay: `${index * 50}ms`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 hover:text-emerald-600">{project.name}</h3>
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </div>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                          {getActionButtons(project)}
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.assignedTo.length} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due {project.dueDate}
                          </div>
                          <span>{project.client}</span>
                          <span className="font-medium text-emerald-600">KES {project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-sm text-gray-600 mb-2">{project.progress}% Complete</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredProjects.length === 0 && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : isClient 
                    ? "No projects have been assigned to you yet."
                    : "Get started by creating your first project."
                }
              </p>
              {(isCompany || isAdmin) && !searchTerm && statusFilter === "all" && (
                <Button onClick={() => setIsNewProjectOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;
