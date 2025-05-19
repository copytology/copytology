
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Challenge } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface ChallengeDetailProps {
  challenge: Challenge;
  submission: string;
  wordCount: number;
  isSubmitting: boolean;
  onSubmissionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const ChallengeDetail: React.FC<ChallengeDetailProps> = ({
  challenge,
  submission,
  wordCount,
  isSubmitting,
  onSubmissionChange,
  onSubmit
}) => {
  const { t } = useLanguage();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
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
          <h3 className="font-medium text-gray-900 mb-2">{t('challenge.description')}:</h3>
          <p className="text-gray-700">{challenge.description}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2">{t('challenge.your.challenge')}:</h3>
          <p className="text-gray-700">{challenge.brief}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="submission" className="font-medium text-gray-900">
              {t('challenge.your.response')}:
            </label>
            <div className="flex items-center text-sm text-gray-500">
              <span className={wordCount > challenge.word_limit ? 'text-red-500' : ''}>
                {wordCount}/{challenge.word_limit} {t('challenge.words')}
              </span>
            </div>
          </div>
          
          <Textarea
            id="submission"
            placeholder={t('challenge.your.response')}
            className="min-h-[150px] text-base"
            value={submission}
            onChange={onSubmissionChange}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brand-400 hover:bg-brand-500"
          onClick={onSubmit}
          disabled={isSubmitting || wordCount > challenge.word_limit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('challenge.analyzing')}
            </>
          ) : (
            t('challenge.submit')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeDetail;
