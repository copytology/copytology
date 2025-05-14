
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-white to-brand-50 py-16 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
                Master Copywriting with <span className="text-brand-500">AI-Powered</span> Challenges
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Build professional writing skills through interactive challenges, earn XP, and climb the career ladder from Intern to CMO.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle2 size={20} className="text-brand-400 mr-2 flex-shrink-0" />
                <p className="text-gray-700">AI-generated challenges for copywriting, content, and UX writing</p>
              </div>
              <div className="flex items-center">
                <CheckCircle2 size={20} className="text-brand-400 mr-2 flex-shrink-0" />
                <p className="text-gray-700">Instant scoring and personalized AI feedback</p>
              </div>
              <div className="flex items-center">
                <CheckCircle2 size={20} className="text-brand-400 mr-2 flex-shrink-0" />
                <p className="text-gray-700">Track your progress with levels and career milestones</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="bg-brand-400 hover:bg-brand-500 text-white h-12 px-8 text-lg">
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="h-12 px-8 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-slide-up">
              <div className="flex items-center mb-6">
                <div className="bg-brand-100 text-brand-600 font-medium px-3 py-1 rounded-full text-sm">
                  Copywriting Challenge
                </div>
                <div className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  Medium
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Write a compelling email subject line for:</h3>
              <p className="text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                A productivity app launching a new feature that helps users automatically organize their calendar based on priorities.
              </p>
              
              <div className="mb-6">
                <textarea 
                  className="w-full p-4 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-brand-300 focus:border-brand-300 resize-none"
                  placeholder="Type your answer here..."
                  disabled
                ></textarea>
              </div>
              
              <Button className="w-full bg-brand-400 hover:bg-brand-500" disabled>
                Submit Answer
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Create an account to unlock challenges</p>
              </div>
            </div>
            
            <div className="absolute -z-10 -top-4 -bottom-4 -left-4 -right-4 bg-brand-400 rounded-2xl opacity-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
