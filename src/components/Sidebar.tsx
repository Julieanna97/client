import { NavLink } from "react-router-dom";
import {
  FiArchive,
  FiBarChart2,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiUsers,
} from "react-icons/fi";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <strong>NAILÉ</strong>
        <span>Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FiGrid />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FiShoppingBag />
          <span>Orders</span>
          <small>24</small>
        </NavLink>

        <NavLink
          to="/admin/customers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FiUsers />
          <span>Customers</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FiPackage />
          <span>Products</span>
        </NavLink>

        <span className="admin-nav-placeholder">
          <FiArchive />
          <span>Inventory</span>
        </span>

        <span className="admin-nav-placeholder">
          <FiTag />
          <span>Collections</span>
        </span>

        <span className="admin-nav-placeholder">
          <FiStar />
          <span>Reviews</span>
        </span>

        <span className="admin-nav-placeholder">
          <FiBarChart2 />
          <span>Analytics</span>
        </span>
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-help-card">
          <FiHelpCircle />
          <strong>Need help?</strong>
          <p>Review the store documentation and support notes.</p>
        </div>

        <button type="button" className="admin-logout" onClick={onLogout}>
          <FiLogOut />
          Lock studio
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;