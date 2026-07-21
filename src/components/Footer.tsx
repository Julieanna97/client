import { Link } from "react-router-dom";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-column footer-about">
          <Link to="/" className="footer-brand">
            <span>NC</span>
            <strong>Nail Candi</strong>
          </Link>

          <p>
            Luxury press-on nails, handmade with love. Designed to make your
            nails feel effortlessly beautiful.
          </p>

          <div className="footer-socials">
            <span>◎</span>
            <span>♬</span>
            <span>♡</span>
            <span>▶</span>
          </div>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/products">All sets</Link>
          <Link to="/search?q=duck">Duck nails</Link>
          <Link to="/search?q=almond">Almond nails</Link>
          <Link to="/search?q=pink">Pink gloss</Link>
        </div>

        <div className="footer-column">
          <h3>Help</h3>
          <span>How to apply</span>
          <span>Shipping & returns</span>
          <span>Care guide</span>
          <span>Contact us</span>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/admin">Staff</Link>
        </div>

        <div className="footer-newsletter">
          <h3>Get 10% off your first order</h3>

          <div>
            <input type="email" placeholder="Enter your email" />
            <button type="button">Subscribe</button>
          </div>

          <p>© 2026 Nail Candi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;