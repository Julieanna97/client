import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Products.css"

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://ecommerce-api-new-two.vercel.app/products/${id}`);
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

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    navigate("/cart");
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return null;

  return (
    <div>
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>${product.price}</p>
      <label>Quantity:</label>
      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <br />
      <button
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
