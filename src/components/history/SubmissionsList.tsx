
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Submission } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SubmissionsListProps {
  isLoading: boolean;
  error: Error | null;
  filteredSubmissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ 
  isLoading, 
  error, 
  filteredSubmissions, 
  onViewSubmission 
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
        <p className="text-lg text-gray-600">Loading submission history...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Failed to load submission history.</p>
        <Button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-lg text-gray-600 mb-4">You haven't submitted any challenges yet.</p>
        <Button onClick={() => navigate('/dashboard')} className="bg-brand-400 hover:bg-brand-500">
          Start a Challenge
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredSubmissions.map((submission) => (
        <Card 
          key={submission.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewSubmission(submission)}
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
  );
};

export default SubmissionsList;
