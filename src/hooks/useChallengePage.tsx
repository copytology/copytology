
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export const useChallengePage = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [submission, setSubmission] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [scoringResult, setScoringResult] = useState<any>(null);
  
  // Fetch user profile data
  const { 
    data: userProfile, 
    isLoading: profileLoading 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile,
  });

  // Fetch challenge data
  const { 
    data: challenge, 
    isLoading: challengeLoading,
    error: challengeError 
  } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => api.getChallenge(id as string),
    enabled: !!id,
  });

  // Next level data
  const { data: nextLevel } = useQuery({
    queryKey: ['nextLevel', userProfile?.level_id],
    queryFn: () => api.getNextLevel(userProfile?.level_id || 1),
    enabled: !!userProfile,
  });
  
  // Submit challenge mutation
  const submitMutation = useMutation({
    mutationFn: () => api.submitChallenge(id as string, submission),
    onSuccess: (data) => {
      setScoringResult(data.result);
      setShowResults(true);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userChallenges'] });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  useEffect(() => {
    if (challengeError) {
      toast({
        title: "Error loading challenge",
        description: "Challenge could not be loaded. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [challengeError, toast, navigate]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSubmission(text);
    
    // Count words
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() === '' ? 0 : words.length);
  };
  
  const handleSubmit = () => {
    if (submission.trim().length === 0) {
      toast({
        title: "Empty submission",
        description: "Please write a response before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    submitMutation.mutate();
  };
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
    userProfile,
    challenge,
    nextLevel,
    submission,
    wordCount,
    showResults,
    showHelpDialog,
    scoringResult,
    isLoading: challengeLoading || profileLoading,
    isPending: submitMutation.isPending,
    handleTextChange,
    handleSubmit,
    handleGoBack,
    setShowResults,
    setShowHelpDialog,
  };
};
