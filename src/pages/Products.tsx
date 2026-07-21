import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiShoppingBag,
} from "react-icons/fi";
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

const cleanText = (value = "") => value.replace(/\s+/g, " ").trim();

const createExcerpt = (value: string, length = 94) => {
  const cleaned = cleanText(value);

  if (cleaned.length <= length) {
    return cleaned;
  }

  return `${cleaned.slice(0, length).trim()}…`;
};

const formatPrice = (value: number | string) => {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "0.00 SEK";
  }

  return `${price.toFixed(2)} SEK`;
};

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category?.trim())
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(productCategories))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category?.trim() === activeCategory,
    );
  }, [activeCategory, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_BASE_URL}/products`);

        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error("Failed to fetch products", requestError);
        setError(
          "We couldn't load the collection right now. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    try {
      const storedCart = localStorage.getItem("cart");
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/cart");
    } catch (storageError) {
      console.error("Could not update cart", storageError);
    }
  };

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-hero-copy">
          <p className="catalog-eyebrow">The Nailé collection</p>

          <h1>
            Find your
            <br />
            perfect set.
          </h1>

          <p>
            Salon-inspired press-on nails designed for effortless application,
            comfortable wear and a polished finish.
          </p>

          <div className="catalog-hero-benefits">
            <span>
              <FiCheck />
              Reusable
            </span>

            <span>
              <FiCheck />
              Easy application
            </span>

            <span>
              <FiCheck />
              Salon-quality finish
            </span>
          </div>
        </div>

        <div className="catalog-hero-art" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />

          <div className="catalog-hero-stamp">
            <small>Luxury</small>
            <strong>NAILÉ</strong>
            <small>Press-ons</small>
          </div>
        </div>
      </section>

      {loading && (
        <section className="catalog-loading" aria-live="polite">
          <div className="catalog-loading-heading" />

          <div className="catalog-skeleton-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="catalog-skeleton-card" key={index}>
                <span />
                <i />
                <i />
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="catalog-message-card">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && products.length === 0 && (
        <section className="catalog-message-card">
          <h2>The collection is being restocked</h2>
          <p>Please check back soon for new press-on nail sets.</p>
        </section>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <section className="catalog-toolbar">
            <div
              className="catalog-filters"
              aria-label="Filter products by category"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  className={
                    activeCategory === category ? "is-active" : undefined
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <p>
              {visibleProducts.length}{" "}
              {visibleProducts.length === 1 ? "product" : "products"}
            </p>
          </section>

          <section className="catalog-grid">
            {visibleProducts.map((product) => {
              const stock = Number(product.stock) || 0;

              return (
                <article className="catalog-card" key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    className="catalog-card-image-link"
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={product.image || "/no-image.png"}
                      alt={product.name}
                      className="catalog-card-image"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/no-image.png";
                      }}
                    />

                    {product.category && (
                      <span className="catalog-card-category">
                        {product.category}
                      </span>
                    )}

                    {stock > 0 && stock <= 3 && (
                      <span className="catalog-low-stock">
                        Only {stock} left
                      </span>
                    )}
                  </Link>

                  <div className="catalog-card-content">
                    <Link
                      to={`/product/${product.id}`}
                      className="catalog-card-title"
                    >
                      {product.name}
                    </Link>

                    <p className="catalog-card-description">
                      {createExcerpt(product.description)}
                    </p>

                    <div className="catalog-card-meta">
                      <strong>{formatPrice(product.price)}</strong>

                      <span className={stock <= 0 ? "is-sold-out" : undefined}>
                        {stock > 0 ? "In stock" : "Sold out"}
                      </span>
                    </div>

                    <div className="catalog-card-actions">
                      <Link
                        to={`/product/${product.id}`}
                        className="catalog-view-button"
                      >
                        View set
                        <FiArrowRight />
                      </Link>

                      <button
                        type="button"
                        className="catalog-cart-button"
                        aria-label={`Add ${product.name} to cart`}
                        disabled={stock <= 0}
                        onClick={() => addToCart(product)}
                      >
                        <FiShoppingBag />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
};

export default Products;