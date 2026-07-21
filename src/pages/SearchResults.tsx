import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiSearch,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { API_BASE_URL } from "../lib/api";
import "../Products.css";
import "../SearchResults.css";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  category?: string;
  image?: string;
  external_url?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const productMatchesQuery = (
  product: Product,
  query: string,
) => {
  const words = normalize(query)
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) {
    return true;
  }

  const searchableText = normalize(
    [
      product.name,
      product.description,
      product.category,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return words.every((word) =>
    searchableText.includes(word),
  );
};

const createExcerpt = (
  value = "",
  maximumLength = 105,
) => {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (cleaned.length <= maximumLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maximumLength).trim()}…`;
};

const formatPrice = (value: number | string) => {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? `${amount.toFixed(2)} SEK`
    : "Price unavailable";
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q")?.trim() || "";

  const [searchValue, setSearchValue] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/products`,
        );

        if (active) {
          setProducts(
            Array.isArray(response.data)
              ? response.data
              : [],
          );
        }
      } catch (requestError) {
        console.error(
          "Could not fetch products:",
          requestError,
        );

        if (active) {
          setError(
            "Search is unavailable right now. Please try again in a moment.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        productMatchesQuery(product, query),
      ),
    [products, query],
  );

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextQuery = searchValue.trim();

    if (!nextQuery) {
      navigate("/products");
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(nextQuery)}`,
    );
  };

  const addToCart = (product: Product) => {
    try {
      const storedCart = localStorage.getItem("cart");
      const parsedCart = storedCart
        ? JSON.parse(storedCart)
        : [];

      const cart: CartItem[] = Array.isArray(parsedCart)
        ? parsedCart
        : [];

      const existingItem = cart.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(cart),
      );

      window.dispatchEvent(
        new Event("cart-updated"),
      );

      navigate("/cart");
    } catch (storageError) {
      console.error(
        "Could not update the cart:",
        storageError,
      );
    }
  };

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-copy">
          <p className="search-eyebrow">
            Search the collection
          </p>

          <h1>
            {query
              ? `Results for “${query}”`
              : "Find your next set."}
          </h1>

          <p>
            Search by colour, shape, design, product name
            or collection.
          </p>

          <form
            className="search-page-form"
            onSubmit={handleSearch}
          >
            <FiSearch aria-hidden="true" />

            <input
              value={searchValue}
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
              placeholder="Try pink, gift card, C103..."
              aria-label="Search products"
            />

            {searchValue && (
              <button
                type="button"
                className="search-clear-button"
                aria-label="Clear search"
                onClick={() => setSearchValue("")}
              >
                <FiX />
              </button>
            )}

            <button
              type="submit"
              className="search-submit-button"
            >
              Search
            </button>
          </form>

          <div className="search-suggestions">
            <span>Popular:</span>

            <Link to="/search?q=press on nails">
              Press-on nails
            </Link>

            <Link to="/search?q=gift card">
              Gift cards
            </Link>

            <Link to="/search?q=pink">Pink</Link>
          </div>
        </div>

        <div
          className="search-hero-decoration"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="search-results-section">
        <header className="search-results-heading">
          <div>
            <p>Collection results</p>

            <h2>
              {query
                ? `Matching “${query}”`
                : "All products"}
            </h2>
          </div>

          {!loading && !error && (
            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>
          )}
        </header>

        {loading && (
          <div
            className="catalog-skeleton-grid"
            aria-label="Loading products"
          >
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  className="catalog-skeleton-card"
                  key={index}
                >
                  <span />
                  <i />
                  <i />
                </div>
              ),
            )}
          </div>
        )}

        {!loading && error && (
          <div className="search-state-card">
            <span className="search-state-icon">
              <FiSearch />
            </span>

            <h2>Search is temporarily unavailable</h2>
            <p>{error}</p>

            <Link to="/products">
              Browse all products
              <FiArrowRight />
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="search-state-card">
              <span className="search-state-icon">
                <FiSearch />
              </span>

              <h2>No matching sets found</h2>

              <p>
                Try a product name, category or a simpler
                keyword.
              </p>

              <div className="search-empty-actions">
                <Link to="/products">
                  Browse all products
                  <FiArrowRight />
                </Link>

                <Link to="/search?q=press on nails">
                  Search press-on nails
                </Link>
              </div>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="catalog-grid">
              {filteredProducts.map((product) => {
                const stock = Math.max(
                  0,
                  Number(product.stock) || 0,
                );

                return (
                  <article
                    className="catalog-card"
                    key={product.id}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="catalog-card-image-link"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={
                          product.image ||
                          "/no-image.png"
                        }
                        alt={product.name}
                        className="catalog-card-image"
                        onError={(event) => {
                          event.currentTarget.onerror =
                            null;
                          event.currentTarget.src =
                            "/no-image.png";
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
                        {createExcerpt(
                          product.description,
                        )}
                      </p>

                      <div className="catalog-card-meta">
                        <strong>
                          {formatPrice(product.price)}
                        </strong>

                        <span
                          className={
                            stock <= 0
                              ? "is-sold-out"
                              : undefined
                          }
                        >
                          {stock > 0
                            ? "In stock"
                            : "Sold out"}
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
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          <FiShoppingBag />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
};

export default SearchResults;