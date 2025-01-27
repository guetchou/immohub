import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const news = [
  {
    id: 1,
    title: "Nouveau quartier résidentiel écologique à Brazzaville",
    excerpt: "Découvrez 'Les Jardins de Bacongo', premier éco-quartier du Congo avec certification environnementale. 200 logements durables disponibles dès 2024.",
    date: "2024-02-15",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    category: "Développement",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Guide complet de l'investissement immobilier au Congo",
    excerpt: "Analyse détaillée du marché, zones à fort potentiel, rendements locatifs et plus encore. Téléchargez notre rapport exclusif 2024.",
    date: "2024-02-10",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    category: "Guide",
    readTime: "8 min"
  },
  {
    id: 3,
    title: "Révolution digitale dans l'immobilier congolais",
    excerpt: "Visites virtuelles, signatures électroniques, paiements mobiles : comment la technologie transforme le secteur immobilier au Congo.",
    date: "2024-02-05",
    image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764",
    category: "Innovation",
    readTime: "6 min"
  },
  {
    id: 4,
    title: "Nouvelles mesures pour l'accès à la propriété",
    excerpt: "Le gouvernement annonce des facilités de crédit et des allègements fiscaux pour favoriser l'accession à la propriété des jeunes ménages.",
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
