
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Trophy, User, LogOut } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  currentXp?: number;
  level?: string;
  isLoggedIn?: boolean;
}

const Navbar = ({ currentXp = 0, level = "Intern", isLoggedIn }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Use the isLoggedIn prop or check if user exists
  const isAuthenticated = isLoggedIn || !!user;
  
  const handleLogout = async () => {
    await signOut();
    // No need to navigate here as the AuthContext will handle it
  };
  
  const userInitial = user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-brand-400 rounded-md w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-gray-900 font-bold text-xl hidden sm:inline-block">Copytology</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-brand-500 transition-colors">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-brand-500 transition-colors">
                Challenges
              </Link>
              <Link to="/history" className="text-gray-600 hover:text-brand-500 transition-colors">
                History
              </Link>
            </>
          )}
          <Link to="/about" className="text-gray-600 hover:text-brand-500 transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1">
                <Trophy size={16} className="text-brand-400 mr-2" />
                <span className="text-sm font-medium">{currentXp} XP</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm font-medium">{level}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-9 w-9 aspect-square">
                    <Avatar className="h-9 w-9 border-2 border-brand-100">
                      <AvatarFallback className="bg-brand-400 text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                      <BookOpen size={16} className="mr-2" />
                      My Challenges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-500">
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-brand-400 hover:bg-brand-500">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
