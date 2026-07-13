import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to E-Shop 🛒</h1>

      <p>
        Explore our product search engine and browse products from the shop.
      </p>

      <div>
        <Link to="/products">
          Browse Products
        </Link>

        <Link to="/cart">
          View Cart
        </Link>

        <Link to="/admin/customers">
          Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Home;