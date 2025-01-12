import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jean Dupont",
    role: "Propriétaire",
    content: "Un service exceptionnel ! J'ai pu louer mon appartement en moins d'une semaine.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marie Claire",
    role: "Locataire",
    content: "La plateforme est très intuitive et les agents sont très professionnels.",
    rating: 5,
  },
  {
    id: 3,
    name: "Paul Martin",
    role: "Investisseur",
    content: "Excellent outil pour gérer mon portefeuille immobilier.",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Ce que disent nos clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <div>
                  <h4 className="font-semibold text-real-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;