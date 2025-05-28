
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Archive, Briefcase, Plus, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCompany] = useState("Acme Corp");

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      status: "In Progress",
      progress: 65,
      team: 8,
      dueDate: "2024-06-15",
      priority: "High"
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android application",
      status: "Planning",
      progress: 20,
      team: 5,
      dueDate: "2024-08-30",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Database Migration",
      description: "Move to cloud infrastructure",
      status: "In Progress",
      progress: 80,
      team: 3,
      dueDate: "2024-06-01",
      priority: "High"
    }
  ];

  const stats = [
    { title: "Active Projects", value: "12", icon: Briefcase, change: "+2 this month" },
    { title: "Team Members", value: "48", icon: Users, change: "+5 this month" },
    { title: "Open Issues", value: "23", icon: Archive, change: "-8 from last week" },
    { title: "Upcoming Deadlines", value: "7", icon: Calendar, change: "Next 30 days" }
  ];

  const handleNewProject = () => {
    navigate("/projects");
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleUserProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back to {selectedCompany}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUserProfileClick}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSettingsClick}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewProject}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Overview */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-gray-900">Recent Projects</CardTitle>
                <CardDescription>Track progress across your active projects</CardDescription>
              </div>
              <Link to="/projects">
                <Button variant="outline" className="border-gray-300">
                  View All Projects
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">{project.name}</h3>
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
      </div>
    </div>
  );
};

export default Dashboard;
