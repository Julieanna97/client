import { Link } from "react-router-dom";
import "../../Admin.css";

const AdminHome = () => {
  return (
    <div className="admin-panel">
      <section className="admin-hero">
        <p className="eyebrow">Dashboard overview</p>
        <h1>Admin demo</h1>
        <p>
          A reviewable admin area for the portfolio project. Hiring managers can
          see how the product, customer and order management screens are
          structured without needing private credentials.
        </p>
        <p className="admin-note">
          Demo mode is intentionally read-only in the UI. The live shop stays
          stable while reviewers can still explore the full dashboard.
        </p>
      </section>

      <div className="admin-grid">
        <Link to="/admin/products" className="admin-card">
          <span>Products</span>
          <h2>Manage catalog</h2>
          <p>Review the saved Nail Candi products, prices, stock and categories.</p>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <span>Orders</span>
          <h2>Review checkout flow</h2>
          <p>See orders created from the cart and Stripe checkout process.</p>
        </Link>

        <Link to="/admin/customers" className="admin-card">
          <span>Customers</span>
          <h2>Customer records</h2>
          <p>View customer information captured during checkout.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
