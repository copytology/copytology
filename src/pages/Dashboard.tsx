
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const CARDS_PER_CATEGORY = 6;

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const { t, language } = useLanguage();

  // Fetch user profile
  const { 
    data: userProfile,
    isLoading: profileLoading
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile
  });

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

  // Filter challenges based on active tab and limit to 6 per type
  const filteredChallenges = React.useMemo(() => {
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
  }, [challenges, activeTab]);

  const handleRefreshChallenges = () => {
    refreshMutation.mutate();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <Button 
            onClick={handleRefreshChallenges} 
            disabled={refreshMutation.isPending}
            className="bg-brand-400 hover:bg-brand-500 text-white"
          >
            {refreshMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('dashboard.generating')}
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                {t('dashboard.refresh')}
              </>
            )}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">{t('dashboard.all')}</TabsTrigger>
            <TabsTrigger value="copywriting">{t('dashboard.copywriting')}</TabsTrigger>
            <TabsTrigger value="content">{t('dashboard.content')}</TabsTrigger>
            <TabsTrigger value="uxwriting">{t('dashboard.uxwriting')}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {(challengesLoading || profileLoading) ? (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
            <p className="text-lg text-gray-600">{t('dashboard.loading')}</p>
          </div>
        ) : challengesError ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">{t('dashboard.error')}</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['userChallenges', language] })}
              className="mt-4"
            >
              {t('dashboard.try.again')}
            </Button>
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-blue-100 text-blue-700">{t(`dashboard.${challenge.type}`)}</Badge>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3">{challenge.description}</p>
                  <div className="flex items-center mt-4 text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{challenge.time_estimate}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                  >
                    {t('dashboard.start.challenge')}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-lg text-gray-600 mb-4">{t('dashboard.no.challenges')}</p>
            <Button onClick={handleRefreshChallenges} className="bg-brand-400 hover:bg-brand-500 text-white">
              {refreshMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('dashboard.generating')}
                </>
              ) : (
                t('dashboard.generate.new')
              )}
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
