import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      alert("Product not found.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
    navigate("/cart");
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return null;

  return (
    <div>
      <h1>{product.name}</h1>

      <img src={product.image} alt={product.name} className="product-image" />

      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>{product.price} SEK</p>
      <p>Stock: {product.stock}</p>

      <label>Quantity:</label>

      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <br />

      <button onClick={addToCart} disabled={product.stock <= 0}>
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default Product;