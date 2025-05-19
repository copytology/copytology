
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-brand-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register">
              <Button className="bg-brand-400 hover:bg-brand-500 text-white h-12 px-8 text-lg w-full sm:w-auto animate-pulse-green">
                {t('landing.cta.getstarted')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                {t('landing.cta.viewpricing')}
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-gray-500">
            {t('landing.cta.nocreditcard')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
