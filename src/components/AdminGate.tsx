import { FormEvent, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../Admin.css";

const STAFF_PASSWORD = "demo-admin";
const STORAGE_KEY = "nail_candi_staff_access";

const AdminGate = () => {
  const [password, setPassword] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasAccess(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

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
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <p className="eyebrow">Staff access</p>
          <h1>Nail Candi studio</h1>
          <p>
            Sign in to view catalog, customer and order information for the
            boutique.
          </p>

          <form onSubmit={handleSubmit} className="demo-login-form">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />

            {error && <p className="form-error">{error}</p>}

            <button type="submit">Enter studio</button>
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
          <strong>View-only studio access</strong>
          <p>
            Catalog and order data can be reviewed here. Editing controls are
            locked on the public storefront.
          </p>
        </div>

        <button type="button" className="secondary-button" onClick={handleLogout}>
          Lock studio
        </button>
      </div>

      <Outlet />
    </section>
  );
};

export default AdminGate;
