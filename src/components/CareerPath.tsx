
import React from 'react';

const CareerPath = () => {
  const careerLevels = [
    { 
      title: "Intern", 
      xp: "0 XP",
      description: "Begin your journey into professional writing",
      color: "bg-gray-100"
    },
    { 
      title: "Trainee", 
      xp: "1,000 XP",
      description: "Grasp the fundamentals of effective writing",
      color: "bg-brand-50"
    },
    { 
      title: "Junior Associate", 
      xp: "2,500 XP",
      description: "Apply basic principles in structured environments",
      color: "bg-brand-100"
    },
    { 
      title: "Associate", 
      xp: "5,000 XP", 
      description: "Work independently on straightforward projects",
      color: "bg-brand-200"
    },
    { 
      title: "Senior Associate", 
      xp: "10,000 XP",
      description: "Handle complex writing tasks with confidence",
      color: "bg-brand-300"
    },
    { 
      title: "Team Lead", 
      xp: "20,000 XP",
      description: "Guide and provide feedback on writing projects",
      color: "bg-brand-400 text-white"
    },
    { 
      title: "Manager", 
      xp: "35,000 XP",
      description: "Oversee multiple writing initiatives",
      color: "bg-brand-500 text-white"
    },
    { 
      title: "Director", 
      xp: "50,000 XP",
      description: "Develop writing strategies across channels",
      color: "bg-brand-600 text-white"
    },
    { 
      title: "VP", 
      xp: "75,000 XP",
      description: "Set direction for brand voice and messaging",
      color: "bg-brand-700 text-white"
    },
    { 
      title: "CMO", 
      xp: "100,000 XP",
      description: "Master of strategic communications",
      color: "bg-brand-800 text-white"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Writing Career Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your progress through real-world career milestones as you complete writing challenges
          </p>
        </div>
        
        <div className="relative">
          {/* Path line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
          
          <div className="space-y-12 relative z-10">
            {careerLevels.map((level, index) => (
              <div key={index} className={`md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'} mb-6 md:mb-0`}>
                  <h3 className="text-2xl font-bold text-gray-900">{level.title}</h3>
                  <p className="text-brand-500 font-semibold">{level.xp}</p>
                  <p className="text-gray-600 mt-2">{level.description}</p>
                </div>
                
                <div className="mx-auto md:mx-0 w-16 h-16 rounded-full border-4 border-white shadow-md flex items-center justify-center z-20 mb-6 md:mb-0">
                  <div className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center font-bold text-lg`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="md:w-5/12 md:opacity-0 hidden md:block">
                  {/* This is here for layout balance */}
                  <h3 className="text-2xl font-bold">{level.title}</h3>
                  <p className="text-gray-600 mt-2">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPath;
