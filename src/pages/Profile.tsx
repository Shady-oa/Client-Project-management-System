
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Building2, Calendar, Shield, Save, Edit } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAdmin, isCompany, isClient } = useUser();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    role: ""
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company_name: user.companyName || "",
        role: user.role || ""
      });
    }
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) return { label: "System Admin", color: "bg-red-100 text-red-800" };
    if (isCompany) return { label: "Company Manager", color: "bg-blue-100 text-blue-800" };
    if (isClient) return { label: "Client User", color: "bg-green-100 text-green-800" };
    return { label: "User", color: "bg-gray-100 text-gray-800" };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-2xl font-bold">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl text-emerald-700">{profile.full_name || 'User'}</CardTitle>
                <CardDescription className="text-gray-600">{profile.email}</CardDescription>
                <Badge className={`mt-2 ${roleBadge.color}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {roleBadge.label}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.company_name && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{profile.company_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-emerald-700">Account Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => editing ? updateProfile() : setEditing(true)}
                    disabled={loading}
                    className="border-emerald-300 hover:bg-emerald-50"
                  >
                    {editing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                          disabled={!editing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="mt-1 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="mt-1 relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!editing}
                          className="pl-10"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                        Company Name
                      </Label>
                      <div className="mt-1 relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="company_name"
                          value={profile.company_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                          disabled={!editing}
                          className="pl-10"
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                        Role
                      </Label>
                      <div className="mt-1 relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="role"
                          value={profile.role}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-3 pt-4 border-t border-emerald-100">
                      <Button
                        onClick={updateProfile}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditing(false)}
                        disabled={loading}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
