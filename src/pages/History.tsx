
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Submission } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface DetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DetailDialog = ({ submission, open, onOpenChange, onDelete }: DetailDialogProps) => {
  if (!submission) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{submission.challenge?.title || 'Submission Details'}</DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(submission.created_at), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Your Response:</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="whitespace-pre-wrap">{submission.response}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={`${
              submission.score >= 80 
                ? 'bg-green-100 text-green-700'
                : submission.score >= 60 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              Score: {submission.score}/100
            </Badge>
            <Badge className="bg-brand-100 text-brand-600">+{submission.xp_gained} XP</Badge>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Feedback:</h3>
            <ul className="list-disc list-inside space-y-1">
              {submission.feedback.map((item: string, index: number) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">To Improve:</h3>
            <p className="text-gray-700">{submission.improvement_tip}</p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="copywriting">Copywriting</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="uxwriting">UX Writing</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
            <p className="text-lg text-gray-600">Loading submission history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Failed to load submission history.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card 
                key={submission.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => viewSubmission(submission)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{submission.challenge?.title || 'Untitled Challenge'}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700">
                      {submission.challenge?.type || 'Unknown'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(submission.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className={`${
                        submission.score >= 80 
                          ? 'bg-green-100 text-green-700'
                          : submission.score >= 60 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        Score: {submission.score}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-start sm:justify-end">
                      <Badge className="bg-brand-100 text-brand-600">
                        +{submission.xp_gained} XP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-lg text-gray-600 mb-4">You haven't submitted any challenges yet.</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-brand-400 hover:bg-brand-500">
              Start a Challenge
            </Button>
          </div>
        )}
      </main>
      
      <DetailDialog 
        submission={selectedSubmission} 
        open={detailOpen} 
        onOpenChange={setDetailOpen}
        onDelete={handleDeleteClick} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this submission will remove {selectedSubmission?.xp_gained} XP from your total.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default History;
