
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Search, Plus, Archive, Bug, AlertCircle, CheckCircle, Github } from "lucide-react";

const Issues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const issues = [
    {
      id: "ISS-001",
      title: "Login form validation not working properly",
      description: "Users can submit empty forms which causes server errors",
      type: "Bug",
      status: "Open",
      priority: "High",
      assignee: { name: "Sarah Chen", initials: "SC" },
      reporter: { name: "Mike Johnson", initials: "MJ" },
      project: "Website Redesign",
      created: "2024-05-28",
      updated: "2024-05-30",
      githubIssue: "#123",
      labels: ["frontend", "validation", "urgent"]
    },
    {
      id: "ISS-002",
      title: "Add dark mode support",
      description: "Implement dark mode theme across the entire application",
      type: "Feature",
      status: "In Progress",
      priority: "Medium",
      assignee: { name: "Emma Davis", initials: "ED" },
      reporter: { name: "Alex Rodriguez", initials: "AR" },
      project: "Website Redesign",
      created: "2024-05-25",
      updated: "2024-05-29",
      githubIssue: "#118",
      labels: ["enhancement", "ui", "theme"]
    },
    {
      id: "ISS-003",
      title: "Database connection timeout",
      description: "Random database connection timeouts during peak hours",
      type: "Bug",
      status: "Open",
      priority: "Critical",
      assignee: { name: "Tom Wilson", initials: "TW" },
      reporter: { name: "Sarah Chen", initials: "SC" },
      project: "Database Migration",
      created: "2024-05-30",
      updated: "2024-05-30",
      githubIssue: "#125",
      labels: ["backend", "database", "performance"]
    },
    {
      id: "ISS-004",
      title: "Improve mobile responsiveness",
      description: "Several pages have layout issues on mobile devices",
      type: "Improvement",
      status: "Resolved",
      priority: "Medium",
      assignee: { name: "Emma Davis", initials: "ED" },
      reporter: { name: "Mike Johnson", initials: "MJ" },
      project: "Website Redesign",
      created: "2024-05-20",
      updated: "2024-05-28",
      githubIssue: "#115",
      labels: ["mobile", "responsive", "ui"]
    },
    {
      id: "ISS-005",
      title: "API rate limiting implementation",
      description: "Add rate limiting to prevent API abuse and improve performance",
      type: "Feature",
      status: "Open",
      priority: "Low",
      assignee: { name: "Alex Rodriguez", initials: "AR" },
      reporter: { name: "Tom Wilson", initials: "TW" },
      project: "Mobile App Development",
      created: "2024-05-22",
      updated: "2024-05-27",
      githubIssue: "#120",
      labels: ["api", "security", "performance"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "In Progress": return <Archive className="w-4 h-4 text-blue-500" />;
      case "Resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Bug": return <Bug className="w-4 h-4 text-red-500" />;
      case "Feature": return <Plus className="w-4 h-4 text-blue-500" />;
      case "Improvement": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
              <p className="text-gray-600 mt-1">Track and manage project issues</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-300">
                <Github className="w-4 h-4 mr-2" />
                Sync with GitHub
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Issue
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues List */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {issues.map((issue) => (
                <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Issue Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(issue.status)}
                          {getTypeIcon(issue.type)}
                        </div>
                        <span className="text-sm font-mono text-gray-500">{issue.id}</span>
                        <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                        <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </Badge>
                      </div>

                      {/* Issue Description */}
                      <p className="text-gray-600 mb-3 ml-11">{issue.description}</p>

                      {/* Labels */}
                      <div className="flex flex-wrap gap-2 mb-3 ml-11">
                        {issue.labels.map((label, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>

                      {/* Issue Meta */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 ml-11">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                              {issue.assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>Assigned to {issue.assignee.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {issue.created}</span>
                        </div>
                        <span>{issue.project}</span>
                        <div className="flex items-center gap-1">
                          <Github className="w-4 h-4" />
                          <span>{issue.githubIssue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Issue Status */}
                    <div className="text-right ml-6">
                      <Badge variant="outline" className="mb-2">
                        {issue.type}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Updated {issue.updated}
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

export default Issues;
