import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Products.css";
import { API_BASE_URL } from "../lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image: string;
  category: string;
  external_url?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch product", err);
      alert("This product could not be found.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]);

  const addToCart = () => {
    if (!product) return;

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  if (loading) return <p className="loading-state">Loading product...</p>;
  if (!product) return null;

  return (
    <section className="product-detail-page">
      <Link to="/products" className="muted-link">
        ← Back to collection
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
            className="product-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/no-image.png";
            }}
          />
        </div>

        <div className="product-detail-copy">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="detail-price-row">
            <strong>{Number(product.price).toFixed(2)} SEK</strong>
            <span>{product.stock > 0 ? `${product.stock} available` : "Sold out"}</span>
          </div>

          <div className="product-care-note">
            <strong>Made for easy nail days</strong>
            <span>Reusable with gentle removal and careful storage.</span>
          </div>

          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />

          <button onClick={addToCart} disabled={product.stock <= 0}>
            {product.stock > 0 ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;
