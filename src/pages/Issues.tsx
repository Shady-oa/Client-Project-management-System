
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, AlertCircle, Clock, CheckCircle, Filter, Search, User, Send } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  projectId?: string;
  projectName?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  labels: string[];
  creator?: {
    full_name: string;
    email: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user: {
    full_name: string;
    email: string;
  };
  created_at: string;
}

const Issues = () => {
  const { user, isClient, isCompany } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState("");
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    priority: "Medium" as Issue['priority'],
    projectId: ""
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = async () => {
    if (!user) return;

    try {
      let query = supabase.from('projects').select('*');
      
      if (isClient) {
        query = query.eq('client_id', user.id);
      } else if (isCompany) {
        query = query.eq('company_id', user.companyId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchIssues = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          profiles!issues_created_by_fkey (full_name, email),
          projects (name, client_id, company_id)
        `);

      if (isClient) {
        // Client sees only issues they created
        query = query.eq('created_by', user.id);
      } else if (isCompany) {
        // Company sees issues from their projects
        const { data: companyProjects } = await supabase
          .from('projects')
          .select('id')
          .eq('company_id', user.companyId);
        
        if (companyProjects && companyProjects.length > 0) {
          const projectIds = companyProjects.map(p => p.id);
          query = query.in('project_id', projectIds);
        } else {
          setIssues([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedIssues: Issue[] = (data || []).map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description || '',
        status: issue.status as Issue['status'],
        priority: issue.priority as Issue['priority'],
        projectId: issue.project_id || undefined,
        projectName: issue.projects?.name || 'Unknown Project',
        assignedTo: issue.assigned_to || undefined,
        createdBy: issue.created_by,
        createdAt: new Date(issue.created_at).toLocaleDateString(),
        labels: issue.labels || [],
        creator: issue.profiles ? {
          full_name: issue.profiles.full_name || 'Unknown User',
          email: issue.profiles.email || ''
        } : undefined
      }));

      setIssues(formattedIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (issueId: string) => {
    try {
      const { data, error } = await supabase
        .from('issue_comments')
        .select(`
          *,
          profiles!issue_comments_user_id_fkey (full_name, email)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedComments: Comment[] = (data || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        user: {
          full_name: comment.profiles?.full_name || 'Unknown User',
          email: comment.profiles?.email || ''
        },
        created_at: new Date(comment.created_at).toLocaleDateString()
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
    if (!user || !newIssue.title.trim()) return;

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: newIssue.title,
          description: newIssue.description,
          priority: newIssue.priority,
          project_id: newIssue.projectId || null,
          created_by: user.id,
          status: 'Open'
        });

      if (error) throw error;

      await fetchIssues();
      setIsCreateDialogOpen(false);
      setNewIssue({ title: "", description: "", priority: "Medium", projectId: "" });
      toast.success('Issue created successfully');
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue');
    }
  };

  const updateIssueStatus = async (issueId: string, status: Issue['status']) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId);

      if (error) throw error;

      await fetchIssues();
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

      await fetchIssues();
      setSelectedIssue(null);
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
          content: newComment
        });

      if (error) throw error;

      await fetchComments(issueId);
      setNewComment("");
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchIssues();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return AlertCircle;
      case "In Progress": return Clock;
      case "Resolved": return CheckCircle;
      case "Closed": return CheckCircle;
      default: return AlertCircle;
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-emerald-600 border-t-transparent rounded-full" />
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Issues & Support
            </h1>
            <p className="text-gray-600 mt-2">
              {isClient ? "Track your issues and get support" : "Manage and resolve client issues"}
            </p>
          </div>
          {isClient && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Report New Issue</DialogTitle>
                  <DialogDescription>
                    Describe the issue you're experiencing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project</label>
                    <Select value={newIssue.projectId} onValueChange={(value) => setNewIssue(prev => ({ ...prev, projectId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newIssue.title}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newIssue.description}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the issue"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newIssue.priority} onValueChange={(value: Issue['priority']) => setNewIssue(prev => ({ ...prev, priority: value }))}>
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
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createIssue} className="bg-emerald-600 hover:bg-emerald-700">
                    Create Issue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => {
            const StatusIcon = getStatusIcon(issue.status);
            return (
              <Card key={issue.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 line-clamp-2">
                        {issue.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {issue.description}
                      </CardDescription>
                    </div>
                    <div className="ml-3">
                      <StatusIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Project:</strong> {issue.projectName}</p>
                      {issue.creator && (
                        <p><strong>Created by:</strong> {issue.creator.full_name}</p>
                      )}
                      <p><strong>Date:</strong> {issue.createdAt}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {isCompany && (
                        <Select value={issue.status} onValueChange={(status: Issue['status']) => updateIssueStatus(issue.id, status)}>
                          <SelectTrigger className="h-8 text-xs">
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
                        onClick={() => {
                          setSelectedIssue(issue);
                          fetchComments(issue.id);
                        }}
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comments
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteIssue(issue.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">
              {isClient ? "You haven't reported any issues yet." : "No issues to resolve at the moment."}
            </p>
          </div>
        )}

        {/* Comments Dialog */}
        {selectedIssue && (
          <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedIssue.title}</DialogTitle>
                <DialogDescription>
                  {selectedIssue.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedIssue.status)}>
                    {selectedIssue.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedIssue.priority)}>
                    {selectedIssue.priority}
                  </Badge>
                </div>

                {/* Comments */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <h4 className="font-medium">Comments</h4>
                  {comments[selectedIssue.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                          {comment.user.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.user.full_name}</span>
                          <span className="text-xs text-gray-500">{comment.created_at}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addComment(selectedIssue.id)}
                    disabled={!newComment.trim()}
                    className="self-end bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Issues;
