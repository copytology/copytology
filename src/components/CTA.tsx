
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-16 bg-brand-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Writing Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of aspiring writers who have transformed their skills and careers with Copytology.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register">
              <Button className="bg-brand-400 hover:bg-brand-500 text-white h-12 px-8 text-lg w-full sm:w-auto animate-pulse-green">
                Get Started for Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-gray-500">
            No credit card required. Start with our free tier and upgrade anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
