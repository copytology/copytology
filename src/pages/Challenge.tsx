
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, HelpCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock challenge data
const mockChallengeData = {
  1: {
    id: 1,
    type: 'copywriting',
    title: 'Write a Compelling Email Subject Line',
    description: 'Email subject lines are critical for open rates. The best subject lines are clear, create urgency, and generate curiosity without being clickbait.',
    brief: 'Create a subject line for a tech company launching a new productivity app feature that automatically organizes your calendar based on priorities.',
    difficulty: 'Medium',
    timeEstimate: '10 min',
    guidelines: [
      'Keep it under 50 characters',
      'Create a sense of value or benefit',
      'Avoid spam trigger words like "free" or "guarantee"',
      'Consider using personalization or curiosity'
    ],
    examplePrompt: 'What are some effective email subject line templates?',
    wordLimit: 75
  }
};

const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  // Mock user data
  const userData = {
    level: 'Associate',
    currentXp: 5350
  };

  // Mock challenge results
  const mockResults = {
    score: 87,
    feedback: [
      'Excellent use of curiosity to drive interest',
      'Good length for email subject',
      'Clear value proposition',
      'Could improve by adding more urgency'
    ],
    improvement: 'Try incorporating words that create time sensitivity to increase open rates, such as "now," "today," or "introducing."',
    xpGained: 150
  };
  
  const challenge = mockChallengeData[Number(id) as keyof typeof mockChallengeData];
  
  if (!challenge) {
    return <div>Challenge not found</div>;
  }
  
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
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResults(true);
    }, 2000);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} currentXp={userData.currentXp} level={userData.level} />
      
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
                  <Badge className="bg-blue-100 text-blue-700">Copywriting</Badge>
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
                      <span className={wordCount > challenge.wordLimit ? 'text-red-500' : ''}>
                        {wordCount}/{challenge.wordLimit} words
                      </span>
                    </div>
                  </div>
                  
                  <Textarea
                    id="submission"
                    placeholder="Write your response here..."
                    className="min-h-[150px] text-base"
                    value={submission}
                    onChange={handleTextChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-brand-400 hover:bg-brand-500"
                  onClick={handleSubmit}
                  disabled={isSubmitting || wordCount > challenge.wordLimit}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
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
                  <span>Estimated time: {challenge.timeEstimate}</span>
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
                  <p className="text-gray-700 text-sm">{challenge.wordLimit} words maximum</p>
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
                Score: {mockResults.score}/100
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
                {mockResults.feedback.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">To Improve:</h3>
              <p className="text-gray-700">{mockResults.improvement}</p>
            </div>
            
            <div className="bg-brand-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <div className="mr-2 bg-brand-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">+</div>
                XP Gained
              </h3>
              <div className="flex items-center">
                <div className="font-semibold text-brand-500 mr-2">+{mockResults.xpGained} XP</div>
                <Progress value={(userData.currentXp / 10000) * 100} className="h-2 flex-1" />
              </div>
              <div className="text-sm text-gray-500 mt-1 text-right">
                {userData.currentXp + mockResults.xpGained}/10000 to Senior Associate
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
              Email subject lines should be concise and compelling. For this productivity app feature,
              consider focusing on the benefit to the user - how will automatic calendar organization
              make their life better?
            </p>
            
            <p className="text-gray-700">
              Some possible approaches:
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Focus on time savings</li>
              <li>Highlight reduced stress</li>
              <li>Emphasize increased productivity</li>
              <li>Create curiosity about the new feature</li>
            </ul>
            
            <p className="text-gray-700 italic">
              Sample prompt: "{challenge.examplePrompt}"
            </p>
          </div>
          
          <Button onClick={() => setShowHelpDialog(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Challenge;
