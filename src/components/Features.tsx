
import React from 'react';
import { PenTool, BookOpen, BarChart, Trophy, PenSquare, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <PenTool size={24} className="text-brand-400" />,
      titleKey: "diverse",
      descriptionKey: "diverse.desc"
    },
    {
      icon: <BookOpen size={24} className="text-brand-400" />,
      titleKey: "ai.feedback",
      descriptionKey: "ai.feedback.desc"
    },
    {
      icon: <BarChart size={24} className="text-brand-400" />,
      titleKey: "analytics",
      descriptionKey: "analytics.desc"
    },
    {
      icon: <Trophy size={24} className="text-brand-400" />,
      titleKey: "career",
      descriptionKey: "career.desc"
    },
    {
      icon: <PenSquare size={24} className="text-brand-400" />,
      titleKey: "scenarios",
      descriptionKey: "scenarios.desc"
    },
    {
      icon: <MessageSquare size={24} className="text-brand-400" />,
      titleKey: "briefs",
      descriptionKey: "briefs.desc"
    }
  ];

  // Map to get translated content
  const getFeatures = () => {
    return features.map((feature, index) => ({
      ...feature,
      title: feature.titleKey === "diverse" ? t('landing.features.diverse') :
             feature.titleKey === "ai.feedback" ? t('landing.features.ai.feedback') :
             feature.titleKey === "analytics" ? t('landing.features.analytics') :
             feature.titleKey === "career" ? t('landing.features.career') :
             feature.titleKey === "scenarios" ? t('landing.features.scenarios') :
             t('landing.features.briefs'),
      description: feature.descriptionKey === "diverse.desc" ? t('landing.features.diverse.desc') :
                  feature.descriptionKey === "ai.feedback.desc" ? t('landing.features.ai.feedback.desc') :
                  feature.descriptionKey === "analytics.desc" ? t('landing.features.analytics.desc') :
                  feature.descriptionKey === "career.desc" ? t('landing.features.career.desc') :
                  feature.descriptionKey === "scenarios.desc" ? t('landing.features.scenarios.desc') :
                  t('landing.features.briefs.desc')
    }));
  };

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getFeatures().map((feature, index) => (
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
