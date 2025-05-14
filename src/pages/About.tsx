
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code, FileText, MessageSquare, PenTool } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-50 py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About Copytology
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're on a mission to help career switchers master professional writing skills through AI-powered challenges and personalized feedback.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button className="w-full bg-brand-400 hover:bg-brand-500">
                    Start Learning
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-8 text-center">
                We created Copytology to address a key challenge: learning professional writing is often abstract, with feedback that's either subjective or arrives too late.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                      <PenTool size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Learn by Doing</h3>
                    <p className="text-gray-600">
                      Practice with real-world writing challenges designed to build professional skills.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-brand-100 w-12 h-12 flex items-center justify-center mb-4">
                      <MessageSquare size={24} className="text-brand-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
                    <p className="text-gray-600">
                      Get detailed AI-powered feedback on your writing, helping you improve faster.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                      <FileText size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Build a Portfolio</h3>
                    <p className="text-gray-600">
                      Develop a body of work that demonstrates your skills to potential employers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Disciplines */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Writing Disciplines We Cover
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master the core writing skills needed for the most in-demand content roles
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <PenTool size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Copywriting</h3>
                <p className="text-gray-600 mb-4">
                  Learn to craft persuasive messaging that drives action, including ads, emails, landing pages, and product descriptions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Headline writing</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Email marketing</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Ad copywriting</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Sales pages</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Content Writing</h3>
                <p className="text-gray-600 mb-4">
                  Develop skills for creating valuable, informative content that builds authority and engages audiences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Blog articles</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Social media content</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">White papers</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Case studies</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                  <Code size={32} className="text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">UX Writing</h3>
                <p className="text-gray-600 mb-4">
                  Master the art of creating clear, concise interface text that guides users through digital products.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Button text</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Error messages</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Onboarding flows</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-gray-700">Form field labels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                How Copytology Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A learning experience designed to build practical skills through practice and feedback
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-400 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Challenge</h3>
                <p className="text-gray-600">
                  Select from our library of real-world writing scenarios across three disciplines.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-400 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Write Your Response</h3>
                <p className="text-gray-600">
                  Create your solution to the challenge using our guided interface and helpful tips.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-400 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get AI Feedback</h3>
                <p className="text-gray-600">
                  Receive immediate, detailed feedback on your writing with specific improvement suggestions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-400 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-gray-600">
                  Earn XP, advance through career levels, and build a portfolio of your best work.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-brand-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Start Your Writing Journey?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join Copytology today and develop the writing skills you need for a successful career transition.
              </p>
              <Link to="/register">
                <Button className="bg-brand-400 hover:bg-brand-500 text-white h-12 px-8 text-lg animate-pulse-green">
                  Get Started for Free
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
