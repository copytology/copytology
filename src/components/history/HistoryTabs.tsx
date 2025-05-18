
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

interface HistoryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList>
        <TabsTrigger value="all">{t('history.all.types')}</TabsTrigger>
        <TabsTrigger value="copywriting">{t('dashboard.copywriting')}</TabsTrigger>
        <TabsTrigger value="content">{t('dashboard.content')}</TabsTrigger>
        <TabsTrigger value="uxwriting">{t('dashboard.uxwriting')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default HistoryTabs;
