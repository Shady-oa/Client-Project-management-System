
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Users, User, Shield, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Developer",
    department: ""
  });

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "Admin",
      status: "Active",
      department: "Engineering",
      joinDate: "2023-01-15",
      lastLogin: "2024-05-30",
      projects: 5,
      avatar: "/avatars/sarah.jpg",
      initials: "SC"
    },
    {
      id: "2",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Project Manager",
      status: "Active",
      department: "Operations",
      joinDate: "2023-03-20",
      lastLogin: "2024-05-29",
      projects: 8,
      avatar: "/avatars/mike.jpg",
      initials: "MJ"
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma.davis@company.com",
      role: "Designer",
      status: "Active",
      department: "Design",
      joinDate: "2023-02-10",
      lastLogin: "2024-05-30",
      projects: 4,
      avatar: "/avatars/emma.jpg",
      initials: "ED"
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@company.com",
      role: "Developer",
      status: "Active",
      department: "Engineering",
      joinDate: "2023-06-01",
      lastLogin: "2024-05-28",
      projects: 6,
      avatar: "/avatars/alex.jpg",
      initials: "AR"
    },
    {
      id: "5",
      name: "Tom Wilson",
      email: "tom.wilson@company.com",
      role: "Developer",
      status: "Inactive",
      department: "Engineering",
      joinDate: "2022-11-15",
      lastLogin: "2024-05-20",
      projects: 2,
      avatar: "/avatars/tom.jpg",
      initials: "TW"
    },
    {
      id: "6",
      name: "Lisa Brown",
      email: "lisa.brown@company.com",
      role: "Client",
      status: "Active",
      department: "External",
      joinDate: "2024-01-10",
      lastLogin: "2024-05-29",
      projects: 1,
      avatar: "/avatars/lisa.jpg",
      initials: "LB"
    }
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Shield className="w-4 h-4 text-red-500" />;
      case "Project Manager": return <Users className="w-4 h-4 text-blue-500" />;
      case "Developer": return <User className="w-4 h-4 text-green-500" />;
      case "Designer": return <User className="w-4 h-4 text-purple-500" />;
      case "Client": return <User className="w-4 h-4 text-orange-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Project Manager": return "bg-blue-100 text-blue-800";
      case "Developer": return "bg-green-100 text-green-800";
      case "Designer": return "bg-purple-100 text-purple-800";
      case "Client": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || 
                       user.role.toLowerCase().replace(" ", "-") === roleFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === "Active").length;
    const adminUsers = users.filter(user => user.role === "Admin").length;
    const clientUsers = users.filter(user => user.role === "Client").length;
    
    return { totalUsers, activeUsers, adminUsers, clientUsers };
  };

  const stats = getStats();

  const handleInviteUser = () => {
    if (newUser.firstName && newUser.lastName && newUser.email) {
      const user = {
        id: String(users.length + 1),
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
        status: "Pending",
        department: newUser.department || "Engineering",
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: "Never",
        projects: 0,
        avatar: "",
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`
      };
      
      setUsers([...users, user]);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        role: "Developer",
        department: ""
      });
      setIsInviteOpen(false);
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case "edit":
        alert(`Edit user ${userId}`);
        break;
      case "changeRole":
        alert(`Change role for user ${userId}`);
        break;
      case "viewProjects":
        alert(`View projects for user ${userId}`);
        break;
      case "toggleStatus":
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
            : user
        ));
        break;
    }
  };

  const statsData = [
    { title: "Total Users", value: stats.totalUsers.toString(), icon: Users, change: "+5 this month" },
    { title: "Active Users", value: stats.activeUsers.toString(), icon: User, change: "+2 this week" },
    { title: "Admin Users", value: stats.adminUsers.toString(), icon: Shield, change: "No change" },
    { title: "Client Users", value: stats.clientUsers.toString(), icon: Mail, change: "+3 this month" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage team members and client access</p>
            </div>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Send an invitation to a new team member or client
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                        placeholder="John"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Designer">Designer</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="Engineering"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Send Invitation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <Card key={index} className="border-gray-200 shadow-sm">
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="project-manager">Project Manager</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white">
            <CardTitle className="text-xl text-gray-900">Team Members</CardTitle>
            <CardDescription>Manage user access and permissions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <span>{user.department}</span>
                          <span>{user.projects} projects</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Joined {user.joinDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-500">
                        <div>Last login</div>
                        <div>{user.lastLogin}</div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "edit")}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "changeRole")}>
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "viewProjects")}>
                            View Projects
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleUserAction(user.id, "toggleStatus")}
                          >
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default UsersPage;
