
import React from 'react';
import { PenTool, BookOpen, BarChart, Trophy, PenSquare, MessageSquare } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <PenTool size={24} className="text-brand-400" />,
      title: "Diverse Writing Challenges",
      description: "Practice with realistic scenarios across copywriting, content writing, and UX writing disciplines."
    },
    {
      icon: <BookOpen size={24} className="text-brand-400" />,
      title: "AI-Powered Feedback",
      description: "Get instant, personalized feedback on your writing with specific improvement suggestions."
    },
    {
      icon: <BarChart size={24} className="text-brand-400" />,
      title: "Performance Analytics",
      description: "Track your progress over time and identify your strengths and areas for improvement."
    },
    {
      icon: <Trophy size={24} className="text-brand-400" />,
      title: "Career Progression Path",
      description: "Level up from Intern to CMO as you master new skills and complete challenges."
    },
    {
      icon: <PenSquare size={24} className="text-brand-400" />,
      title: "Real-world Scenarios",
      description: "Practice with challenges based on actual industry tasks and requirements."
    },
    {
      icon: <MessageSquare size={24} className="text-brand-400" />,
      title: "Industry-standard Briefs",
      description: "Learn to work with proper creative briefs and project specifications."
    }
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Develop Professional Writing Skills</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build your skills and transition to a writing career
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-brand-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
