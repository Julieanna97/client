import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Products.css" //

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://ecommerce-api-new-two.vercel.app/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
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
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">
              {product.description.slice(0, 60)}...
            </p>
            <p className="product-price">${product.price}</p>
            <p className="product-stock">Stock: {product.stock}</p>

            <div className="product-actions">
              <Link to={`/product/${product.id}`} className="button-secondary">
                View Details
              </Link>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`button-primary ${
                  product.stock <= 0 ? "button-disabled" : ""
                }`}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="no-products">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
