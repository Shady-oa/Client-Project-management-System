
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, MessageSquare, Clock, AlertCircle, CheckCircle, Trash2, Edit } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  project_id?: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  labels: string[];
  creator?: {
    full_name: string;
    email: string;
  };
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  issue_id: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

const Issues = () => {
  const { user, isClient, isCompany } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    priority: "Medium" as const
  });

  const fetchIssues = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          creator:profiles!issues_created_by_fkey(full_name, email)
        `);

      if (isClient) {
        // Clients see only their own issues
        query = query.eq('created_by', user.id);
      } else if (isCompany) {
        // Companies see issues from their clients
        const { data: companyProjects } = await supabase
          .from('projects')
          .select('client_id')
          .eq('company_id', user.companyId);
        
        if (companyProjects && companyProjects.length > 0) {
          const clientIds = companyProjects.map(p => p.client_id).filter(Boolean);
          if (clientIds.length > 0) {
            query = query.in('created_by', clientIds);
          }
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
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
          user:profiles!issue_comments_user_id_fkey(full_name, email)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [issueId]: data || [] }));
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
          status: 'Open',
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Issue created successfully');
      setNewIssue({ title: "", description: "", priority: "Medium" });
      setIsCreateDialogOpen(false);
      fetchIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue');
    }
  };

  const updateIssueStatus = async (issueId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId);

      if (error) throw error;

      toast.success('Issue status updated');
      fetchIssues();
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

      toast.success('Issue deleted successfully');
      fetchIssues();
      setSelectedIssue(null);
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
          content: newComment,
          user_id: user.id,
          issue_id: issueId
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
    if (user) {
      fetchIssues();
    }
  }, [user]);

  useEffect(() => {
    if (selectedIssue) {
      fetchComments(selectedIssue.id);
    }
  }, [selectedIssue]);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Issues & Support
            </h1>
            <p className="text-gray-600 mt-2">
              {isClient ? "Track your support requests and issues" : "Manage client support requests"}
            </p>
          </div>
          
          {isClient && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Issue</DialogTitle>
                  <DialogDescription>
                    Describe your issue or support request
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                      placeholder="Detailed description of the issue"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newIssue.priority} onValueChange={(value: any) => setNewIssue({ ...newIssue, priority: value })}>
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
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createIssue}>Create Issue</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <CardTitle className="text-2xl text-emerald-700">Issues</CardTitle>
                <CardDescription>
                  {isClient ? "Your support requests" : "Client support requests"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-emerald-100">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-6 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {issue.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status}
                            </Badge>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            Created by: {issue.creator?.full_name || 'Unknown'} • {new Date(issue.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isCompany && (
                            <Select value={issue.status} onValueChange={(value) => updateIssueStatus(issue.id, value)}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteIssue(issue.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {issues.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No issues yet</h3>
                      <p className="text-sm">
                        {isClient ? "Create your first issue to get support" : "No client issues to review"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issue Details */}
          <div>
            {selectedIssue ? (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                  <CardTitle className="text-xl text-emerald-700">Issue Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{selectedIssue.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{selectedIssue.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge className={getStatusColor(selectedIssue.status)}>
                          {selectedIssue.status}
                        </Badge>
                        <Badge className={getPriorityColor(selectedIssue.priority)}>
                          {selectedIssue.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {comments[selectedIssue.id]?.map((comment) => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {comment.user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{comment.user?.full_name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                        {(!comments[selectedIssue.id] || comments[selectedIssue.id].length === 0) && (
                          <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="space-y-2">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                        />
                        <Button
                          onClick={() => addComment(selectedIssue.id)}
                          disabled={!newComment.trim()}
                          className="w-full"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select an Issue</h3>
                  <p className="text-sm">Click on an issue to view details and comments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;
