
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, CreditCard, AlertTriangle, TrendingUp, Plus, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";

const AdminDashboard = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    plan: "starter",
    industry: ""
  });

  const [companies, setCompanies] = useState([
    {
      id: "1",
      name: "Acme Corporation",
      email: "admin@acme.com",
      plan: "Pro",
      status: "Active",
      users: 45,
      projects: 12,
      revenue: 2500,
      joinDate: "2024-01-15",
      industry: "Technology"
    },
    {
      id: "2",
      name: "TechStart Solutions",
      email: "contact@techstart.com",
      plan: "Starter",
      status: "Active",
      users: 8,
      projects: 3,
      revenue: 299,
      joinDate: "2024-03-20",
      industry: "Software"
    },
    {
      id: "3",
      name: "Global Dynamics",
      email: "info@globaldyn.com",
      plan: "Enterprise",
      status: "Trial",
      users: 120,
      projects: 25,
      revenue: 0,
      joinDate: "2024-05-10",
      industry: "Consulting"
    }
  ]);

  const stats = [
    { title: "Total Companies", value: "156", icon: Building2, change: "+12 this month", color: "bg-emerald-50 text-emerald-600" },
    { title: "Active Users", value: "2,847", icon: Users, change: "+184 this week", color: "bg-blue-50 text-blue-600" },
    { title: "Monthly Revenue", value: "KES 2.4M", icon: CreditCard, change: "+15% from last month", color: "bg-amber-50 text-amber-600" },
    { title: "Support Tickets", value: "23", icon: AlertTriangle, change: "-8 from yesterday", color: "bg-red-50 text-red-600" }
  ];

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.email) {
      const company = {
        id: String(companies.length + 1),
        name: newCompany.name,
        email: newCompany.email,
        plan: newCompany.plan,
        status: "Trial",
        users: 1,
        projects: 0,
        revenue: 0,
        joinDate: new Date().toISOString().split('T')[0],
        industry: newCompany.industry
      };
      
      setCompanies([...companies, company]);
      setNewCompany({ name: "", email: "", plan: "starter", industry: "" });
      setIsAddCompanyOpen(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-green-100 text-green-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">System overview and company management</p>
            </div>
            <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-emerald-700">Onboard New Company</DialogTitle>
                  <DialogDescription>
                    Add a new company to the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyEmail">Admin Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plan">Initial Plan</Label>
                    <Select value={newCompany.plan} onValueChange={(value) => setNewCompany({...newCompany, plan: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                      placeholder="Technology"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddCompanyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompany} className="bg-emerald-600 hover:bg-emerald-700">
                    Add Company
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in bg-white/70 backdrop-blur-sm" style={{animationDelay: `${index * 100}ms`}}>
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-emerald-200 focus:border-emerald-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Companies Table */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
            <CardTitle className="text-2xl text-emerald-700">Companies</CardTitle>
            <CardDescription>Manage all companies on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-emerald-100">
              {filteredCompanies.map((company, index) => (
                <div key={company.id} className="p-6 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg hover:text-emerald-600 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-gray-600">{company.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Badge className={getPlanColor(company.plan)}>
                            {company.plan}
                          </Badge>
                          <Badge className={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </div>
                        <span>{company.users} users</span>
                        <span>{company.projects} projects</span>
                        <span>{company.industry}</span>
                        <span>Joined {company.joinDate}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        KES {company.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Monthly Revenue</div>
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

export default AdminDashboard;
