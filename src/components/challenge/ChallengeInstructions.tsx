
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, HelpCircle } from 'lucide-react';
import { Challenge } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface ChallengeInstructionsProps {
  challenge: Challenge;
  onHelpClick: () => void;
}

const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({
  challenge,
  onHelpClick
}) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('challenge.guidelines')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-2" />
          <span>{t('challenge.estimated.time')} {challenge.time_estimate}</span>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-2 text-sm">{t('challenge.keep.in.mind')}:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {challenge.guidelines.map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-2 text-sm">{t('challenge.word.limit')}:</h3>
          <p className="text-gray-700 text-sm">{challenge.word_limit} {t('challenge.words')} maximum</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={onHelpClick}
        >
          <HelpCircle size={16} className="mr-2" />
          {t('challenge.need.hint')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeInstructions;
