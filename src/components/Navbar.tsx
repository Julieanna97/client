import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import "../Navbar.css";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="announcement-bar">
        Free shipping on orders over 499 SEK
        <span aria-hidden="true">♡</span>
      </div>

      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/products">Shop</Link>
            <Link to="/search?q=collection">Collections</Link>
            <Link to="/search?q=new">New arrivals</Link>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/" className="navbar-brand" aria-label="Nailé home">
            <strong>NAILÉ</strong>
            <small>Press-on nails</small>
          </Link>

          <div className="navbar-actions">
            <form className="navbar-search" onSubmit={handleSearch}>
              <FiSearch aria-hidden="true" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
              />

              <button type="submit">Search</button>
            </form>

            <Link
              to="/search?q=favourites"
              className="navbar-icon-link"
              aria-label="Favourites"
            >
              <FiHeart />
            </Link>

            <Link
              to="/admin"
              className="navbar-icon-link"
              aria-label="Staff area"
            >
              <FiUser />
            </Link>

            <Link to="/cart" className="cart-link">
              <FiShoppingBag />
              <span>Cart</span>
            </Link>
          </div>
        </div>

        <div className={`mobile-navigation ${menuOpen ? "is-open" : ""}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          <Link
            to="/search?q=collection"
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </Link>
          <Link to="/search?q=new" onClick={() => setMenuOpen(false)}>
            New arrivals
          </Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Staff
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;