import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
} from "react-icons/fi";
import Sidebar from "./Sidebar";
import "../Admin.css";

const STAFF_PASSWORD = "demo-admin";
const STORAGE_KEY = "nail_candi_staff_access";

const AdminGate = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  const location = useLocation();

  const pageTitle = location.pathname.includes("/orders")
    ? "Orders"
    : location.pathname.includes("/customers")
      ? "Customers"
      : location.pathname.includes("/products")
        ? "Products"
        : "Dashboard";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim() === STAFF_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setHasAccess(true);
      setError("");
      return;
    }

    setError("The password is incorrect. Please try again.");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasAccess(false);
    setPassword("");
  };

  if (!hasAccess) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <Link to="/" className="admin-login-logo">
            NAILÉ
            <small>Admin</small>
          </Link>

          <p className="admin-login-eyebrow">Staff access</p>
          <h1>Welcome to the studio.</h1>

          <p className="admin-login-description">
            Sign in to review the Nailé catalog, customer information and
            orders.
          </p>

          <div className="demo-credentials">
            <span>Demo password</span>
            <strong>demo-admin</strong>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label htmlFor="staff-password">Password</label>

            <input
              id="staff-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />

            {error && <p className="admin-login-error">{error}</p>}

            <button type="submit">Enter studio</button>
          </form>

          <Link to="/" className="admin-back-link">
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
            <button type="button" aria-label="Open navigation">
              <FiMenu />
            </button>
            <strong>{pageTitle}</strong>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-search">
              <FiSearch />
              <input placeholder="Search anything..." aria-label="Search admin" />
              <kbd>⌘K</kbd>
            </div>

            <button
              type="button"
              className="admin-notification-button"
              aria-label="Notifications"
            >
              <FiBell />
              <span>3</span>
            </button>

            <button type="button" className="admin-profile-button">
              <span className="admin-avatar">JA</span>
              <span>Hello, Admin</span>
              <FiChevronDown />
            </button>
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