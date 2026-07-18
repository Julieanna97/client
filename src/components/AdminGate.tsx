import { FormEvent, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../Admin.css";

const DEMO_PASSWORD = "demo-admin";
const STORAGE_KEY = "portfolio_admin_demo_access";

const AdminGate = () => {
  const [password, setPassword] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasAccess(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim() === DEMO_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setHasAccess(true);
      setError("");
      return;
    }

    setError("Wrong demo password. Use: demo-admin");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasAccess(false);
    setPassword("");
  };

  if (!hasAccess) {
    return (
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <p className="eyebrow">Portfolio admin demo</p>
          <h1>Explore the e-commerce dashboard</h1>
          <p>
            This admin area is included so recruiters can review the full shop
            workflow: products, orders, customers, and management screens.
          </p>

          <div className="demo-credentials">
            <span>Demo password</span>
            <strong>{DEMO_PASSWORD}</strong>
          </div>

          <form onSubmit={handleSubmit} className="demo-login-form">
            <label htmlFor="admin-password">Enter demo password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="demo-admin"
            />

            {error && <p className="form-error">{error}</p>}

            <button type="submit">Open admin demo</button>
          </form>

          <Link to="/products" className="muted-link">
            ← Back to shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-demo-shell">
      <div className="demo-admin-banner">
        <div>
          <strong>Demo Admin Mode</strong>
          <p>
            Public portfolio demo. Destructive actions are disabled in the UI so
            the live database stays safe.
          </p>
        </div>

        <button type="button" className="secondary-button" onClick={handleLogout}>
          Lock admin
        </button>
      </div>

      <Outlet />
    </section>
  );
};

export default AdminGate;
