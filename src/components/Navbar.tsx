import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, ChangeEvent } from "react";
import "../Navbar.css";

const Navbar = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.length > 2) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Shop
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
        </form>

        <div className="navbar-links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>

          <div
            className="navbar-admin"
            onMouseEnter={() => setShowAdmin(true)}
            onMouseLeave={() => setShowAdmin(false)}
          >
            <span>Admin</span>
            {showAdmin && (
              <div className="navbar-admin-dropdown">
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/customers">Manage Customers</Link>
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">Manage Orders</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
