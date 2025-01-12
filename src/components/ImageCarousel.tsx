import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
    title: "Résidences de Luxe",
    description: "Découvrez nos propriétés d'exception"
  },
  {
    url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    title: "Appartements Modernes",
    description: "Le confort moderne au cœur de la ville"
  },
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    title: "Villas avec Piscine",
    description: "Vivez le luxe au quotidien"
  }
];

const ImageCarousel = () => {
  return (
    <Carousel className="w-full max-w-6xl mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[500px] w-full">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{image.title}</h3>
                <p className="text-lg mb-4">{image.description}</p>
                <Button className="bg-real-primary hover:bg-real-primary/90">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default ImageCarousel;