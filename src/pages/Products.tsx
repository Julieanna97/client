import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Products.css";
import { API_BASE_URL } from "../lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image: string;
  category?: string;
  external_url?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Could not load products from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
    navigate("/cart");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="products-page">
      <h1 className="products-title">Shop Products</h1>

      {error && <p className="no-products">{error}</p>}

      {!error && products.length === 0 && (
        <p className="no-products">No products available.</p>
      )}

      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            )}

            <h2 className="product-title">{product.name}</h2>

            <p>{product.description?.slice(0, 80)}...</p>

            {product.category && <p>Category: {product.category}</p>}

            <p className="product-price">
              {Number(product.price).toFixed(2)} SEK
            </p>

            <p>Stock: {product.stock}</p>

            <div>
              <Link to={`/product/${product.id}`}>View Product</Link>

              <br />

              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;