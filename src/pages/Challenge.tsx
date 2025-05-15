
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Challenge as ChallengeType } from '@/services/api';

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submission, setSubmission] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [scoringResult, setScoringResult] = useState<any>(null);
  
  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading } = useQuery({
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
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (challengeLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
            <p className="text-lg text-gray-600">Loading challenge...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Challenge not found</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-blue-100 text-blue-700">{challenge.type}</Badge>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
                  <p className="text-gray-700">{challenge.description}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-2">Your Challenge:</h3>
                  <p className="text-gray-700">{challenge.brief}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label htmlFor="submission" className="font-medium text-gray-900">
                      Your Response:
                    </label>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={wordCount > challenge.word_limit ? 'text-red-500' : ''}>
                        {wordCount}/{challenge.word_limit} words
                      </span>
                    </div>
                  </div>
                  
                  <Textarea
                    id="submission"
                    placeholder="Write your response here..."
                    className="min-h-[150px] text-base"
                    value={submission}
                    onChange={handleTextChange}
                    disabled={submitMutation.isPending}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-brand-400 hover:bg-brand-500"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending || wordCount > challenge.word_limit}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Submit Response'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2" />
                  <span>Estimated time: {challenge.time_estimate}</span>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Keep in mind:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {challenge.guidelines.map((guideline, index) => (
                      <li key={index}>{guideline}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Word limit:</h3>
                  <p className="text-gray-700 text-sm">{challenge.word_limit} words maximum</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={() => setShowHelpDialog(true)}
                >
                  <HelpCircle size={16} className="mr-2" />
                  Need a hint?
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg pb-2">
              Challenge Results
            </DialogTitle>
            <DialogDescription className="text-center">
              <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-lg font-semibold text-brand-500">
                Score: {scoringResult?.score || 0}/100
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Sparkles size={16} className="mr-2 text-brand-400" />
                Strengths
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
                {scoringResult?.feedback?.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">To Improve:</h3>
              <p className="text-gray-700">{scoringResult?.improvement}</p>
            </div>
            
            <div className="bg-brand-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <div className="mr-2 bg-brand-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">+</div>
                XP Gained
              </h3>
              <div className="flex items-center">
                <div className="font-semibold text-brand-500 mr-2">+{scoringResult?.xp_gained} XP</div>
                <Progress 
                  value={((userProfile?.current_xp || 0) / (nextLevel?.required_xp || 1000)) * 100} 
                  className="h-2 flex-1" 
                />
              </div>
              <div className="text-sm text-gray-500 mt-1 text-right">
                {(userProfile?.current_xp || 0) + (scoringResult?.xp_gained || 0)}/{nextLevel?.required_xp || 1000} to {nextLevel?.title || 'Next Level'}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/history')}>
                View History
              </Button>
              <Button className="bg-brand-400 hover:bg-brand-500" onClick={() => navigate('/dashboard')}>
                More Challenges
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Writing Hints</DialogTitle>
            <DialogDescription>
              Here are some tips to help with this challenge.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-gray-700">
              For this {challenge.type} challenge, consider the specific audience and purpose. 
              What action do you want the reader to take?
            </p>
            
            <p className="text-gray-700">
              Some possible approaches:
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Focus on benefits, not just features</li>
              <li>Use clear, concise language</li>
              <li>Create emotional connection</li>
              <li>Include a call to action</li>
            </ul>
            
            {challenge.example_prompt && (
              <p className="text-gray-700 italic">
                "{challenge.example_prompt}"
              </p>
            )}
          </div>
          
          <Button onClick={() => setShowHelpDialog(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Challenge;
