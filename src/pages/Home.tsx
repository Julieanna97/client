import { Link } from "react-router-dom";
import heroImage from "../assets/hero-nails.png";
import "../Home.css";

const benefits = [
  {
    icon: "♡",
    title: "Handmade",
    text: "With love",
  },
  {
    icon: "↻",
    title: "Reusable",
    text: "Up to 20+ wears",
  },
  {
    icon: "✦",
    title: "Salon quality",
    text: "In minutes",
  },
  {
    icon: "◇",
    title: "Cruelty free",
    text: "And vegan",
  },
];

const Home = () => {
  return (
    <main className="home-page">
      <section className="nail-hero">
        <div className="nail-hero__content">
          <p className="nail-hero__eyebrow">Handmade press-on nails</p>

          <h1 className="nail-hero__title">
            Luxury Press-On Nails,
            <span>Made for You</span>
          </h1>

          <p className="nail-hero__description">
            Reusable, salon-quality press-on nails designed for effortless
            beauty and a polished look in minutes.
          </p>

          <div className="nail-hero__actions">
            <Link to="/products" className="nail-hero__primary">
              Shop now
              <span aria-hidden="true">→</span>
            </Link>

            <Link to="/products" className="nail-hero__secondary">
              View collection
            </Link>
          </div>
        </div>

        <div className="nail-hero__media">
          <img
            src={heroImage}
            alt="Elegant press-on nails with delicate decorations"
          />

          <div className="nail-hero__badge">
            <small>New</small>
            <strong>Blush</strong>
            <small>Collection</small>
          </div>
        </div>

        <div className="nail-hero__benefits">
          {benefits.map((benefit) => (
            <div className="nail-benefit" key={benefit.title}>
              <span className="nail-benefit__icon" aria-hidden="true">
                {benefit.icon}
              </span>

              <div>
                <strong>{benefit.title}</strong>
                <span>{benefit.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keep the rest of your homepage sections here */}
    </main>
  );
};

export default Home;