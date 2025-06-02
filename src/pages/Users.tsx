
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Briefcase,
  Edit,
  UserX,
  Trash2,
  DollarSign
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useProjects } from "@/hooks/useProjects";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";

const Users = () => {
  const { user, isAdmin, isCompany } = useUser();
  const { 
    teamMembers, 
    loading, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember, 
    deactivateTeamMember 
  } = useTeamMembers();
  const { projects } = useProjects();
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (selectedMember) {
        await updateTeamMember(selectedMember.id, memberData);
      } else {
        await addTeamMember({
          ...memberData,
          avatar: memberData.name.split(' ').map(n => n[0]).join(''),
          projects: [],
          permissions: ['read'],
          hireDate: new Date().toISOString().split('T')[0]
        });
      }
      setIsDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    await deleteTeamMember(memberId);
  };

  const handleDeactivateMember = async (memberId) => {
    await deactivateTeamMember(memberId);
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Manager': 'bg-purple-100 text-purple-800',
      'Developer': 'bg-blue-100 text-blue-800',
      'Designer': 'bg-pink-100 text-pink-800',
      'Analyst': 'bg-yellow-100 text-yellow-800',
      'Tester': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getMemberProjects = (memberId) => {
    return projects.filter(project => 
      project.assignedTo && project.assignedTo.includes(memberId)
    );
  };

  const getAverageProgress = (memberId) => {
    const memberProjects = getMemberProjects(memberId);
    if (memberProjects.length === 0) return 0;
    const totalProgress = memberProjects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(totalProgress / memberProjects.length);
  };

  if (!isCompany && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600">Team management is only available for company managers and admins.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-emerald-600 border-t-transparent rounded-full" />
          <p className="text-gray-600">Loading team members...</p>
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
              Team Members
            </h1>
            <p className="text-gray-600 mt-2">Manage your team and track their progress</p>
          </div>
          <Button onClick={handleAddMember} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-emerald-300">
                <Filter className="w-4 h-4 mr-2" />
                {filterStatus === "all" ? "All Status" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => {
            const memberProjects = getMemberProjects(member.id);
            const averageProgress = getAverageProgress(member.id);
            
            return (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white font-bold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
                        <CardDescription className="text-gray-600">{member.email}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMember(member)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {member.status === 'Active' && (
                          <DropdownMenuItem onClick={() => handleDeactivateMember(member.id)}>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{member.department}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {member.hireDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>KES {member.salary.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Projects</span>
                        </div>
                        <Badge variant="outline">{memberProjects.length}</Badge>
                      </div>
                      
                      {memberProjects.length > 0 && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Average Progress</span>
                            <span>{averageProgress}%</span>
                          </div>
                          <Progress value={averageProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    {memberProjects.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Assigned Projects:</p>
                        <div className="space-y-1">
                          {memberProjects.slice(0, 2).map(project => (
                            <div key={project.id} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                              {project.name} ({project.progress}%)
                            </div>
                          ))}
                          {memberProjects.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{memberProjects.length - 2} more projects
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No members match your search criteria." : "Start building your team by adding members."}
            </p>
            <Button onClick={handleAddMember} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </div>
        )}

        <TeamMemberDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          member={selectedMember}
          onSave={handleSaveMember}
          onDelete={deleteTeamMember}
          onDeactivate={deactivateTeamMember}
        />
      </div>
    </div>
  );
};

export default Users;
