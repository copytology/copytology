
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, BookOpen, ClipboardList, User, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  currentXp?: number;
  level?: string;
  isLoggedIn?: boolean;
}

const Navbar = ({ currentXp = 0, level = "Intern", isLoggedIn }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the isLoggedIn prop or check if user exists
  const isAuthenticated = isLoggedIn || !!user;
  
  const handleLogout = async () => {
    await signOut();
    // No need to navigate here as the AuthContext will handle it
  };
  
  const userInitial = user?.email?.[0].toUpperCase() || "U";

  // Define navigation items for authenticated users
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} className="mr-2" /> },
    { name: 'History', path: '/history', icon: <ClipboardList size={16} className="mr-2" /> },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="bg-brand-400 rounded-md w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-gray-900 font-bold text-xl hidden sm:inline-block">Copytology</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path) 
                      ? 'bg-brand-100 text-brand-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.name}
                  </div>
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu size={20} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name}
                      to={item.path} 
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActivePath(item.path) 
                          ? 'bg-brand-100 text-brand-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                  <Link 
                    to="/profile" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath('/profile') 
                        ? 'bg-brand-100 text-brand-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                    }`}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* User Menu and XP Display */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1">
                <div className="text-brand-400 mr-2 font-bold">{currentXp} XP</div>
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
          </>
        ) : (
          <>
            {/* Navigation for non-authenticated users */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-brand-500 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-brand-500 transition-colors">
                About
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-brand-400 hover:bg-brand-500 text-white">Sign Up</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
