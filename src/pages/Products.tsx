import { useEffect, useMemo, useState } from "react";
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category)
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(productCategories))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("We couldn't load the collection right now. Please refresh and try again.");
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
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <p className="loading-state">Loading the collection...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <section className="shop-hero">
        <p className="eyebrow">Nail Candi collection</p>
        <h1 className="products-title">Press-on nail sets</h1>
        <p>
          Explore glossy, reusable nail sets made for quick application and
          instant polish.
        </p>
      </section>

      {error && <p className="no-products">{error}</p>}

      {!error && products.length === 0 && (
        <p className="no-products">The collection is being restocked.</p>
      )}

      {products.length > 0 && (
        <div className="category-filter" aria-label="Filter products by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="products-container">
        {visibleProducts.map((product) => (
          <article key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-wrap">
              <img
                src={product.image || "/no-image.png"}
                alt={product.name}
                className="product-image"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/no-image.png";
                }}
              />
            </Link>

            <div className="product-card-content">
              {product.category && (
                <p className="product-category">{product.category}</p>
              )}

              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">
                {product.description?.slice(0, 105)}
                {product.description?.length > 105 ? "..." : ""}
              </p>

              <div className="product-meta">
                <span>{Number(product.price).toFixed(2)} SEK</span>
                <span>{product.stock > 0 ? `${product.stock} left` : "Sold out"}</span>
              </div>

              <div className="product-actions">
                <Link to={`/product/${product.id}`} className="secondary-link small">
                  View details
                </Link>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Add to cart" : "Sold out"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Products;
