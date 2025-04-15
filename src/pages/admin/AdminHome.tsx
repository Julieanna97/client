import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>Choose a section to manage:</p>

      <div className="admin-links">
        <Link to="/admin/customers">Manage Customers</Link>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
      </div>
    </div>
  );
};

export default AdminHome;
