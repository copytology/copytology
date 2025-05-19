
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/services/api';
import ChallengeCard from './ChallengeCard';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface ChallengesListProps {
  challenges: Challenge[];
  isLoading: boolean;
  error: Error | null;
  isPending: boolean;
  handleRefreshChallenges: () => void;
  language: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ 
  challenges, 
  isLoading, 
  error,
  isPending,
  handleRefreshChallenges,
  language
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
        <p className="text-lg text-gray-600">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">{t('dashboard.error')}</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['userChallenges', language] })}
          className="mt-4"
        >
          {t('dashboard.try.again')}
        </Button>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-lg text-gray-600 mb-4">{t('dashboard.no.challenges')}</p>
        <Button onClick={handleRefreshChallenges} className="bg-brand-400 hover:bg-brand-500 text-white">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('dashboard.generating')}
            </>
          ) : (
            t('dashboard.generate.new')
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengesList;
