import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  surface: number;
  imageUrl: string;
}

const PropertyCard = ({ id, title, price, location, type, surface, imageUrl }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/property/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-real-primary text-white px-2 py-1 rounded">
            {type}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-real-primary mb-2">{title}</h3>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>{location}</span>
            <span>{surface} m²</span>
          </div>
          <div className="text-xl font-bold text-real-accent">
            {formatPrice(price)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;