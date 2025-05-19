
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import RefreshButton from '@/components/dashboard/RefreshButton';
import ChallengesList from '@/components/dashboard/ChallengesList';
import { useChallenges } from '@/hooks/useChallenges';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { language } = useLanguage();
  const { t } = useLanguage();

  // Fetch user profile
  const { 
    data: userProfile,
    isLoading: profileLoading
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile
  });

  // Get challenges using the custom hook
  const { 
    challenges: filteredChallenges, 
    isLoading: challengesLoading, 
    error: challengesError,
    isPending,
    handleRefreshChallenges
  } = useChallenges(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        isLoggedIn={true}
        currentXp={userProfile?.current_xp}
        level={userProfile?.levels?.title}
      />
      
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <RefreshButton 
            isPending={isPending} 
            onClick={handleRefreshChallenges} 
          />
        </div>
        
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <ChallengesList
          challenges={filteredChallenges}
          isLoading={challengesLoading || profileLoading}
          error={challengesError}
          isPending={isPending}
          handleRefreshChallenges={handleRefreshChallenges}
          language={language}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
