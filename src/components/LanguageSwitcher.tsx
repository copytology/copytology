
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'id');
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={language === 'en' ? 'English' : 'Bahasa Indonesia'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('language.english')}</SelectItem>
        <SelectItem value="id">{t('language.indonesian')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
