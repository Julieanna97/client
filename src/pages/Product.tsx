import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiCheck,
  FiExternalLink,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTruck,
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

const cleanDescription = (value = "") =>
  value.replace(/\s+/g, " ").trim();

const formatPrice = (value: number | string) => {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "0.00 SEK";
  }

  return `${price.toFixed(2)} SEK`;
};

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/products/${id}`,
        );

        setProduct(response.data);
        setQuantity(1);
      } catch (requestError) {
        console.error("Failed to fetch product", requestError);
        setError("This product could not be found.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  const stock = Math.max(0, Number(product?.stock) || 0);

  const updateQuantity = (nextQuantity: number) => {
    const maximum = Math.max(1, stock);
    const safeQuantity = Math.min(Math.max(nextQuantity, 1), maximum);

    setQuantity(safeQuantity);
  };

  const addToCart = () => {
    if (!product || stock <= 0) {
      return;
    }

    try {
      const storedCart = localStorage.getItem("cart");
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + quantity,
          stock,
        );
      } else {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/cart");
    } catch (storageError) {
      console.error("Could not update cart", storageError);
    }
  };

  if (loading) {
    return (
      <main className="pdp-page">
        <div className="pdp-loading">
          <div className="pdp-loading-image" />

          <div className="pdp-loading-copy">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pdp-page">
        <section className="pdp-error-card">
          <p className="catalog-eyebrow">Product unavailable</p>
          <h1>We couldn’t find this set.</h1>
          <p>{error || "The requested product is no longer available."}</p>

          <Link to="/products" className="pdp-primary-link">
            <FiArrowLeft />
            Return to the collection
          </Link>
        </section>
      </main>
    );
  }

  const description = cleanDescription(product.description);
  const condensedDescription =
    description.length > 380
      ? `${description.slice(0, 380).trim()}…`
      : description;

  return (
    <main className="pdp-page">
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to="/products">
          <FiArrowLeft />
          Shop all sets
        </Link>

        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="pdp-layout">
        <div className="pdp-gallery">
          <div className="pdp-image-frame">
            <img
              src={product.image || "/no-image.png"}
              alt={product.name}
              className="pdp-main-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/no-image.png";
              }}
            />

            {product.category && (
              <span className="pdp-image-category">
                {product.category}
              </span>
            )}
          </div>

          <div className="pdp-gallery-features">
            <span>
              <FiCheck />
              Quick application
            </span>

            <span>
              <FiRefreshCw />
              Reusable
            </span>

            <span>
              <FiShield />
              Gentle removal
            </span>
          </div>
        </div>

        <aside className="pdp-purchase-panel">
          {product.category && (
            <p className="pdp-category">{product.category}</p>
          )}

          <h1>{product.name}</h1>

          <p className="pdp-intro">
            A polished press-on nail set made for effortless, salon-inspired
            nail days.
          </p>

          <div className="pdp-price-row">
            <strong>{formatPrice(product.price)}</strong>

            <span className={stock <= 0 ? "is-sold-out" : undefined}>
              <i />
              {stock > 0 ? `${stock} available` : "Sold out"}
            </span>
          </div>

          <div className="pdp-divider" />

          <section className="pdp-description">
            <h2>About this set</h2>
            <p>
              {condensedDescription ||
                "A reusable press-on nail set designed for quick and easy application."}
            </p>

            {description.length > 380 && (
              <details>
                <summary>Read full description</summary>
                <p>{description}</p>
              </details>
            )}
          </section>

          <div className="pdp-divider" />

          <div className="pdp-purchase-controls">
            <div className="pdp-quantity-field">
              <span>Quantity</span>

              <div className="pdp-quantity-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <FiMinus />
                </button>

                <input
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  max={Math.max(1, stock)}
                  value={quantity}
                  onChange={(event) =>
                    updateQuantity(Number(event.target.value) || 1)
                  }
                />

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= stock || stock <= 0}
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="pdp-add-button"
              disabled={stock <= 0}
              onClick={addToCart}
            >
              <FiShoppingBag />
              {stock > 0 ? "Add to cart" : "Sold out"}
            </button>
          </div>

          {product.external_url && (
            <a
              href={product.external_url}
              target="_blank"
              rel="noreferrer"
              className="pdp-external-link"
            >
              View original product information
              <FiExternalLink />
            </a>
          )}

          <div className="pdp-service-list">
            <div>
              <span>
                <FiTruck />
              </span>

              <p>
                <strong>Free shipping</strong>
                <small>On orders over 499 SEK</small>
              </p>
            </div>

            <div>
              <span>
                <FiRefreshCw />
              </span>

              <p>
                <strong>Made to be reused</strong>
                <small>Remove gently and store carefully</small>
              </p>
            </div>

            <div>
              <span>
                <FiShield />
              </span>

              <p>
                <strong>Secure checkout</strong>
                <small>Your payment information is protected</small>
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="pdp-care-strip">
        <article>
          <span>01</span>
          <div>
            <h2>Prepare</h2>
            <p>Clean and dry your natural nails before application.</p>
          </div>
        </article>

        <article>
          <span>02</span>
          <div>
            <h2>Apply</h2>
            <p>Choose the best fit and press firmly into place.</p>
          </div>
        </article>

        <article>
          <span>03</span>
          <div>
            <h2>Reuse</h2>
            <p>Remove gently, clean the set and store it safely.</p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Product;