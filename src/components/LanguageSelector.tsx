
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'id');
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={language} onValueChange={handleLanguageChange} className="space-y-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="language-en" />
          <Label htmlFor="language-en" className="cursor-pointer">{t('language.english')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="id" id="language-id" />
          <Label htmlFor="language-id" className="cursor-pointer">{t('language.indonesian')}</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default LanguageSelector;
