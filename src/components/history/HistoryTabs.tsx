
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList>
        <TabsTrigger value="all">All Types</TabsTrigger>
        <TabsTrigger value="copywriting">Copywriting</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="uxwriting">UX Writing</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default HistoryTabs;
