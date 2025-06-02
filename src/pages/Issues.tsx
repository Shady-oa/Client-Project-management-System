import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Clock, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useProjects } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Issues = () => {
  const { user, isClient, isCompany } = useUser();
  const { projects } = useProjects();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    priority: "Medium",
    project_id: ""
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIssues = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          projects:project_id (name, client),
          creator:created_by!inner (
            id
          )
        `);

      if (isClient) {
        query = query.eq('created_by', user.id);
      } else if (isCompany && user.companyId) {
        query = query.in('project_id', projects.map(p => p.id));
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

  const fetchComments = async (issueId) => {
    try {
      const { data, error } = await supabase
        .from('issue_comments')
        .select(`
          *,
          user_profile:user_id!inner (
            id
          )
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    }
  };

  const handleCreateIssue = async () => {
    if (!user || !newIssue.title || !newIssue.project_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: newIssue.title,
          description: newIssue.description,
          priority: newIssue.priority,
          project_id: newIssue.project_id,
          created_by: user.id,
          status: 'Open'
        });

      if (error) throw error;

      toast.success('Issue created successfully');
      setIsCreateDialogOpen(false);
      setNewIssue({ title: "", description: "", priority: "Medium", project_id: "" });
      fetchIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue');
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', issueId);

      if (error) throw error;

      toast.success('Issue status updated');
      fetchIssues();
      if (selectedIssue?.id === issueId) {
        setSelectedIssue(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast.error('Failed to update issue status');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedIssue) return;

    try {
      const { error } = await supabase
        .from('issue_comments')
        .insert({
          issue_id: selectedIssue.id,
          user_id: user.id,
          content: newComment
        });

      if (error) throw error;

      toast.success('Comment added');
      setNewComment("");
      fetchComments(selectedIssue.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;

    try {
      // Delete comments first
      await supabase.from('issue_comments').delete().eq('issue_id', issueId);
      
      // Then delete the issue
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', issueId);

      if (error) throw error;

      toast.success('Issue deleted successfully');
      fetchIssues();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue');
    }
  };

  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setIsViewDialogOpen(true);
    fetchComments(issue.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (comment) => {
    // Get user name from profiles table or fallback
    if (comment.user_id === user?.id) {
      return user.name || 'You';
    }
    return 'Team Member';
  };

  const getUserEmail = (comment) => {
    if (comment.user_id === user?.id) {
      return user.email || '';
    }
    return '';
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user, projects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                {isClient ? "My Issues" : "Project Issues"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isClient ? "Track and manage your reported issues" : "Manage and respond to client issues"}
              </p>
            </div>
            {isClient && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 animate-spin border-4 border-emerald-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <Card
                key={issue.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                onClick={() => handleViewIssue(issue)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {issue.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {issue.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>0 comments</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Project: {issue.projects?.name || 'Unknown'}</div>
                      {issue.creator?.profiles && (
                        <div>Reported by: {issue.creator.profiles.full_name}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {issues.length === 0 && (
              <div className="col-span-full text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No issues found</h3>
                <p className="text-gray-600">
                  {isClient ? "You haven't reported any issues yet." : "No issues have been reported for your projects."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Create Issue Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report New Issue</DialogTitle>
              <DialogDescription>
                Describe the issue you're experiencing with your project
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="project">Project</Label>
                <Select 
                  value={newIssue.project_id} 
                  onValueChange={(value) => setNewIssue(prev => ({ ...prev, project_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
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
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newIssue.priority} 
                  onValueChange={(value) => setNewIssue(prev => ({ ...prev, priority: value }))}
                >
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
              <Button onClick={handleCreateIssue} className="bg-emerald-600 hover:bg-emerald-700">
                Report Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Issue Dialog */}
        {selectedIssue && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedIssue.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      Project: {selectedIssue.projects?.name || 'Unknown'}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(selectedIssue.priority)}>
                      {selectedIssue.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedIssue.status)}>
                      {selectedIssue.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedIssue.description}</p>
                </div>

                {isCompany && (
                  <div>
                    <Label htmlFor="status">Update Status</Label>
                    <Select 
                      value={selectedIssue.status} 
                      onValueChange={(value) => handleUpdateIssueStatus(selectedIssue.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">Comments</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-sm">
                            {getUserName(comment).split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{getUserName(comment)}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No comments yet</p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={handleAddComment} className="bg-emerald-600 hover:bg-emerald-700">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteIssue(selectedIssue.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Issue
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Issues;
