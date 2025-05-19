
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { Challenge } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const navigate = useNavigate();
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
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

export default ChallengeCard;
