import { Link } from "react-router-dom";
import "../Home.css";

const categories = [
  "All sets",
  "Best sellers",
  "Pink gloss",
  "Duck nails",
  "Almond",
  "Hand-painted",
];

const featuredSets = [
  {
    title: "Blush Aura",
    price: "149 SEK",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=85",
    tag: "Best seller",
    link: "/search?q=pink",
  },
  {
    title: "Crystal Coquette",
    price: "179 SEK",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=85",
    tag: "New",
    link: "/search?q=hand painted",
  },
  {
    title: "Sakura Baby",
    price: "159 SEK",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=700&q=85",
    tag: "Soft glam",
    link: "/search?q=almond",
  },
  {
    title: "Duck Doll",
    price: "169 SEK",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=85",
    tag: "Statement",
    link: "/search?q=duck",
  },
];

const testimonials = [
  {
    quote: "They lasted through the whole weekend and looked freshly done.",
    name: "Emily R.",
  },
  {
    quote: "So easy to apply and the designs look expensive in person.",
    name: "Jessica T.",
  },
  {
    quote: "My go-to when I want cute nails without booking a salon.",
    name: "Sophie M.",
  },
];

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero-shell">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="mini-label">Luxury press-on nails</p>

            <h1>
              Luxury Press-On Nails,
              <br />
              Made for You
            </h1>

            <p className="hero-text">
              Handmade, reusable and salon-quality. Effortless beauty for every
              mood, outfit and last-minute plan.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="primary-button">
                Shop now <span>→</span>
              </Link>
              <Link to="/search?q=pink" className="secondary-button">
                Explore pink sets
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-circle">
              <span>New</span>
              <strong>Blush</strong>
              <small>collection</small>
            </div>
          </div>

          <div className="hero-benefits">
            <div>
              <span>♡</span>
              <strong>Handmade</strong>
              <p>With love</p>
            </div>

            <div>
              <span>↻</span>
              <strong>Reusable</strong>
              <p>Wear again</p>
            </div>

            <div>
              <span>✦</span>
              <strong>Salon quality</strong>
              <p>In minutes</p>
            </div>

            <div>
              <span>♢</span>
              <strong>Easy glam</strong>
              <p>Anytime</p>
            </div>
          </div>
        </div>
      </section>

      <section className="category-strip">
        {categories.map((category) => (
          <Link
            key={category}
            to={
              category === "All sets"
                ? "/products"
                : `/search?q=${encodeURIComponent(category)}`
            }
          >
            {category}
          </Link>
        ))}
      </section>

      <section className="featured-section">
        <div className="section-title-row">
          <div>
            <p className="mini-label">Featured sets</p>
            <h2>Fresh nails, soft sparkle.</h2>
          </div>

          <Link to="/products">View all →</Link>
        </div>

        <div className="featured-grid">
          {featuredSets.map((set) => (
            <Link to={set.link} className="featured-card" key={set.title}>
              <div className="featured-image-wrap">
                <img src={set.image} alt={set.title} />
                <span>{set.tag}</span>
                <button type="button" aria-label="Add to favourites">
                  ♡
                </button>
              </div>

              <div className="featured-info">
                <h3>{set.title}</h3>
                <p>{set.price}</p>
                <small>★★★★★</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div className="split-panel blush-panel">
          <p className="mini-label">Why press-ons?</p>
          <h2>Salon-style nails without the salon schedule.</h2>
          <p>
            Switch your style for weekends, holidays, photos or everyday glam.
            Press-ons keep your beauty routine easy, flexible and fun.
          </p>

          <Link to="/products" className="primary-button">
            Browse all nails
          </Link>
        </div>

        <div className="split-panel">
          <p className="mini-label">How it works</p>
          <h2>Ready in three steps.</h2>

          <div className="step-list">
            <div>
              <span>01</span>
              <div>
                <strong>Choose your set</strong>
                <p>Pick your colour, shape and finish.</p>
              </div>
            </div>

            <div>
              <span>02</span>
              <div>
                <strong>Prep and press</strong>
                <p>Clean, size and apply with gentle pressure.</p>
              </div>
            </div>

            <div>
              <span>03</span>
              <div>
                <strong>Wear your shine</strong>
                <p>Enjoy a polished look in minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="love-section">
        <h2>Loved by everyday glam girls.</h2>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name}>
              <div>★★★★★</div>
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;