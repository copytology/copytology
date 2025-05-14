
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      position: "Former Teacher, Now Content Writer",
      quote: "Copytology gave me the confidence to switch careers. The challenges felt like real-world assignments, and the AI feedback helped me improve quickly.",
      stars: 5,
      level: "Team Lead"
    },
    {
      name: "Michael T.",
      position: "IT Professional to UX Writer",
      quote: "After 12 years in IT, I wanted a change. The specialized UX writing challenges helped me understand the nuances of the field and build a focused portfolio.",
      stars: 5,
      level: "Senior Associate"
    },
    {
      name: "Priya K.",
      position: "Marketing Coordinator",
      quote: "The gamification made learning fun, but the real value is in the quality of feedback. I improved more in 3 months than in a year at my job.",
      stars: 4,
      level: "Associate"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how others have transformed their careers with Copytology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  {[...Array(5 - testimonial.stars)].map((_, i) => (
                    <Star key={i + testimonial.stars} size={18} className="text-gray-200 fill-gray-200" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                  <div className="bg-brand-50 text-brand-500 text-sm font-medium px-3 py-1 rounded-full">
                    {testimonial.level}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
