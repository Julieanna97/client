import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Layout.css";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="admin-route-shell">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="layout-container">
      <Navbar />

      <main className="layout-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;