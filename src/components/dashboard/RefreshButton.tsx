
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RefreshButtonProps {
  isPending: boolean;
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ isPending, onClick }) => {
  const { t } = useLanguage();

  return (
    <Button 
      onClick={onClick} 
      disabled={isPending}
      className="bg-brand-400 hover:bg-brand-500 text-white"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('dashboard.generating')}
        </>
      ) : (
        <>
          <RefreshCw size={16} className="mr-2" />
          {t('dashboard.refresh')}
        </>
      )}
    </Button>
  );
};

export default RefreshButton;
