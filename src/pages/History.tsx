
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Submission } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import HistoryTabs from '@/components/history/HistoryTabs';
import SubmissionsList from '@/components/history/SubmissionsList';
import SubmissionDetails from '@/components/history/SubmissionDetails';
import DeleteConfirmation from '@/components/history/DeleteConfirmation';

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile
  });
  
  const { 
    data: submissions, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['submissions'],
    queryFn: api.getUserSubmissions,
    meta: {
      onError: (err: Error) => {
        toast({
          title: "Error loading submissions",
          description: err.message || "Please try again later",
          variant: "destructive"
        });
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, xp }: { id: string, xp: number }) => api.deleteSubmission(id, xp),
    onSuccess: () => {
      toast({
        title: "Submission deleted",
        description: "Your submission has been deleted and XP has been adjusted.",
      });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setDetailOpen(false);
      setDeleteDialogOpen(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Error deleting submission",
        description: err.message || "Please try again later",
        variant: "destructive"
      });
    }
  });

  const filteredSubmissions = submissions?.filter(submission => {
    if (activeTab === 'all') return true;
    return submission.challenge?.type === activeTab;
  }) || [];
  
  const viewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDetailOpen(true);
  };

  const handleDeleteClick = () => {
    if (selectedSubmission) {
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedSubmission) {
      deleteMutation.mutate({ 
        id: selectedSubmission.id, 
        xp: selectedSubmission.xp_gained 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        isLoggedIn={true} 
        currentXp={userProfile?.current_xp} 
        level={userProfile?.levels?.title} 
      />
      
      <main className="flex-1 container py-8">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Your Submission History</h1>
        
        <HistoryTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <SubmissionsList 
          isLoading={isLoading} 
          error={error as Error | null} 
          filteredSubmissions={filteredSubmissions} 
          onViewSubmission={viewSubmission} 
        />
      </main>
      
      <SubmissionDetails 
        submission={selectedSubmission} 
        open={detailOpen} 
        onOpenChange={setDetailOpen}
        onDelete={handleDeleteClick} 
      />

      <DeleteConfirmation 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        xpToSubtract={selectedSubmission?.xp_gained}
        isDeleting={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
      
      <Footer />
    </div>
  );
};

export default History;
