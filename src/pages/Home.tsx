import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center mt-10 px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to E-Shop 🛒</h1>
      <p className="text-gray-600 text-lg mb-8">
        Explore our wide selection of products and enjoy seamless shopping.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
        <Link
          to="/cart"
          className="bg-gray-100 border border-gray-300 px-6 py-3 rounded hover:bg-gray-200 transition"
        >
          View Cart
        </Link>
        <Link
          to="/admin/customers"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Home;
