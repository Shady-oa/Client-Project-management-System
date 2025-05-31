
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  projects: string[];
  status: 'Active' | 'Inactive';
  department: string;
  phone?: string;
  hireDate: string;
  salary: number;
  permissions: string[];
  userId?: string;
}

export const useTeamMembers = () => {
  const { user, isAdmin, isCompany } = useUser();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeamMembers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase.from('team_members').select('*');
      
      if (isCompany && user.companyId) {
        query = query.eq('company_id', user.companyId);
      }
      // Admin sees all team members
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMembers: TeamMember[] = data.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar || member.name.split(' ').map(n => n[0]).join(''),
        projects: member.projects || [],
        status: member.status as TeamMember['status'],
        department: member.department || 'Engineering',
        phone: member.phone || '',
        hireDate: member.hire_date || new Date().toISOString().split('T')[0],
        salary: Number(member.salary) || 0,
        permissions: member.permissions || [],
        userId: member.user_id || undefined
      }));

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          email: member.email,
          role: member.role,
          avatar: member.avatar,
          projects: member.projects || [],
          status: member.status,
          department: member.department,
          phone: member.phone,
          hire_date: member.hireDate,
          salary: member.salary,
          permissions: member.permissions,
          company_id: user.companyId || ''
        });

      if (error) throw error;

      await fetchTeamMembers();
      toast.success('Team member added successfully');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<TeamMember>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          name: updates.name,
          email: updates.email,
          role: updates.role,
          avatar: updates.avatar,
          projects: updates.projects,
          status: updates.status,
          department: updates.department,
          phone: updates.phone,
          salary: updates.salary,
          permissions: updates.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId);

      if (error) throw error;

      await fetchTeamMembers();
      toast.success('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      await fetchTeamMembers();
      toast.success('Team member deleted successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const deactivateTeamMember = async (memberId: string) => {
    await updateTeamMember(memberId, { status: 'Inactive' });
  };

  useEffect(() => {
    if (user && (isAdmin || isCompany)) {
      fetchTeamMembers();
    }
  }, [user, isAdmin, isCompany]);

  return {
    teamMembers,
    loading,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    deactivateTeamMember
  };
};
