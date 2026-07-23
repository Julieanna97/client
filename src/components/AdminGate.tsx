import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiExternalLink,
  FiLock,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import Sidebar from "./Sidebar";
import "../Admin.css";

const STAFF_PASSWORD = "demo-admin";
const STORAGE_KEY = "nail_candi_staff_access";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  customers: "Customers",
  products: "Products",
  inventory: "Inventory",
  collections: "Collections",
  reviews: "Reviews",
  analytics: "Analytics",
};

type OpenMenu = "notifications" | "profile" | null;

const AdminGate = () => {
  const location = useLocation();

  const topbarActionsRef = useRef<HTMLDivElement | null>(
    null,
  );

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [hasAccess, setHasAccess] = useState(
    () =>
      localStorage.getItem(STORAGE_KEY) === "true",
  );

  const [openMenu, setOpenMenu] =
    useState<OpenMenu>(null);

  const [unreadNotifications, setUnreadNotifications] =
    useState(3);

  const adminSection =
    location.pathname
      .split("/")
      .filter(Boolean)[1] || "dashboard";

  const pageTitle =
    PAGE_TITLES[adminSection] || "Dashboard";

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (
      event: globalThis.MouseEvent,
    ) => {
      const target = event.target;

      if (
        target instanceof Node &&
        topbarActionsRef.current &&
        !topbarActionsRef.current.contains(target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (password.trim() === STAFF_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setHasAccess(true);
      setPassword("");
      setError("");
      return;
    }

    setError(
      "The password is incorrect. Please try again.",
    );
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasAccess(false);
    setPassword("");
    setError("");
    setOpenMenu(null);
  };

  const toggleMenu = (
    menu: Exclude<OpenMenu, null>,
  ) => {
    setOpenMenu((current) =>
      current === menu ? null : menu,
    );
  };

  if (!hasAccess) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <Link
            to="/"
            className="admin-login-logo"
            aria-label="Return to Nailé shop"
          >
            NAILÉ
            <small>Admin</small>
          </Link>

          <p className="admin-login-eyebrow">
            Staff access
          </p>

          <h1>Welcome to the studio.</h1>

          <p className="admin-login-description">
            Sign in to review the Nailé catalog,
            customers, orders, inventory and store
            analytics.
          </p>

          <div className="demo-credentials">
            <span>Demo password</span>
            <strong>demo-admin</strong>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="staff-password">
              Password
            </label>

            <input
              id="staff-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />

            {error && (
              <p
                className="admin-login-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button type="submit">
              Enter studio
            </button>
          </form>

          <Link
            to="/"
            className="admin-back-link"
          >
            ← Back to shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <Sidebar onLogout={handleLogout} />

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-page-name">
            <button
              type="button"
              aria-label="Open admin navigation"
            >
              <FiMenu aria-hidden="true" />
            </button>

            <strong>{pageTitle}</strong>
          </div>

          <div
            className="admin-topbar-actions"
            ref={topbarActionsRef}
          >
            <div className="admin-search">
              <FiSearch aria-hidden="true" />

              <input
                type="search"
                placeholder="Search anything..."
                aria-label="Search admin dashboard"
              />

              <kbd>⌘K</kbd>
            </div>

            <div className="admin-action-menu-wrap">
              <button
                type="button"
                className="admin-notification-button"
                aria-label="View notifications"
                aria-expanded={
                  openMenu === "notifications"
                }
                aria-haspopup="menu"
                onClick={() =>
                  toggleMenu("notifications")
                }
              >
                <FiBell aria-hidden="true" />

                {unreadNotifications > 0 && (
                  <span>{unreadNotifications}</span>
                )}
              </button>

              {openMenu === "notifications" && (
                <div
                  className="admin-popover admin-notification-panel"
                  role="menu"
                >
                  <div className="admin-popover-heading">
                    <div>
                      <strong>Notifications</strong>
                      <small>
                        Recent store activity
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setUnreadNotifications(0)
                      }
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="admin-notification-list">
                    <Link
                      to="/admin/orders"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      <span className="notification-icon orders">
                        <FiShoppingBag />
                      </span>

                      <div>
                        <strong>
                          New orders received
                        </strong>
                        <small>
                          Review the latest customer
                          orders.
                        </small>
                        <time>Just now</time>
                      </div>
                    </Link>

                    <Link
                      to="/admin/inventory"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      <span className="notification-icon inventory">
                        <FiPackage />
                      </span>

                      <div>
                        <strong>
                          Inventory updated
                        </strong>
                        <small>
                          Product quantities have
                          changed.
                        </small>
                        <time>18 minutes ago</time>
                      </div>
                    </Link>

                    <Link
                      to="/admin/customers"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      <span className="notification-icon customers">
                        <FiUser />
                      </span>

                      <div>
                        <strong>
                          Customer activity
                        </strong>
                        <small>
                          View your newest customer
                          records.
                        </small>
                        <time>1 hour ago</time>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-action-menu-wrap">
              <button
                type="button"
                className="admin-profile-button"
                aria-label="Open administrator menu"
                aria-expanded={openMenu === "profile"}
                aria-haspopup="menu"
                onClick={() => toggleMenu("profile")}
              >
                <span className="admin-avatar">
                  JA
                </span>

                <span>Hello, Admin</span>

                <FiChevronDown
                  className={
                    openMenu === "profile"
                      ? "is-rotated"
                      : ""
                  }
                  aria-hidden="true"
                />
              </button>

              {openMenu === "profile" && (
                <div
                  className="admin-popover admin-profile-panel"
                  role="menu"
                >
                  <div className="admin-profile-summary">
                    <span className="admin-avatar large">
                      JA
                    </span>

                    <div>
                      <strong>Julie Admin</strong>
                      <small>Store administrator</small>
                    </div>
                  </div>

                  <div className="admin-profile-menu">
                    <Link
                      to="/"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      <FiExternalLink />
                      View storefront
                    </Link>

                    <Link
                      to="/admin/products"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                    >
                      <FiPackage />
                      Manage products
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      <FiLock />
                      Lock studio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminGate;