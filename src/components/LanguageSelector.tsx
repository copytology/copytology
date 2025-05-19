
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'id');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(language === 'en' ? 'Language Settings' : 'Pengaturan Bahasa')}</CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Select your preferred language for the interface and challenges' 
            : 'Pilih bahasa yang Anda inginkan untuk antarmuka dan tantangan'}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
