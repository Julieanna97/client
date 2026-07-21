import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import "../Products.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  image: string;
  external_url?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const normalize = (value = "") => value.toLowerCase().trim();

const productMatchesQuery = (product: Product, query: string) => {
  const searchText = normalize(`
    ${product.name}
    ${product.description}
    ${product.category}
  `);

  const queryWords = normalize(query)
    .split(" ")
    .filter((word) => word.length > 0);

  return queryWords.every((word) => searchText.includes(word));
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    return products.filter((product) => productMatchesQuery(product, query));
  }, [products, query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Could not fetch products:", err);
      setError("Search is unavailable right now. Please try again in a moment.");
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

  return (
    <div className="products-page">
      <section className="shop-hero search-hero">
        <p className="eyebrow">Search the collection</p>
        <h1 className="products-title">Results for “{query}”</h1>
        <p>
          Find press-on nail sets by colour, shape, finish or mood.
        </p>
      </section>

      {loading && <p className="loading-state">Searching...</p>}

      {error && <p className="no-products">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="no-products search-empty-card">
          <h2>No matching sets found</h2>
          <p>
            Try another search like pink, duck, almond, luxury or gift card.
          </p>
          <Link to="/products" className="primary-link">
            Browse all nails
          </Link>
        </div>
      )}

      <div className="products-container">
        {filteredProducts.map((product) => (
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
              <p className="product-category">{product.category}</p>
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

export default SearchResults;
