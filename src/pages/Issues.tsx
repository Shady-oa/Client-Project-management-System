import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Search, Plus, Bug, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}

interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  createdAt: string;
  userName?: string;
}

const Issues = () => {
  const { user, isClient, isCompany, isAdmin } = useUser();
  const { projects } = useProjects();
  const { teamMembers } = useTeamMembers();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [comments, setComments] = useState<{ [key: string]: IssueComment[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    project: "",
    labels: ""
  });

  const fetchIssues = async () => {
    if (!user) return;

    try {
      let query = supabase.from('issues').select('*');
      
      if (isClient) {
        // Client sees only issues from their projects
        const clientProjectIds = projects.filter(p => p.clientId === user.id).map(p => p.id);
        if (clientProjectIds.length > 0) {
          query = query.in('project_id', clientProjectIds);
        } else {
          setIssues([]);
          return;
        }
      } else if (isCompany) {
        // Company sees issues from their projects
        const companyProjectIds = projects.filter(p => p.companyId === user.companyId).map(p => p.id);
        if (companyProjectIds.length > 0) {
          query = query.in('project_id', companyProjectIds);
        } else {
          setIssues([]);
          return;
        }
      }
      // Admin sees all issues
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedIssues: Issue[] = data.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description || '',
        status: issue.status as Issue['status'],
        priority: issue.priority as Issue['priority'],
        projectId: issue.project_id || '',
        assignedTo: issue.assigned_to || undefined,
        createdBy: issue.created_by || '',
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        labels: issue.labels || []
      }));

      setIssues(formattedIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch issues');
    }
  };

  const fetchComments = async (issueId: string) => {
    try {
      const { data, error } = await supabase
        .from('issue_comments')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedComments: IssueComment[] = data.map(comment => ({
        id: comment.id,
        issueId: comment.issue_id,
        userId: comment.user_id,
        content: comment.content,
        createdAt: comment.created_at,
        userName: comment.profiles?.full_name || comment.profiles?.email || 'Unknown User'
      }));

      setComments(prev => ({
        ...prev,
        [issueId]: formattedComments
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createIssue = async () => {
    if (!user || !newIssue.title || !newIssue.description || !newIssue.project) return;

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: newIssue.title,
          description: newIssue.description,
          status: 'Open',
          priority: newIssue.priority,
          project_id: newIssue.project,
          assigned_to: newIssue.assignee || null,
          created_by: user.id,
          labels: newIssue.labels.split(',').map(l => l.trim()).filter(l => l)
        });

      if (error) throw error;

      setNewIssue({
        title: "",
        description: "",
        priority: "Medium",
        assignee: "",
        project: "",
        labels: ""
      });
      setIsNewIssueOpen(false);
      fetchIssues();
      toast.success('Issue created successfully');
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue');
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    if (isClient) {
      toast.error('Clients cannot change issue status');
      return;
    }

    try {
      const { error } = await supabase
        .from('issues')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId);

      if (error) throw error;

      fetchIssues();
      toast.success('Issue status updated');
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue status');
    }
  };

  const deleteIssue = async (issueId: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', issueId);

      if (error) throw error;

      fetchIssues();
      toast.success('Issue deleted successfully');
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue');
    }
  };

  const addComment = async (issueId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('issue_comments')
        .insert({
          issue_id: issueId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      fetchComments(issueId);
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  useEffect(() => {
    if (user && projects.length > 0) {
      fetchIssues();
    }
  }, [user, projects]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "In Progress": return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "Resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return <Bug className="w-4 h-4 text-red-500" />;
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
                      <Label htmlFor="project">Project</Label>
                      <Select value={newIssue.project} onValueChange={(value) => setNewIssue({...newIssue, project: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
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
                    {(isCompany || isAdmin) && (
                      <div className="grid gap-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select value={newIssue.assignee} onValueChange={(value) => setNewIssue({...newIssue, assignee: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
                    <Button onClick={createIssue}>Create Issue</Button>
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
              {filteredIssues.map((issue) => {
                const project = projects.find(p => p.id === issue.projectId);
                const assignedMember = teamMembers.find(m => m.id === issue.assignedTo);
                
                return (
                  <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Issue Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(issue.status)}
                            {getTypeIcon("Bug")}
                          </div>
                          <span className="text-sm font-mono text-gray-500">{issue.id.slice(0, 8)}</span>
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
                          {assignedMember && (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                                  {assignedMember.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span>Assigned to {assignedMember.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                          {project && <span>Project: {project.name}</span>}
                        </div>

                        {/* Comments Section */}
                        <div className="ml-11 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIssue(issue);
                              fetchComments(issue.id);
                            }}
                          >
                            View Comments ({comments[issue.id]?.length || 0})
                          </Button>
                        </div>
                      </div>

                      {/* Issue Actions */}
                      <div className="text-right ml-6 space-y-2">
                        <Badge variant="outline">
                          {issue.status}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Updated {new Date(issue.updatedAt).toLocaleDateString()}
                        </div>
                        {!isClient && (
                          <Select 
                            value={issue.status} 
                            onValueChange={(value) => updateIssueStatus(issue.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteIssue(issue.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comments Dialog */}
        <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedIssue?.title}</DialogTitle>
              <DialogDescription>
                Issue comments and communication
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedIssue && comments[selectedIssue.id]?.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={() => selectedIssue && addComment(selectedIssue.id)}>
                Add Comment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Issues;
