import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'verified' | 'in-progress' | 'resolved';
  image: string;
  location: string;
  upvotes: number;
  reportedDate: string;
  estimatedResolution?: string;
}

interface IssueContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'reportedDate' | 'upvotes'>) => void;
  updateIssueStatus: (id: string, status: Issue['status']) => void;
  upvoteIssue: (id: string) => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

const STORAGE_KEY = 'civicConnect_issues';

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);

  // Load issues from localStorage on mount
  useEffect(() => {
    const savedIssues = localStorage.getItem(STORAGE_KEY);
    if (savedIssues) {
      try {
        const parsedIssues = JSON.parse(savedIssues);
        // Sort by reportedDate descending (most recent first)
        const sortedIssues = parsedIssues.sort((a: Issue, b: Issue) => 
          new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
        );
        setIssues(sortedIssues);
      } catch (error) {
        console.error('Error loading issues from localStorage:', error);
        // Initialize with default issues if localStorage is corrupted
        initializeDefaultIssues();
      }
    } else {
      // Initialize with default issues if no localStorage data
      initializeDefaultIssues();
    }
  }, []);

  // Save to localStorage whenever issues change
  useEffect(() => {
    if (issues.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    }
  }, [issues]);

  const initializeDefaultIssues = () => {
    const defaultIssues: Issue[] = [
      {
        id: '1',
        title: 'Broken Street Light',
        description: 'Street light has been flickering for weeks and now completely stopped working.',
        category: 'Street Lighting',
        status: 'verified',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBsaWdodCUyMGJyb2tlbnxlbnwxfHx8fDE3NTczOTQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        location: 'MG Road, Bangalore',
        upvotes: 23,
        reportedDate: '2024-01-15',
        estimatedResolution: '5-7 days'
      },
      {
        id: '2',
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues and vehicle damage.',
        category: 'Road Infrastructure',
        status: 'in-progress',
        image: 'https://images.unsplash.com/photo-1591080954453-2936efa54c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHJlZXQlMjBwb3Rob2xlJTIwcm9hZHxlbnwxfHx8fDE3NTczOTQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        location: 'Brigade Road, Bangalore',
        upvotes: 45,
        reportedDate: '2024-01-10',
        estimatedResolution: '3-5 days'
      }
    ];

    // Sort default issues by date (most recent first)
    const sortedDefaultIssues = defaultIssues.sort((a, b) => 
      new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
    );

    setIssues(sortedDefaultIssues);
  };

  const addIssue = (newIssue: Omit<Issue, 'id' | 'reportedDate' | 'upvotes'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      reportedDate: new Date().toISOString().split('T')[0],
      upvotes: 0
    };
    
    // Add new issue at the beginning (most recent first)
    setIssues(prev => [issue, ...prev]);
  };

  const updateIssueStatus = (id: string, status: Issue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status } : issue
    ));
  };

  const upvoteIssue = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus, upvoteIssue }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}