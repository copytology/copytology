
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, User, Trophy, BookOpen } from 'lucide-react';
import LevelProgress from '@/components/LevelProgress';
import { api } from '@/services/api';

const Profile = () => {
  // Fetch user profile data
  const { 
    data: profile,
    isLoading: profileLoading 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile
  });
  
  // Fetch next level data
  const {
    data: nextLevel,
    isLoading: nextLevelLoading
  } = useQuery({
    queryKey: ['nextLevel', profile?.level_id],
    queryFn: () => profile ? api.getNextLevel(profile.level_id) : null,
    enabled: !!profile,
  });
  
  // Fetch user submissions
  const {
    data: submissions,
    isLoading: submissionsLoading
  } = useQuery({
    queryKey: ['submissions'],
    queryFn: api.getUserSubmissions,
    enabled: !!profile,
  });

  const isLoading = profileLoading || nextLevelLoading || submissionsLoading;
  
  // Calculate stats
  const totalSubmissions = submissions?.length || 0;
  const totalXpEarned = submissions?.reduce((sum, sub) => sum + sub.xp_gained, 0) || 0;
  const averageScore = submissions?.length 
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length) 
    : 0;

  const userInitial = profile?.full_name?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        isLoggedIn={true}
        currentXp={profile?.current_xp}
        level={profile?.levels?.title}
      />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-400" />
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User info card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-brand-400 text-white text-xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-xl mb-1">{profile.full_name}</h3>
                <div className="flex items-center justify-center bg-gray-50 rounded-full px-3 py-1 mb-4">
                  <Trophy size={16} className="text-brand-400 mr-2" />
                  <span className="text-sm font-medium">{profile.current_xp} XP</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm font-medium">{profile.levels?.title}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Level progress card */}
            <div className="md:col-span-2">
              {profile.levels && (
                <LevelProgress 
                  currentXp={profile.current_xp} 
                  currentLevel={profile.levels} 
                  nextLevel={nextLevel || undefined}
                />
              )}
            </div>
            
            {/* Stats cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen size={18} className="mr-2" /> Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Total Submissions</p>
                    <p className="text-2xl font-semibold">{totalSubmissions}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold">{averageScore}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Total XP Earned</p>
                    <p className="text-2xl font-semibold">{totalXpEarned} XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Failed to load profile data.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
