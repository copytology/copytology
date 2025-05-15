
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Level } from '@/services/api';

interface LevelProgressProps {
  currentXp: number;
  currentLevel: Level;
  nextLevel?: Level;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ 
  currentXp, 
  currentLevel,
  nextLevel
}) => {
  // Calculate the progress percentage
  const calculateProgress = () => {
    if (!nextLevel) return 100; // Max level reached
    
    const xpForCurrentLevel = currentLevel.required_xp;
    const xpForNextLevel = nextLevel.required_xp;
    const xpRange = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = currentXp - xpForCurrentLevel;
    
    return Math.min(Math.floor((xpProgress / xpRange) * 100), 100);
  };
  
  const progressPercentage = calculateProgress();
  const xpToNextLevel = nextLevel ? nextLevel.required_xp - currentXp : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy size={20} className="text-brand-400 mr-2" /> Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-lg">{currentLevel.title}</span>
              <span className="text-sm text-gray-500 ml-2">Level {currentLevel.id}</span>
            </div>
            {nextLevel && (
              <span className="text-sm text-gray-500">
                Next: {nextLevel.title}
              </span>
            )}
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{currentXp} XP</span>
            {nextLevel ? (
              <span>{nextLevel.required_xp} XP</span>
            ) : (
              <span>Max Level</span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600">{currentLevel.description}</p>
        
        {nextLevel && (
          <p className="text-sm text-gray-500 mt-3">
            {xpToNextLevel} XP needed to reach next level
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelProgress;
