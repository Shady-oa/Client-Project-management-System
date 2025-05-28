
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';

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
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (projectId: string) => void;
  addIssue: (issue: Omit<Issue, 'id'>) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  assignProjectToTeam: (projectId: string, memberIds: string[]) => void;
  getProjectsByRole: () => Project[];
  getIssuesByRole: () => Issue[];
  getTeamMembersByRole: () => TeamMember[];
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

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform Redesign',
      description: 'Complete overhaul of company website with modern design and improved user experience',
      status: 'In Progress',
      progress: 75,
      team: [],
      dueDate: '2024-07-15',
      priority: 'High',
      client: 'RetailMax Corp',
      clientId: 'client-1',
      companyId: 'acme-corp',
      budget: 850000,
      spent: 637500,
      phase: 'Development',
      nextMilestone: 'Beta Testing',
      lastUpdate: '2024-05-30',
      createdBy: 'company-user-1',
      assignedTo: ['team-1', 'team-2', 'team-3']
    },
    {
      id: '2',
      name: 'Mobile Banking App',
      description: 'iOS and Android application for customer engagement',
      status: 'Testing',
      progress: 90,
      team: [],
      dueDate: '2024-06-20',
      priority: 'Critical',
      client: 'SecureBank Ltd',
      clientId: 'client-2',
      companyId: 'acme-corp',
      budget: 1200000,
      spent: 1080000,
      phase: 'Quality Assurance',
      nextMilestone: 'App Store Submission',
      lastUpdate: '2024-05-29',
      createdBy: 'company-user-1',
      assignedTo: ['team-1', 'team-4']
    }
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Login button not working on mobile',
      description: 'Users cannot login using mobile devices due to button responsiveness issue',
      status: 'Open',
      priority: 'High',
      projectId: '1',
      assignedTo: 'team-1',
      createdBy: 'client-1',
      createdAt: '2024-05-30',
      updatedAt: '2024-05-30',
      labels: ['bug', 'mobile', 'urgent']
    },
    {
      id: '2',
      title: 'Performance optimization needed',
      description: 'App loading time is slower than expected on older devices',
      status: 'In Progress',
      priority: 'Medium',
      projectId: '2',
      assignedTo: 'team-4',
      createdBy: 'client-2',
      createdAt: '2024-05-28',
      updatedAt: '2024-05-29',
      labels: ['performance', 'optimization']
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'team-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'Project Manager',
      avatar: 'SC',
      projects: ['1', '2'],
      status: 'Active'
    },
    {
      id: 'team-2',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Full Stack Developer',
      avatar: 'MJ',
      projects: ['1'],
      status: 'Active'
    },
    {
      id: 'team-3',
      name: 'Emma Davis',
      email: 'emma.davis@company.com',
      role: 'UI/UX Designer',
      avatar: 'ED',
      projects: ['1'],
      status: 'Active'
    },
    {
      id: 'team-4',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      role: 'Backend Developer',
      avatar: 'AR',
      projects: ['2'],
      status: 'Active'
    }
  ]);

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, lastUpdate: new Date().toISOString().split('T')[0] }
        : project
    ));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      companyId: user?.companyId || 'default-company',
      createdBy: user?.id || 'unknown',
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    setIssues(prev => prev.filter(issue => issue.projectId !== projectId));
  };

  const addIssue = (issue: Omit<Issue, 'id'>) => {
    const newIssue: Issue = {
      ...issue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIssues(prev => [...prev, newIssue]);
  };

  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
        : issue
    ));
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (memberId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  const assignProjectToTeam = (projectId: string, memberIds: string[]) => {
    // Update project assignments
    updateProject(projectId, { assignedTo: memberIds });
    
    // Update team member project lists
    setTeamMembers(prev => prev.map(member => ({
      ...member,
      projects: memberIds.includes(member.id) 
        ? [...new Set([...member.projects, projectId])]
        : member.projects.filter(id => id !== projectId)
    })));
  };

  const getProjectsByRole = (): Project[] => {
    if (isAdmin) {
      return projects; // Admin sees all projects
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
      return issues; // Admin sees all issues
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
      return teamMembers; // Admin sees all team members
    } else if (isCompany) {
      return teamMembers; // Company sees their team members
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
