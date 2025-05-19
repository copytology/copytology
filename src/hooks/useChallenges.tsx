
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Challenge } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const CARDS_PER_CATEGORY = 6;

export const useChallenges = (activeTab: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  // Fetch user challenges
  const { 
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError
  } = useQuery({
    queryKey: ['userChallenges', language],
    queryFn: () => api.getUserChallenges(language),
    retry: 1
  });

  // Refresh challenges mutation
  const refreshMutation = useMutation({
    mutationFn: () => api.refreshChallenges(language),
    onSuccess: () => {
      toast({
        title: t('dashboard.title'),
        description: "New challenges are now available.",
      });
      // Refresh challenges data
      queryClient.invalidateQueries({ queryKey: ['userChallenges', language] });
    },
    onError: (error) => {
      toast({
        title: "Failed to refresh challenges",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    }
  });

  // Check if we need to generate more challenges
  useEffect(() => {
    if (!challengesLoading && challenges) {
      const challengesByType = {
        copywriting: challenges.filter(c => c.type === 'copywriting'),
        content: challenges.filter(c => c.type === 'content'),
        uxwriting: challenges.filter(c => c.type === 'uxwriting')
      };
      
      const needsRefresh = Object.values(challengesByType).some(
        typeArray => typeArray.length < CARDS_PER_CATEGORY
      );
      
      if (needsRefresh) {
        refreshMutation.mutate();
      }
    }
  }, [challenges, challengesLoading]);

  // Filter challenges based on active tab and limit to 6 per type
  const filteredChallenges = (() => {
    if (!challenges) return [];
    
    if (activeTab === 'all') {
      // Get 6 challenges of each type for the "All" tab
      const copywritingChallenges = challenges.filter(c => c.type === 'copywriting').slice(0, CARDS_PER_CATEGORY);
      const contentChallenges = challenges.filter(c => c.type === 'content').slice(0, CARDS_PER_CATEGORY);
      const uxwritingChallenges = challenges.filter(c => c.type === 'uxwriting').slice(0, CARDS_PER_CATEGORY);
      
      return [...copywritingChallenges, ...contentChallenges, ...uxwritingChallenges];
    }
    
    // For specific tabs, limit to 6 challenges
    return challenges.filter(challenge => challenge.type === activeTab).slice(0, CARDS_PER_CATEGORY);
  })();

  const handleRefreshChallenges = () => {
    refreshMutation.mutate();
  };

  return {
    challenges: filteredChallenges,
    isLoading: challengesLoading,
    error: challengesError,
    isPending: refreshMutation.isPending,
    handleRefreshChallenges
  };
};
