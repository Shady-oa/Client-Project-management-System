
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold';
  progress: number;
  team: TeamMember[];
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  client: string;
  clientId?: string;
  companyId: string;
  budget: number;
  spent: number;
  phase: string;
  nextMilestone: string;
  lastUpdate: string;
  createdBy: string;
  assignedTo: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  projects: string[];
  status: 'Active' | 'Inactive';
}

export interface Issue {
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

interface ProjectContextType {
  projects: Project[];
  issues: Issue[];
  teamMembers: TeamMember[];
  loading: boolean;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addIssue: (issue: Omit<Issue, 'id'>) => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => Promise<void>;
  assignProjectToTeam: (projectId: string, memberIds: string[]) => Promise<void>;
  getProjectsByRole: () => Project[];
  getIssuesByRole: () => Issue[];
  getTeamMembersByRole: () => TeamMember[];
  fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user, isAdmin, isCompany, isClient } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        status: project.status as Project['status'],
        progress: project.progress,
        team: [],
        dueDate: project.due_date || '',
        priority: project.priority as Project['priority'],
        client: project.client,
        clientId: project.client_id || undefined,
        companyId: project.company_id,
        budget: Number(project.budget) || 0,
        spent: Number(project.spent) || 0,
        phase: project.phase || '',
        nextMilestone: project.next_milestone || '',
        lastUpdate: new Date(project.updated_at).toISOString().split('T')[0],
        createdBy: project.created_by || '',
        assignedTo: project.assigned_to || []
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMembers: TeamMember[] = data.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar || member.name.split(' ').map(n => n[0]).join(''),
        projects: member.projects || [],
        status: member.status as TeamMember['status']
      }));

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    }
  };

  const fetchIssues = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

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

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTeamMembers();
      fetchIssues();
    }
  }, [user]);

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          status: project.status,
          progress: project.progress,
          due_date: project.dueDate || null,
          priority: project.priority,
          client: project.client,
          client_id: project.clientId || null,
          company_id: project.companyId,
          budget: project.budget,
          spent: project.spent || 0,
          phase: project.phase || null,
          next_milestone: project.nextMilestone || null,
          created_by: user.id,
          assigned_to: project.assignedTo || []
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProjects();
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          progress: updates.progress,
          due_date: updates.dueDate,
          priority: updates.priority,
          client: updates.client,
          budget: updates.budget,
          spent: updates.spent,
          phase: updates.phase,
          next_milestone: updates.nextMilestone,
          assigned_to: updates.assignedTo,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await fetchProjects();
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const addIssue = async (issue: Omit<Issue, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          project_id: issue.projectId,
          assigned_to: issue.assignedTo || null,
          created_by: user.id,
          labels: issue.labels || []
        });

      if (error) throw error;

      await fetchIssues();
      toast.success('Issue created successfully');
    } catch (error) {
      console.error('Error adding issue:', error);
      toast.error('Failed to create issue');
    }
  };

  const updateIssue = async (issueId: string, updates: Partial<Issue>) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          assigned_to: updates.assignedTo,
          labels: updates.labels,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId);

      if (error) throw error;

      await fetchIssues();
      toast.success('Issue updated successfully');
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue');
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

  const assignProjectToTeam = async (projectId: string, memberIds: string[]) => {
    try {
      await updateProject(projectId, { assignedTo: memberIds });
      
      // Update team member project lists
      for (const memberId of memberIds) {
        const member = teamMembers.find(m => m.id === memberId);
        if (member) {
          const updatedProjects = [...new Set([...member.projects, projectId])];
          await updateTeamMember(memberId, { projects: updatedProjects });
        }
      }
    } catch (error) {
      console.error('Error assigning project to team:', error);
      toast.error('Failed to assign project to team');
    }
  };

  const getProjectsByRole = (): Project[] => {
    if (isAdmin) {
      return projects;
    } else if (isCompany) {
      return projects.filter(project => project.companyId === user?.companyId);
    } else if (isClient) {
      return projects.filter(project => project.clientId === user?.id);
    }
    return [];
  };

  const getIssuesByRole = (): Issue[] => {
    const userProjects = getProjectsByRole();
    const projectIds = userProjects.map(p => p.id);
    
    if (isAdmin) {
      return issues;
    } else if (isCompany) {
      return issues.filter(issue => projectIds.includes(issue.projectId));
    } else if (isClient) {
      return issues.filter(issue => 
        projectIds.includes(issue.projectId) || issue.createdBy === user?.id
      );
    }
    return [];
  };

  const getTeamMembersByRole = (): TeamMember[] => {
    if (isAdmin) {
      return teamMembers;
    } else if (isCompany) {
      return teamMembers;
    } else if (isClient) {
      const userProjects = getProjectsByRole();
      const assignedMemberIds = userProjects.flatMap(p => p.assignedTo);
      return teamMembers.filter(member => assignedMemberIds.includes(member.id));
    }
    return [];
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        issues,
        teamMembers,
        loading,
        updateProject,
        addProject,
        deleteProject,
        addIssue,
        updateIssue,
        addTeamMember,
        updateTeamMember,
        assignProjectToTeam,
        getProjectsByRole,
        getIssuesByRole,
        getTeamMembersByRole,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
