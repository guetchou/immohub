import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jean-Pierre Makosso",
    role: "Propriétaire",
    videoUrl: "https://example.com/testimonial1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    quote: "ImmoHub a transformé ma façon de gérer mes biens immobiliers."
  },
  {
    id: 2,
    name: "Marie Ngoma",
    role: "Locataire",
    videoUrl: "https://example.com/testimonial2.mp4",
    thumbnail: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98",
    quote: "Un service client exceptionnel et des biens de qualité."
  },
  {
    id: 3,
    name: "Paul Bouemba",
    role: "Investisseur",
    videoUrl: "https://example.com/testimonial3.mp4",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "La meilleure plateforme pour l'investissement immobilier au Congo."
  }
];

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = (id: number) => {
    setActiveVideo(id === activeVideo ? null : id);
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Témoignages Vidéo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div 
                className="relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => handleVideoClick(testimonial.id)}
              >
                <img 
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {activeVideo === testimonial.id && isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-gray-400 mb-2">{testimonial.role}</p>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;