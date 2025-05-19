
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-400 rounded-md w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-gray-900 font-bold text-xl">{t('app.name')}</span>
            </Link>
            <p className="text-gray-500 mt-4">
              {t('app.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.pricing')}</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.help')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.cookie')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t('footer.connect')}
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Instagram</a></li>
              <li><a href="mailto:contact@copytology.com" className="text-gray-500 hover:text-gray-900 transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
