
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Testimonials = () => {
  const { t, language } = useLanguage();
  
  const testimonials = [
    {
      name: "Sarah J.",
      position: language === 'en' ? "Former Teacher, Now Content Writer" : "Mantan Guru, Sekarang Penulis Konten",
      quoteEn: "Copytology gave me the confidence to switch careers. The challenges felt like real-world assignments, and the AI feedback helped me improve quickly.",
      quoteId: "Copytology memberi saya kepercayaan diri untuk beralih karir. Tantangannya terasa seperti tugas dunia nyata, dan umpan balik AI membantu saya meningkat dengan cepat.",
      stars: 5,
      level: language === 'en' ? "Team Lead" : "Pemimpin Tim"
    },
    {
      name: "Michael T.",
      position: language === 'en' ? "IT Professional to UX Writer" : "Profesional TI menjadi Penulis UX",
      quoteEn: "After 12 years in IT, I wanted a change. The specialized UX writing challenges helped me understand the nuances of the field and build a focused portfolio.",
      quoteId: "Setelah 12 tahun di TI, saya ingin perubahan. Tantangan penulisan UX khusus membantu saya memahami nuansa bidang ini dan membangun portofolio yang fokus.",
      stars: 5,
      level: language === 'en' ? "Senior Associate" : "Associate Senior"
    },
    {
      name: "Priya K.",
      position: language === 'en' ? "Marketing Coordinator" : "Koordinator Pemasaran",
      quoteEn: "The gamification made learning fun, but the real value is in the quality of feedback. I improved more in 3 months than in a year at my job.",
      quoteId: "Gamifikasi membuat belajar menyenangkan, tapi nilai sebenarnya ada pada kualitas umpan balik. Saya meningkat lebih banyak dalam 3 bulan daripada dalam setahun di pekerjaan saya.",
      stars: 4,
      level: language === 'en' ? "Associate" : "Associate"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.testimonials.subtitle')}
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
                  "{language === 'en' ? testimonial.quoteEn : testimonial.quoteId}"
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
