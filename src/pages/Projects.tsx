
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Archive, Search, Plus, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design and improved user experience",
      status: "In Progress",
      progress: 65,
      team: 8,
      dueDate: "2024-06-15",
      priority: "High",
      client: "Internal",
      budget: "$50,000"
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android application for customer engagement",
      status: "Planning",
      progress: 20,
      team: 5,
      dueDate: "2024-08-30",
      priority: "Medium",
      client: "TechStart Inc",
      budget: "$120,000"
    },
    {
      id: 3,
      name: "Database Migration",
      description: "Move legacy systems to modern cloud infrastructure",
      status: "In Progress",
      progress: 80,
      team: 3,
      dueDate: "2024-06-01",
      priority: "High",
      client: "DataCorp",
      budget: "$75,000"
    },
    {
      id: 4,
      name: "E-commerce Platform",
      description: "Build custom e-commerce solution with advanced features",
      status: "Planning",
      progress: 10,
      team: 12,
      dueDate: "2024-12-15",
      priority: "Medium",
      client: "ShopForward",
      budget: "$200,000"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage all your company projects</p>
            </div>
            <Link to="/projects/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
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
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
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
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-gray-900">{project.name}</CardTitle>
                    <Badge 
                      variant={project.priority === "High" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.team} members
                      </div>
                      <span className="font-medium">{project.budget}</span>
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
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </div>
                          <Badge 
                            variant={project.priority === "High" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.team} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due {project.dueDate}
                          </div>
                          <span>{project.client}</span>
                          <span className="font-medium">{project.budget}</span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-sm text-gray-600 mb-2">{project.progress}% Complete</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
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
      </div>
    </div>
  );
};

export default Projects;
