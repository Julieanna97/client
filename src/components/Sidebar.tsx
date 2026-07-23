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

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: FiGrid,
    end: true,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: FiShoppingBag,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: FiUsers,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: FiPackage,
  },
  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: FiArchive,
  },
  {
    label: "Collections",
    path: "/admin/collections",
    icon: FiTag,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: FiStar,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: FiBarChart2,
  },
];

const Sidebar = ({ onLogout }: SidebarProps) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <strong>NAILÉ</strong>
        <span>Admin</span>
      </div>

      <nav
        className="admin-sidebar-nav"
        aria-label="Admin navigation"
      >
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-help-card">
          <FiHelpCircle />
          <strong>Portfolio admin</strong>
          <p>
            Explore live store data and interactive
            management views.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={onLogout}
        >
          <FiLogOut />
          Lock studio
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;