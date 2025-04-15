import { Link } from "react-router-dom";
import "../Navbar.css"; // <- link CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">E-Shop</Link>

        <div className="navbar-links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>

          <div className="navbar-admin">
            <span>Admin</span>
            <div className="navbar-admin-dropdown">
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/customers">Manage Customers</Link>
              <Link to="/admin/products">Manage Products</Link>
              <Link to="/admin/orders">Manage Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
