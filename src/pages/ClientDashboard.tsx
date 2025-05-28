
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, AlertCircle, CheckCircle, MessageSquare, Download, Play, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const myProjects = [
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      company: "TechCraft Solutions",
      status: "In Progress",
      progress: 75,
      dueDate: "2024-07-15",
      lastUpdate: "2024-05-30",
      budget: 850000,
      spent: 637500,
      phase: "Development",
      nextMilestone: "Beta Testing"
    },
    {
      id: 2,
      name: "Mobile App Development",
      company: "Digital Innovations",
      status: "Testing",
      progress: 90,
      dueDate: "2024-06-20",
      lastUpdate: "2024-05-29",
      budget: 650000,
      spent: 585000,
      phase: "Quality Assurance",
      nextMilestone: "App Store Submission"
    }
  ];

  const recentUpdates = [
    {
      id: 1,
      project: "E-commerce Platform",
      message: "Payment gateway integration completed",
      author: "Sarah Chen",
      date: "2024-05-30",
      type: "progress"
    },
    {
      id: 2,
      project: "Mobile App",
      message: "Beta version ready for testing",
      author: "Mike Johnson",
      date: "2024-05-29",
      type: "milestone"
    },
    {
      id: 3,
      project: "E-commerce Platform",
      message: "UI design approved and implemented",
      author: "Emma Davis",
      date: "2024-05-28",
      type: "approval"
    }
  ];

  const stats = [
    { title: "Active Projects", value: "2", icon: Clock, change: "On schedule", color: "bg-emerald-50 text-emerald-600" },
    { title: "Total Investment", value: "KES 1.5M", icon: CheckCircle, change: "Within budget", color: "bg-blue-50 text-blue-600" },
    { title: "Avg. Progress", value: "82%", icon: AlertCircle, change: "Ahead of timeline", color: "bg-amber-50 text-amber-600" },
    { title: "Open Issues", value: "3", icon: MessageSquare, change: "Need attention", color: "bg-red-50 text-red-600" }
  ];

  const handleProjectClick = (projectId: number) => {
    navigate(`/client/projects/${projectId}`);
  };

  const handleTestProject = (projectId: number) => {
    alert(`Opening test environment for project ${projectId}`);
  };

  const handleRaiseIssue = () => {
    navigate("/issues");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Testing": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case "progress": return "bg-blue-100 text-blue-800";
      case "milestone": return "bg-green-100 text-green-800";
      case "approval": return "bg-amber-100 text-amber-800";
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
                Project Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Track your project progress and updates</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRaiseIssue}
                className="border-emerald-300 hover:bg-emerald-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Raise Issue
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => navigate("/contact")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
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
                <CardTitle className="text-2xl text-emerald-700">My Projects</CardTitle>
                <CardDescription>Current projects and their progress</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-emerald-100">
                  {myProjects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className="p-6 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer animate-fade-in"
                      onClick={() => handleProjectClick(project.id)}
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg hover:text-emerald-600 transition-colors">
                              {project.name}
                            </h3>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">Developed by {project.company}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Current Phase:</span> {project.phase}
                            </div>
                            <div>
                              <span className="font-medium">Next Milestone:</span> {project.nextMilestone}
                            </div>
                            <div>
                              <span className="font-medium">Due Date:</span> {project.dueDate}
                            </div>
                            <div>
                              <span className="font-medium">Last Update:</span> {project.lastUpdate}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
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
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Budget:</span> KES {project.budget.toLocaleString()} 
                              <span className="mx-2">•</span>
                              <span className="font-medium">Spent:</span> KES {project.spent.toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTestProject(project.id);
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
                                  alert("Downloading project report...");
                                }}
                                className="border-emerald-300 hover:bg-emerald-50"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <div>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <CardTitle className="text-xl text-emerald-700">Recent Updates</CardTitle>
                <CardDescription>Latest project notifications</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={update.id} className="p-4 rounded-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all duration-200 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-xs font-semibold">
                            {update.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-gray-900">{update.project}</p>
                            <Badge className={`text-xs ${getUpdateTypeColor(update.type)}`}>
                              {update.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{update.message}</p>
                          <div className="text-xs text-gray-500">
                            {update.author} • {update.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-emerald-300 hover:bg-emerald-50">
                  View All Updates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
