import {
  FiArrowUpRight,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import "../../Admin.css";

const metrics = [
  {
    label: "Total Orders",
    value: "1,248",
    change: "18.6%",
    icon: FiShoppingBag,
    tone: "pink",
  },
  {
    label: "Total Customers",
    value: "3,682",
    change: "22.4%",
    icon: FiUsers,
    tone: "orange",
  },
  {
    label: "Total Revenue",
    value: "62,430 SEK",
    change: "25.7%",
    icon: FiDollarSign,
    tone: "peach",
  },
  {
    label: "Products",
    value: "256",
    change: "8.3%",
    icon: FiPackage,
    tone: "rose",
  },
];

const topProducts = [
  {
    name: "Blush Aura",
    amount: "5,874 SEK",
    sales: "187 sales",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Crystal Coquette",
    amount: "5,210 SEK",
    sales: "163 sales",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Sakura Baby",
    amount: "4,768 SEK",
    sales: "148 sales",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Galactic Star",
    amount: "4,230 SEK",
    sales: "131 sales",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Honey Glaze",
    amount: "3,890 SEK",
    sales: "120 sales",
    image:
      "https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=160&q=80",
  },
];

const recentOrders = [
  {
    id: "#NA12348",
    customer: "Emily R.",
    date: "Jun 2, 2026",
    status: "Processing",
    total: "299 SEK",
  },
  {
    id: "#NA12347",
    customer: "Jessica T.",
    date: "Jun 2, 2026",
    status: "Shipped",
    total: "329 SEK",
  },
  {
    id: "#NA12346",
    customer: "Sophie M.",
    date: "Jun 1, 2026",
    status: "Delivered",
    total: "289 SEK",
  },
  {
    id: "#NA12345",
    customer: "Olivia K.",
    date: "May 31, 2026",
    status: "Processing",
    total: "319 SEK",
  },
  {
    id: "#NA12344",
    customer: "Mia L.",
    date: "May 31, 2026",
    status: "Cancelled",
    total: "299 SEK",
  },
];

const updates = [
  { name: "Blush Aura", action: "Updated price", time: "2m ago" },
  { name: "Crystal Coquette", action: "Updated inventory", time: "15m ago" },
  { name: "Sakura Baby", action: "Updated images", time: "1h ago" },
  { name: "Galactic Star", action: "Updated price", time: "2h ago" },
  { name: "Honey Glaze", action: "Updated inventory", time: "3h ago" },
];

const AdminHome = () => {
  return (
    <div className="dashboard-page">
      <section className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="metric-card" key={metric.label}>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </div>

              <span className={`metric-icon ${metric.tone}`}>
                <Icon />
              </span>

              <small>
                <FiArrowUpRight />
                <b>{metric.change}</b> vs last month
              </small>
            </article>
          );
        })}
      </section>

      <section className="dashboard-top-grid">
        <article className="dashboard-card revenue-card">
          <div className="dashboard-card-heading">
            <div>
              <h2>Revenue Overview</h2>
              <div className="revenue-total">
                <strong>62,430 SEK</strong>
                <span>↑ 25.7% vs last month</span>
              </div>
            </div>

            <button type="button">This month⌄</button>
          </div>

          <div className="revenue-chart">
            <div className="chart-labels">
              <span>40K</span>
              <span>30K</span>
              <span>20K</span>
              <span>10K</span>
              <span>0</span>
            </div>

            <svg
              viewBox="0 0 640 250"
              role="img"
              aria-label="Revenue increased during the month"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef91a1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ef91a1" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <line x1="0" y1="25" x2="640" y2="25" />
              <line x1="0" y1="75" x2="640" y2="75" />
              <line x1="0" y1="125" x2="640" y2="125" />
              <line x1="0" y1="175" x2="640" y2="175" />
              <line x1="0" y1="225" x2="640" y2="225" />

              <path
                className="chart-area"
                d="M0 212 L35 188 L70 190 L105 122 L140 100 L175 109 L210 112 L245 152 L280 153 L315 183 L350 125 L385 92 L420 97 L455 54 L490 25 L525 51 L560 102 L595 76 L640 15 L640 240 L0 240 Z"
              />

              <path
                className="chart-line"
                d="M0 212 L35 188 L70 190 L105 122 L140 100 L175 109 L210 112 L245 152 L280 153 L315 183 L350 125 L385 92 L420 97 L455 54 L490 25 L525 51 L560 102 L595 76 L640 15"
              />
            </svg>

            <div className="chart-dates">
              <span>May 5</span>
              <span>May 12</span>
              <span>May 19</span>
              <span>May 26</span>
              <span>Jun 2</span>
            </div>
          </div>
        </article>

        <article className="dashboard-card top-products-card">
          <div className="dashboard-card-heading">
            <h2>Top Selling Products</h2>
            <button type="button">View all</button>
          </div>

          <div className="top-products-list">
            {topProducts.map((product) => (
              <div className="top-product" key={product.name}>
                <img src={product.image} alt="" />

                <div>
                  <strong>{product.name}</strong>
                </div>

                <div>
                  <strong>{product.amount}</strong>
                  <small>{product.sales}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-middle-grid">
        <article className="dashboard-card inventory-card">
          <h2>Inventory Overview</h2>

          <div className="inventory-content">
            <div className="inventory-donut">
              <div>
                <strong>256</strong>
                <span>Total products</span>
              </div>
            </div>

            <div className="inventory-legend">
              <span>
                <i className="in-stock" />
                <b>In stock</b>
                <small>192 (75%)</small>
              </span>
              <span>
                <i className="low-stock" />
                <b>Low stock</b>
                <small>48 (19%)</small>
              </span>
              <span>
                <i className="out-stock" />
                <b>Out of stock</b>
                <small>16 (6%)</small>
              </span>
            </div>
          </div>
        </article>

        <article className="dashboard-card order-overview-card">
          <h2>Orders Overview</h2>

          <div className="order-status-list">
            <span>
              <i className="pending" />
              Pending
              <b>24</b>
            </span>
            <span>
              <i className="processing" />
              Processing
              <b>68</b>
            </span>
            <span>
              <i className="shipped" />
              Shipped
              <b>982</b>
            </span>
            <span>
              <i className="delivered" />
              Delivered
              <b>1,024</b>
            </span>
            <span>
              <i className="cancelled" />
              Cancelled
              <b>32</b>
            </span>
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-card recent-orders-card">
          <div className="dashboard-card-heading">
            <h2>Recent Orders</h2>
          </div>

          <div className="dashboard-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>
                      <span
                        className={`dashboard-status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card update-card">
          <div className="dashboard-card-heading">
            <h2>Recent Product Updates</h2>
            <button type="button">View all</button>
          </div>

          <div className="update-list">
            {updates.map((update) => (
              <div key={update.name}>
                <span className="update-thumbnail">
                  {update.name.slice(0, 1)}
                </span>

                <p>
                  <strong>{update.name}</strong>
                  <small>{update.action}</small>
                </p>

                <time>{update.time}</time>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminHome;