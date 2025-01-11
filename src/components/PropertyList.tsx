import PropertyCard from "./PropertyCard";

// Données temporaires pour la démo
const MOCK_PROPERTIES = [
  {
    id: "1",
    title: "Appartement moderne au cœur de Brazzaville",
    price: 250000000,
    location: "Brazzaville",
    type: "Appartement",
    surface: 75,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
  {
    id: "2",
    title: "Villa avec jardin",
    price: 450000000,
    location: "Pointe-Noire",
    type: "Maison",
    surface: 200,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
  {
    id: "3",
    title: "Local commercial",
    price: 180000000,
    location: "Dolisie",
    type: "Bureau",
    surface: 120,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
  },
];

const PropertyList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PROPERTIES.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
};

export default PropertyList;