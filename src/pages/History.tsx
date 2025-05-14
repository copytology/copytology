
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

// Mock history data
const mockHistory = [
  {
    id: 101,
    title: 'Write a Social Media Post',
    type: 'copywriting',
    date: '2023-05-12',
    score: 92,
    response: 'Ready to transform your workspace? Our new desk organizer collection combines style and function so you can declutter your desk and your mind. Shop now and get 15% off your first order! #WorkspaceGoals #Productivity',
    feedback: 'Excellent use of benefits and a clear call to action. Good incorporation of relevant hashtags.'
  },
  {
    id: 102,
    title: 'Craft a Product Description',
    type: 'content',
    date: '2023-05-10',
    score: 78,
    response: "The UltraFocus Noise-Cancelling Headphones deliver crystal-clear audio while blocking out distractions. With memory foam ear cushions and a lightweight design, they're comfortable for all-day wear. The 30-hour battery life ensures your music keeps playing as long as you need it to.",
    feedback: 'Good description of features, but could better connect features to benefits for the user. Consider adding more sensory language.'
  },
  {
    id: 103,
    title: 'Write Button Copy',
    type: 'uxwriting',
    date: '2023-05-07',
    score: 85,
    response: 'Start Your Free Trial',
    feedback: 'Strong action-oriented text with clear value proposition (free). Direct and effective.'
  },
  {
    id: 104,
    title: 'Create an Email Sign-off',
    type: 'copywriting',
    date: '2023-05-05',
    score: 73,
    response: 'Looking forward to our collaboration,\nJessica, Customer Success Manager',
    feedback: 'The sign-off is professional but could be more personalized to the specific email context.'
  },
  {
    id: 105,
    title: 'Write a FAQ Answer',
    type: 'content',
    date: '2023-05-02',
    score: 88,
    response: 'You can cancel your subscription at any time by logging into your account and visiting the Subscription page. Once there, click the "Cancel Subscription" button and follow the prompts. Your access will continue until the end of your current billing period, and you won\'t be charged again. If you have any issues, our support team is available 24/7 via live chat.',
    feedback: 'Clear instructions with a logical flow. Good addition of support information. Consider adding information about refund policy.'
  }
];

// Mock user data
const userData = {
  name: 'Alex Johnson',
  level: 'Associate',
  currentXp: 5350,
};

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>("all");
  
  const itemsPerPage = 10;
  const totalItems = mockHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.response.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'copywriting': return 'bg-blue-100 text-blue-700';
      case 'content': return 'bg-purple-100 text-purple-700';
      case 'uxwriting': return 'bg-brand-100 text-brand-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getTypeLabel = (type: string) => {
    if (type === 'uxwriting') return 'UX Writing';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} currentXp={userData.currentXp} level={userData.level} />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Challenge History</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search your submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={18} className="text-gray-500" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="copywriting">Copywriting</SelectItem>
                    <SelectItem value="content">Content Writing</SelectItem>
                    <SelectItem value="uxwriting">UX Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No challenge history matching your search criteria.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedChallenge === item.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedChallenge(selectedChallenge === item.id ? null : item.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 ${getScoreColor(item.score)} text-xl font-bold w-12 text-center`}>
                        {item.score}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeLabel(item.type)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon size={14} className="mr-1" />
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-gray-400">
                      {selectedChallenge === item.id ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                  
                  {selectedChallenge === item.id && (
                    <div className="mt-4 pl-16 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Your Response:</h4>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-600">
                          {item.response}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
                        <div className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-brand-100 text-brand-500 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-600 flex-1">
                            {item.feedback}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button size="sm" className="bg-brand-400 hover:bg-brand-500" asChild>
                          <Link to={`/challenge/${item.id}`}>Try Similar Challenge</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {filteredHistory.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredHistory.length} of {totalItems} submissions
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
