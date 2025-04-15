import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-h-96 object-cover rounded mb-4"
      />
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-2">Category: {product.category}</p>
      <p className="text-xl font-bold mb-4">${product.price}</p>
      <label className="block mb-2 font-medium">Quantity:</label>
      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="p-2 border rounded w-24 text-center mb-4"
      />
      <br />
      <button
        onClick={addToCart}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
