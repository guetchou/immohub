import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const news = [
  {
    id: 1,
    title: "Nouveau quartier résidentiel à Brazzaville",
    excerpt: "Découvrez les opportunités d'investissement dans le nouveau quartier résidentiel de la capitale.",
    date: "2024-02-15",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    category: "Développement",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Guide de l'investissement immobilier",
    excerpt: "Tout ce que vous devez savoir pour investir dans l'immobilier au Congo.",
    date: "2024-02-10",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    category: "Guide",
    readTime: "8 min"
  },
  {
    id: 3,
    title: "Tendances du marché immobilier",
    excerpt: "Analyse des tendances du marché immobilier pour le premier trimestre 2024.",
    date: "2024-02-05",
    image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764",
    category: "Analyse",
    readTime: "6 min"
  },
  {
    id: 4,
    title: "Nouvelles réglementations immobilières",
    excerpt: "Les changements législatifs importants qui impactent le secteur immobilier.",
    date: "2024-02-01",
    image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
    category: "Législation",
    readTime: "7 min"
  }
];

const NewsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-real-primary">
            Actualités Immobilières
          </h2>
          <Button variant="outline">
            Toutes les actualités
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                  <span>{article.readTime} de lecture</span>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-real-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <Button variant="link" className="p-0 text-real-primary">
                  Lire la suite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;