
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, BookOpen, Clock, FileEdit, PenLine } from 'lucide-react';

// This will be replaced with real data from an API
const mockChallenges = [
  {
    id: 1,
    type: 'copywriting',
    title: 'Write a Compelling Email Subject Line',
    brief: 'Create a subject line for a tech company launching a new productivity app feature.',
    difficulty: 'Medium',
    timeEstimate: '10 min',
  },
  {
    id: 2,
    type: 'content',
    title: 'Craft a Blog Introduction',
    brief: 'Write an engaging introduction for a blog post about remote work best practices.',
    difficulty: 'Easy',
    timeEstimate: '15 min',
  },
  {
    id: 3,
    type: 'uxwriting',
    title: 'Design Error Message Copy',
    brief: 'Create a user-friendly error message for a failed payment on an e-commerce site.',
    difficulty: 'Hard',
    timeEstimate: '12 min',
  },
  {
    id: 4,
    type: 'copywriting',
    title: 'Create Social Media Ad Copy',
    brief: 'Write engaging copy for an Instagram ad promoting a fitness subscription service.',
    difficulty: 'Medium',
    timeEstimate: '8 min',
  },
  {
    id: 5,
    type: 'content',
    title: 'Write a Product Description',
    brief: 'Craft a compelling product description for a premium coffee subscription service.',
    difficulty: 'Medium',
    timeEstimate: '20 min',
  },
  {
    id: 6,
    type: 'uxwriting',
    title: 'Create Onboarding Microcopy',
    brief: "Write welcoming and instructive microcopy for a fitness app's first-time user experience.",
    difficulty: 'Hard',
    timeEstimate: '15 min',
  }
];

// Mock user data
const userData = {
  name: 'Alex Johnson',
  level: 'Associate',
  currentXp: 5350,
  nextLevelXp: 10000,
  completedChallenges: 42,
  averageScore: 83
};

const Dashboard = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'copywriting': return <PenLine size={16} className="mr-1" />;
      case 'content': return <FileEdit size={16} className="mr-1" />;
      case 'uxwriting': return <BookOpen size={16} className="mr-1" />;
      default: return null;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'copywriting': return 'bg-blue-100 text-blue-700';
      case 'content': return 'bg-purple-100 text-purple-700';
      case 'uxwriting': return 'bg-brand-100 text-brand-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} currentXp={userData.currentXp} level={userData.level} />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{userData.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Level</span>
                    <span className="font-medium">{userData.level}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-brand-500">{userData.currentXp} XP</span>
                    <span className="text-gray-500">{userData.nextLevelXp} XP</span>
                  </div>
                  <Progress 
                    value={(userData.currentXp / userData.nextLevelXp) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData.completedChallenges}</div>
                    <div className="text-xs text-gray-500">Challenges</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{userData.averageScore}</div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center" asChild>
                  <Link to="/profile">
                    <BarChart size={16} className="mr-2" />
                    View Stats
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Copywriting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>Content Writing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-brand-400 mr-2"></div>
                  <span>UX Writing</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Your Writing Challenges</h1>
              <Button className="mt-2 md:mt-0 bg-brand-400 hover:bg-brand-500">Refresh Challenges</Button>
            </div>
            
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="copywriting">Copywriting</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="uxwriting">UX Writing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges.map(challenge => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getTypeColor(challenge.type)}`}>
                            <div className="flex items-center">
                              {getTypeIcon(challenge.type)}
                              {challenge.type === 'uxwriting' ? 'UX Writing' : 
                                challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                            </div>
                          </Badge>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {challenge.brief}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Estimated time: {challenge.timeEstimate}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-brand-400 hover:bg-brand-500" asChild>
                          <Link to={`/challenge/${challenge.id}`}>
                            Start Challenge
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Filter tabs for different writing types */}
              <TabsContent value="copywriting" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges
                    .filter(challenge => challenge.type === 'copywriting')
                    .map(challenge => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getTypeColor(challenge.type)}`}>
                            <div className="flex items-center">
                              {getTypeIcon(challenge.type)}
                              Copywriting
                            </div>
                          </Badge>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {challenge.brief}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Estimated time: {challenge.timeEstimate}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-brand-400 hover:bg-brand-500" asChild>
                          <Link to={`/challenge/${challenge.id}`}>
                            Start Challenge
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges
                    .filter(challenge => challenge.type === 'content')
                    .map(challenge => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getTypeColor(challenge.type)}`}>
                            <div className="flex items-center">
                              {getTypeIcon(challenge.type)}
                              Content Writing
                            </div>
                          </Badge>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {challenge.brief}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Estimated time: {challenge.timeEstimate}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-brand-400 hover:bg-brand-500" asChild>
                          <Link to={`/challenge/${challenge.id}`}>
                            Start Challenge
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="uxwriting" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockChallenges
                    .filter(challenge => challenge.type === 'uxwriting')
                    .map(challenge => (
                    <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getTypeColor(challenge.type)}`}>
                            <div className="flex items-center">
                              {getTypeIcon(challenge.type)}
                              UX Writing
                            </div>
                          </Badge>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {challenge.brief}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Estimated time: {challenge.timeEstimate}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-brand-400 hover:bg-brand-500" asChild>
                          <Link to={`/challenge/${challenge.id}`}>
                            Start Challenge
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
