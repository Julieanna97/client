import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import "../Navbar.css";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch.length > 1) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
      setSearchTerm("");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Go to homepage">
          <span className="logo-mark">NC</span>
          <span>
            <strong>Nail Candi</strong>
            <small>Search Shop</small>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search duck, pink, almond..."
            value={searchTerm}
            onChange={handleInputChange}
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <div className="navbar-links">
          <Link to="/products">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/admin" className="admin-pill">
            Admin demo
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
