import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-real-primary">
            ImmoHub
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-600 hover:text-real-accent">
              Accueil
            </Link>
            <Link to="/properties" className="text-gray-600 hover:text-real-accent">
              Propriétés
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;