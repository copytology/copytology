
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import ChallengeInstructions from '@/components/challenge/ChallengeInstructions';
import HelpDialog from '@/components/challenge/HelpDialog';
import ResultsDialog from '@/components/challenge/ResultsDialog';
import { useChallengePage } from '@/hooks/useChallengePage';

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const {
    userProfile,
    challenge,
    nextLevel,
    submission,
    wordCount,
    showResults,
    showHelpDialog,
    scoringResult,
    isLoading,
    isPending,
    handleTextChange,
    handleSubmit,
    handleGoBack,
    setShowResults,
    setShowHelpDialog,
  } = useChallengePage(id);

  if (isLoading) {
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
            <Button className="mt-4" onClick={() => useNavigate()('/dashboard')}>
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
            <ChallengeDetail
              challenge={challenge}
              submission={submission}
              wordCount={wordCount}
              isSubmitting={isPending}
              onSubmissionChange={handleTextChange}
              onSubmit={handleSubmit}
            />
          </div>
          
          <div className="space-y-6">
            <ChallengeInstructions 
              challenge={challenge}
              onHelpClick={() => setShowHelpDialog(true)}
            />
          </div>
        </div>
      </main>
      
      <ResultsDialog
        open={showResults}
        onClose={() => setShowResults(false)}
        scoringResult={scoringResult}
        userProfile={userProfile}
        nextLevel={nextLevel}
      />
      
      <HelpDialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        challenge={challenge}
      />
      
      <Footer />
    </div>
  );
};

export default Challenge;
