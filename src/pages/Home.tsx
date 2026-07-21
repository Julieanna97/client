import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";
import "../Home.css";

const categories = [
  { label: "All sets", link: "/products" },
  { label: "Best sellers", link: "/search?q=best seller" },
  { label: "Y2K collection", link: "/search?q=y2k" },
  { label: "Glitter", link: "/search?q=glitter" },
  { label: "French", link: "/search?q=french" },
  { label: "Nude", link: "/search?q=nude" },
  { label: "3D design", link: "/search?q=3d" },
];

const featuredSets = [
  {
    title: "Blush Aura",
    price: "149 SEK",
    reviewCount: 245,
    tag: "Best seller",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=88",
    link: "/search?q=blush",
  },
  {
    title: "Crystal Coquette",
    price: "179 SEK",
    reviewCount: 109,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=88",
    link: "/search?q=crystal",
  },
  {
    title: "Sakura Baby",
    price: "159 SEK",
    reviewCount: 312,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=88",
    link: "/search?q=sakura",
  },
  {
    title: "Galactic Star",
    price: "169 SEK",
    reviewCount: 156,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=88",
    link: "/search?q=galactic",
  },
  {
    title: "Honey Glaze",
    price: "149 SEK",
    reviewCount: 201,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=800&q=88",
    link: "/search?q=honey",
  },
];

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
          {categories.map((category, index) => (
            <Link
              key={category.label}
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
          <h2>
            Featured Sets <span>✣</span>
          </h2>
        </div>

        <div className="featured-grid">
          {featuredSets.map((set) => (
            <article className="featured-card" key={set.title}>
              <div className="featured-image-wrap">
                <Link to={set.link} aria-label={`View ${set.title}`}>
                  <img src={set.image} alt={set.title} />
                </Link>

                {set.tag && <span className="product-tag">{set.tag}</span>}

                <button
                  type="button"
                  className="favourite-button"
                  aria-label={`Add ${set.title} to favourites`}
                >
                  <FiHeart />
                </button>
              </div>

              <div className="featured-info">
                <div>
                  <Link to={set.link}>
                    <h3>{set.title}</h3>
                  </Link>
                  <p>{set.price}</p>
                </div>

                <Link
                  to={set.link}
                  className="product-cart-button"
                  aria-label={`View ${set.title}`}
                >
                  <FiShoppingBag />
                </Link>
              </div>

              <div className="product-rating">
                <span aria-label="5 out of 5 stars">★★★★★</span>
                <small>({set.reviewCount})</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>
          Loved by Thousands <span>♡</span>
        </h2>

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