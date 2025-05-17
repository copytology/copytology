
import React from 'react';
import { Submission } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface SubmissionDetailsProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ 
  submission, 
  open, 
  onOpenChange, 
  onDelete 
}) => {
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

export default SubmissionDetails;
