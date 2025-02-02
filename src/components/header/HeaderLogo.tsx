import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
      ImmoHub Congo
    </Link>
  );
};

export default HeaderLogo;