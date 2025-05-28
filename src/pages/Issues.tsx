
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Search, Plus, Archive, Bug, AlertCircle, CheckCircle, Github } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const Issues = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    type: "Bug",
    priority: "Medium",
    assignee: "",
    project: "",
    labels: ""
  });

  const [issues, setIssues] = useState([
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
  ]);

  const teamMembers = [
    { name: "Sarah Chen", initials: "SC" },
    { name: "Mike Johnson", initials: "MJ" },
    { name: "Emma Davis", initials: "ED" },
    { name: "Alex Rodriguez", initials: "AR" },
    { name: "Tom Wilson", initials: "TW" }
  ];

  const projects = ["Website Redesign", "Mobile App Development", "Database Migration", "E-commerce Platform"];

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

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
                         issue.status.toLowerCase().replace(" ", "-") === statusFilter;
    
    const matchesPriority = priorityFilter === "all" || 
                           issue.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateIssue = () => {
    if (newIssue.title && newIssue.description) {
      const issue = {
        id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
        title: newIssue.title,
        description: newIssue.description,
        type: newIssue.type,
        status: "Open",
        priority: newIssue.priority,
        assignee: teamMembers.find(member => member.name === newIssue.assignee) || teamMembers[0],
        reporter: { name: "Current User", initials: "CU" },
        project: newIssue.project || projects[0],
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        githubIssue: `#${Math.floor(Math.random() * 1000)}`,
        labels: newIssue.labels.split(",").map(label => label.trim()).filter(label => label)
      };
      
      setIssues([issue, ...issues]);
      setNewIssue({
        title: "",
        description: "",
        type: "Bug",
        priority: "Medium",
        assignee: "",
        project: "",
        labels: ""
      });
      setIsNewIssueOpen(false);
    }
  };

  const handleIssueClick = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const handleStatusChange = (issueId: string, newStatus: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updated: new Date().toISOString().split('T')[0] }
        : issue
    ));
  };

  const handleSyncGitHub = () => {
    // In a real app, this would sync with GitHub
    alert("GitHub sync initiated. This would sync with your GitHub repository.");
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
              <Button variant="outline" className="border-gray-300" onClick={handleSyncGitHub}>
                <Github className="w-4 h-4 mr-2" />
                Sync with GitHub
              </Button>
              <Dialog open={isNewIssueOpen} onOpenChange={setIsNewIssueOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Issue</DialogTitle>
                    <DialogDescription>
                      Report a bug, request a feature, or create an improvement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newIssue.title}
                        onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                        placeholder="Issue title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newIssue.description}
                        onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                        placeholder="Describe the issue in detail"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={newIssue.type} onValueChange={(value) => setNewIssue({...newIssue, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bug">Bug</SelectItem>
                          <SelectItem value="Feature">Feature</SelectItem>
                          <SelectItem value="Improvement">Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newIssue.priority} onValueChange={(value) => setNewIssue({...newIssue, priority: value})}>
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
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select value={newIssue.assignee} onValueChange={(value) => setNewIssue({...newIssue, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.name} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project">Project</Label>
                      <Select value={newIssue.project} onValueChange={(value) => setNewIssue({...newIssue, project: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="labels">Labels (comma separated)</Label>
                      <Input
                        id="labels"
                        value={newIssue.labels}
                        onChange={(e) => setNewIssue({...newIssue, labels: e.target.value})}
                        placeholder="frontend, urgent, etc."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsNewIssueOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateIssue}>Create Issue</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleIssueClick(issue.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Issue Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(issue.status)}
                          {getTypeIcon(issue.type)}
                        </div>
                        <span className="text-sm font-mono text-gray-500">{issue.id}</span>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">{issue.title}</h3>
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

                    {/* Issue Actions */}
                    <div className="text-right ml-6">
                      <Badge variant="outline" className="mb-2">
                        {issue.type}
                      </Badge>
                      <div className="text-sm text-gray-500 mb-2">
                        Updated {issue.updated}
                      </div>
                      <Select 
                        value={issue.status} 
                        onValueChange={(value) => handleStatusChange(issue.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
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
