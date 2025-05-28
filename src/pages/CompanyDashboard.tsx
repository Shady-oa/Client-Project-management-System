
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Users, Clock, CheckCircle, Plus, Settings, User, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "RetailMax Corp",
      status: "In Progress",
      progress: 75,
      team: 6,
      dueDate: "2024-07-15",
      priority: "High",
      budget: 850000,
      clientAvatar: "RM"
    },
    {
      id: 2,
      name: "Mobile Banking App",
      client: "SecureBank Ltd",
      status: "Planning",
      progress: 25,
      team: 4,
      dueDate: "2024-09-30",
      priority: "Critical",
      budget: 1200000,
      clientAvatar: "SB"
    },
    {
      id: 3,
      name: "CRM Dashboard",
      client: "SalesForce Kenya",
      status: "In Progress",
      progress: 90,
      team: 3,
      dueDate: "2024-06-20",
      priority: "Medium",
      budget: 450000,
      clientAvatar: "SF"
    }
  ];

  const teamMembers = [
    { name: "Sarah Chen", role: "Project Manager", projects: 3, avatar: "SC" },
    { name: "Mike Johnson", role: "Full Stack Developer", projects: 2, avatar: "MJ" },
    { name: "Emma Davis", role: "UI/UX Designer", projects: 4, avatar: "ED" },
    { name: "Alex Rodriguez", role: "Backend Developer", projects: 2, avatar: "AR" }
  ];

  const stats = [
    { title: "Active Projects", value: "8", icon: Briefcase, change: "+2 this month", color: "bg-emerald-50 text-emerald-600" },
    { title: "Team Members", value: "12", icon: Users, change: "+1 this week", color: "bg-blue-50 text-blue-600" },
    { title: "On-Time Delivery", value: "94%", icon: Clock, change: "+3% from last month", color: "bg-amber-50 text-amber-600" },
    { title: "Completed Projects", value: "24", icon: CheckCircle, change: "+4 this quarter", color: "bg-green-50 text-green-600" }
  ];

  const handleNewProject = () => {
    navigate("/projects");
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Planning": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                Company Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back to {user?.companyName || "Your Company"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/profile")}
                className="border-emerald-300 hover:bg-emerald-50"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/settings")}
                className="border-emerald-300 hover:bg-emerald-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" 
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in bg-white/70 backdrop-blur-sm cursor-pointer" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Overview */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-emerald-700">Active Projects</CardTitle>
                    <CardDescription>Track progress across your client projects</CardDescription>
                  </div>
                  <Link to="/projects">
                    <Button variant="outline" className="border-emerald-300 hover:bg-emerald-50">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-emerald-100">
                  {projects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className="p-6 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer animate-fade-in"
                      onClick={() => handleProjectClick(project.id)}
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-semibold">
                                {project.clientAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-sm text-gray-600">{project.client}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.team} members
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Due {project.dueDate}
                            </div>
                            <span className="font-medium text-emerald-600">
                              KES {project.budget.toLocaleString()}
                            </span>
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
          </div>

          {/* Team Overview */}
          <div>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <CardTitle className="text-xl text-emerald-700">Team Members</CardTitle>
                <CardDescription>Your project team</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={member.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-all duration-200 cursor-pointer animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-semibold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                        {member.projects} projects
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link to="/users">
                  <Button variant="outline" className="w-full mt-4 border-emerald-300 hover:bg-emerald-50">
                    View All Team Members
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
