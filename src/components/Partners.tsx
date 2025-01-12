const partners = [
  {
    id: 1,
    name: "Banque Atlantique",
    logo: "https://placehold.co/200x100",
  },
  {
    id: 2,
    name: "BGFI Bank",
    logo: "https://placehold.co/200x100",
  },
  {
    id: 3,
    name: "Ecobank",
    logo: "https://placehold.co/200x100",
  },
  {
    id: 4,
    name: "MTN Congo",
    logo: "https://placehold.co/200x100",
  },
];

const Partners = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-real-primary mb-8">
          Nos Partenaires
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-4"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[150px] grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;