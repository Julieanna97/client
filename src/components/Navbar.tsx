import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar.css";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  };

  return (
    <header className="site-header">
      <div className="announcement-bar">
        Free shipping on orders over 499 SEK 💕
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/products">Shop</Link>
            <Link to="/search?q=duck">Collections</Link>
            <Link to="/search?q=pink">New arrivals</Link>
          </div>

          <Link to="/" className="navbar-brand">
            <span className="brand-mark">NC</span>
            <span>
              <strong>Nail Candi</strong>
              <small>Press-on nails</small>
            </span>
          </Link>

          <div className="navbar-right">
            <form onSubmit={handleSearch} className="navbar-search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search products"
              />
              <button type="submit">Search</button>
            </form>

            <Link to="/cart">Cart</Link>
            <Link to="/admin" className="staff-link">
              Staff
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;