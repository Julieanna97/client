import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiAward,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";
import { API_BASE_URL } from "../lib/api";
import "../Home.css";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  image?: string;
  category?: string;
  external_url?: string | null;
}

const formatPrice = (value: number | string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  return `${amount.toFixed(2)} SEK`;
};

const perks = [
  {
    icon: FiHeart,
    title: "Handmade",
    description: "With love",
  },
  {
    icon: FiRefreshCw,
    title: "Reusable",
    description: "Up to 20+ wears",
  },
  {
    icon: FiAward,
    title: "Salon quality",
    description: "In minutes",
  },
  {
    icon: FiShield,
    title: "Cruelty free",
    description: "And vegan",
  },
];

const testimonials = [
  {
    quote:
      "The quality is unreal. They last so long and look exactly like salon nails.",
    name: "Emily R.",
    initials: "ER",
  },
  {
    quote:
      "So many compliments. My new go-to for cute, affordable nails.",
    name: "Jessica T.",
    initials: "JT",
  },
  {
    quote:
      "I have tried so many brands, but Nailé is by far the best.",
    name: "Sophie M.",
    initials: "SM",
  },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await axios.get(`${API_BASE_URL}/products`);

        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Could not load featured products:", error);

        if (isMounted) {
          setProducts([]);
          setProductsError(
            "The featured collection could not be loaded right now.",
          );
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) => Number(product.stock) > 0,
    );

    const productsToDisplay =
      availableProducts.length > 0 ? availableProducts : products;

    return productsToDisplay.slice(0, 5);
  }, [products]);

  const categoryLinks = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category?.trim())
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return [
      {
        label: "All sets",
        link: "/products",
      },
      ...uniqueCategories.slice(0, 6).map((category) => ({
        label: category,
        link: `/search?q=${encodeURIComponent(category)}`,
      })),
    ];
  }, [products]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Luxury press-on nails</p>

          <h1>
            Luxury Press-On Nails,
            <br />
            Made for <span>You</span>
          </h1>

          <p className="hero-description">
            Handmade. Reusable. Salon-quality.
            <br />
            Effortless beauty, anytime.
          </p>

          <Link to="/products" className="hero-button">
            Shop now
            <FiArrowRight />
          </Link>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1500&q=92"
            alt="Luxury neutral press-on nail design"
          />

          <div className="hero-stamp" aria-label="New collection">
            <small>New</small>
            <strong>Y2K</strong>
            <small>Collection</small>
          </div>
        </div>

        <div className="hero-perks">
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <div className="hero-perk" key={perk.title}>
                <span>
                  <Icon />
                </span>

                <div>
                  <strong>{perk.title}</strong>
                  <small>{perk.description}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="category-row">
        <nav className="category-strip" aria-label="Product categories">
          {categoryLinks.map((category, index) => (
            <Link
              key={`${category.label}-${category.link}`}
              to={category.link}
              className={index === 0 ? "active" : ""}
            >
              {category.label}
            </Link>
          ))}
        </nav>

        <Link to="/products" className="view-all-link">
          View all
          <FiArrowRight />
        </Link>
      </div>

      <section className="featured-section">
        <div className="section-heading">
          <h2>Featured Sets</h2>
        </div>

        <div className="featured-grid">
          {productsLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <article
                className="featured-card featured-card-skeleton"
                key={`featured-loading-${index}`}
                aria-hidden="true"
              >
                <div className="featured-image-wrap" />

                <div className="featured-skeleton-content">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ))}

          {!productsLoading &&
            featuredProducts.map((product, index) => {
              const stock = Math.max(0, Number(product.stock) || 0);
              const productUrl = `/product/${product.id}`;

              return (
                <article className="featured-card" key={product.id}>
                  <div className="featured-image-wrap">
                    <Link
                      to={productUrl}
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image || "/no-image.png"}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/no-image.png";
                        }}
                      />
                    </Link>

                    <span className="product-tag">
                      {index === 0
                        ? "Featured"
                        : product.category || "Press-on nails"}
                    </span>

                    <button
                      type="button"
                      className="favourite-button"
                      aria-label={`Add ${product.name} to favourites`}
                    >
                      <FiHeart />
                    </button>
                  </div>

                  <div className="featured-info">
                    <div>
                      <Link to={productUrl}>
                        <h3>{product.name}</h3>
                      </Link>

                      <p>{formatPrice(product.price)}</p>
                    </div>

                    <Link
                      to={productUrl}
                      className="product-cart-button"
                      aria-label={`View ${product.name}`}
                    >
                      <FiShoppingBag />
                    </Link>
                  </div>

                  <div
                    className={`featured-stock ${
                      stock <= 0 ? "is-sold-out" : ""
                    }`}
                  >
                    <span>{stock > 0 ? "In stock" : "Sold out"}</span>

                    {stock > 0 && <small>{stock} available</small>}
                  </div>
                </article>
              );
            })}

          {!productsLoading && productsError && (
            <div className="featured-empty">
              <h3>Featured products are unavailable</h3>
              <p>{productsError}</p>

              <Link to="/products">
                Browse the collection
                <FiArrowRight />
              </Link>
            </div>
          )}

          {!productsLoading &&
            !productsError &&
            featuredProducts.length === 0 && (
              <div className="featured-empty">
                <h3>No featured products yet</h3>
                <p>
                  Add products in the admin area and they will appear here.
                </p>

                <Link to="/products">
                  Browse the collection
                  <FiArrowRight />
                </Link>
              </div>
            )}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Loved by Thousands</h2>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name}>
              <div className="testimonial-stars">★★★★★</div>

              <blockquote>“{testimonial.quote}”</blockquote>

              <div className="testimonial-author">
                <span>{testimonial.initials}</span>
                <strong>{testimonial.name}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;