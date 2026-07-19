import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <section className="cart-empty">
      <p className="eyebrow">404 error</p>
      <h1>We couldn't find that page</h1>
      <p>The page may have moved, or the address may be incorrect.</p>

      <Link to="/" className="primary-link">
        Return home
      </Link>
    </section>
  );
};

export default NotFound;