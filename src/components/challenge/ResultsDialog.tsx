
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { UserProfile } from '@/services/api';

interface ResultsDialogProps {
  open: boolean;
  onClose: () => void;
  scoringResult: any;
  userProfile?: UserProfile;
  nextLevel?: {
    title: string;
    required_xp: number;
  };
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({ 
  open, 
  onClose, 
  scoringResult, 
  userProfile, 
  nextLevel 
}) => {
  const navigate = useNavigate();
  
  if (!scoringResult) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg pb-2">
            Challenge Results
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-lg font-semibold text-brand-500">
              Score: {scoringResult.score || 0}/100
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
              {scoringResult.feedback?.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">To Improve:</h3>
            <p className="text-gray-700">{scoringResult.improvement}</p>
          </div>
          
          <div className="bg-brand-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <div className="mr-2 bg-brand-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">+</div>
              XP Gained
            </h3>
            <div className="flex items-center">
              <div className="font-semibold text-brand-500 mr-2">+{scoringResult.xp_gained} XP</div>
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
  );
};

export default ResultsDialog;
