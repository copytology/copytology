
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Challenge } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose, challenge }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('challenge.writing.hints')}</DialogTitle>
          <DialogDescription>
            {t('challenge.tip')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-gray-700">
            {t('challenge.tip.consider').replace('{type}', challenge.type)}
          </p>
          
          <p className="text-gray-700">
            {t('challenge.tip.approaches')}
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>{t('challenge.tip.benefits')}</li>
            <li>{t('challenge.tip.language')}</li>
            <li>{t('challenge.tip.connection')}</li>
            <li>{t('challenge.tip.cta')}</li>
          </ul>
          
          {challenge.example_prompt && (
            <p className="text-gray-700 italic">
              "{challenge.example_prompt}"
            </p>
          )}
        </div>
        
        <Button onClick={onClose}>{t('challenge.got.it')}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
