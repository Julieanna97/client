import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home-page">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio e-commerce project</p>
          <h1>Search-powered press-on nail shop</h1>
          <p>
            A polished full-stack e-commerce demo where products are stored in a
            MySQL cloud database, searched through a custom Google search flow,
            and connected to Stripe checkout.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-link">
              Browse products
            </Link>
            <Link to="/search?q=duck" className="secondary-link">
              Try search demo
            </Link>
          </div>

          <div className="tech-strip" aria-label="Project technologies">
            <span>React</span>
            <span>TypeScript</span>
            <span>Express</span>
            <span>Aiven MySQL</span>
            <span>Stripe</span>
            <span>Vercel</span>
          </div>
        </div>

        <div className="hero-showcase" aria-label="Project feature preview">
          <div className="floating-card search-preview">
            <span className="preview-label">Search query</span>
            <strong>duck nails</strong>
            <p>Matched to saved products in my own e-shop database.</p>
          </div>

          <div className="floating-card product-preview">
            <div className="polish-bubbles">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h2>Luxury press-on sets</h2>
            <p>Images, product text, prices, stock, cart and checkout.</p>
            <Link to="/products">View collection →</Link>
          </div>

          <div className="floating-card admin-preview">
            <span className="preview-label">Admin demo</span>
            <strong>demo-admin</strong>
            <p>Recruiters can review dashboard screens safely.</p>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <article>
          <span>01</span>
          <h3>Custom search flow</h3>
          <p>
            Search terms are matched to products saved in the shop, so users land
            on local product pages instead of an external store.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>Full e-commerce flow</h3>
          <p>
            Browse products, add to cart, fill checkout details and complete a
            Stripe-hosted payment flow.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>Admin dashboard</h3>
          <p>
            Includes product, order and customer screens so hiring managers can
            see the management side of the project.
          </p>
        </article>
      </div>

      <section className="demo-callout">
        <div>
          <p className="eyebrow">Hiring manager access</p>
          <h2>Admin demo included</h2>
          <p>
            The demo password is shown on the admin login screen. Destructive
            actions are disabled in the UI to protect the live database.
          </p>
        </div>

        <Link to="/admin" className="primary-link">
          Open admin demo
        </Link>
      </section>
    </section>
  );
};

export default Home;
