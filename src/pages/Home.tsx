import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to E-Shop 🛒</h1>
      <p>
        Explore our wide selection of products and enjoy seamless shopping.
      </p>

      <div>
        <Link
          to="/products"
        >
          Browse Products
        </Link>
        <Link
          to="/cart"
        >
          View Cart
        </Link>
        <Link
          to="/admin/customers"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Home;
