import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const news = [
  {
    id: 1,
    title: "Nouveau quartier résidentiel à Brazzaville",
    excerpt:
      "Découvrez les opportunités d'investissement dans le nouveau quartier résidentiel de la capitale.",
    date: "2024-02-15",
    image: "https://placehold.co/400x300",
  },
  {
    id: 2,
    title: "Guide de l'investissement immobilier",
    excerpt:
      "Tout ce que vous devez savoir pour investir dans l'immobilier au Congo.",
    date: "2024-02-10",
    image: "https://placehold.co/400x300",
  },
  {
    id: 3,
    title: "Tendances du marché immobilier",
    excerpt:
      "Analyse des tendances du marché immobilier pour le premier trimestre 2024.",
    date: "2024-02-05",
    image: "https://placehold.co/400x300",
  },
];

const NewsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Actualités Immobilières
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(article.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Button variant="outline">Lire la suite</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;