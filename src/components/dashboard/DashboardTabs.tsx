
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList>
        <TabsTrigger value="all">{t('dashboard.all')}</TabsTrigger>
        <TabsTrigger value="copywriting">{t('dashboard.copywriting')}</TabsTrigger>
        <TabsTrigger value="content">{t('dashboard.content')}</TabsTrigger>
        <TabsTrigger value="uxwriting">{t('dashboard.uxwriting')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
