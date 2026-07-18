import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div>
        <strong>Nail Candi Search Shop</strong>
        <p>
          React, TypeScript, Express, MySQL, Aiven, Vercel, Stripe and Google
          Programmable Search.
        </p>
      </div>

      <div className="footer-links">
        <Link to="/products">Products</Link>
        <Link to="/search?q=duck">Search demo</Link>
        <Link to="/admin">Admin demo</Link>
      </div>
    </footer>
  );
};

export default Footer;
