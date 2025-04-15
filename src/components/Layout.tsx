import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Layout.css"; // <- link CSS file

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main">
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
