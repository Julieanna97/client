import {
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import RevenueChart from "../../components/admin/RevenueChart";
import {
  formatSek,
  numberValue,
  useAdminData,
} from "../../hooks/useAdminData";
import "../../Admin.css";

const AdminHome = () => {
  const {
    products,
    customers,
    orders,
    orderDetails,
    loading,
    error,
    reload,
  } = useAdminData();

  const [periodDays, setPeriodDays] = useState(30);

  const totalOrderValue = useMemo(
    () =>
      orders.reduce(
        (total, order) =>
          total + numberValue(order.total_price),
        0,
      ),
    [orders],
  );

  const averageOrderValue =
    orders.length > 0
      ? totalOrderValue / orders.length
      : 0;

  const inventory = useMemo(() => {
    const inStock = products.filter(
      (product) => numberValue(product.stock) > 5,
    ).length;

    const lowStock = products.filter((product) => {
      const stock = numberValue(product.stock);

      return stock > 0 && stock <= 5;
    }).length;

    const outOfStock = products.filter(
      (product) => numberValue(product.stock) <= 0,
    ).length;

    return {
      inStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  const topProducts = useMemo(() => {
    const totals = new Map<
      string,
      {
        productId: number;
        name: string;
        sales: number;
        revenue: number;
        image?: string;
      }
    >();

    for (const order of orderDetails) {
      for (const item of order.order_items || []) {
        const key =
          item.product_id > 0
            ? String(item.product_id)
            : item.product_name;

        const product = products.find(
          (entry) => entry.id === item.product_id,
        );

        const current = totals.get(key) || {
          productId: item.product_id,
          name: item.product_name,
          sales: 0,
          revenue: 0,
          image: product?.image,
        };

        current.sales += numberValue(item.quantity);
        current.revenue +=
          numberValue(item.quantity) *
          numberValue(item.unit_price);

        totals.set(key, current);
      }
    }

    return Array.from(totals.values())
      .sort(
        (first, second) =>
          second.revenue - first.revenue,
      )
      .slice(0, 5);
  }, [orderDetails, products]);

  const orderStatusCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const order of orders) {
      const status =
        order.order_status?.trim() || "Pending";

      counts.set(status, (counts.get(status) || 0) + 1);
    }

    return counts;
  }, [orders]);

  const recentProducts = [...products]
    .sort((first, second) => second.id - first.id)
    .slice(0, 5);

  const metrics = [
    {
      label: "Total Orders",
      value: orders.length.toLocaleString(),
      description: "View all orders",
      icon: FiShoppingBag,
      path: "/admin/orders",
      tone: "pink",
    },
    {
      label: "Total Customers",
      value: customers.length.toLocaleString(),
      description: "Open customer records",
      icon: FiUsers,
      path: "/admin/customers",
      tone: "orange",
    },
    {
      label: "Order Value",
      value: formatSek(totalOrderValue),
      description: `Average ${formatSek(
        averageOrderValue,
      )}`,
      icon: FiDollarSign,
      path: "/admin/analytics",
      tone: "peach",
    },
    {
      label: "Products",
      value: products.length.toLocaleString(),
      description: `${inventory.lowStock} low-stock products`,
      icon: FiPackage,
      path: "/admin/inventory",
      tone: "rose",
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    );
  }

  const totalProducts = Math.max(products.length, 1);
  const inStockPercent =
    (inventory.inStock / totalProducts) * 100;
  const lowStockPercent =
    (inventory.lowStock / totalProducts) * 100;

  return (
    <div className="dashboard-page">
      <div className="admin-page-toolbar">
        <div>
          <p className="admin-page-eyebrow">
            Live store overview
          </p>
          <h1>Dashboard</h1>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={() => void reload()}
        >
          <FiRefreshCw />
          Refresh data
        </button>
      </div>

      {error && (
        <div className="admin-data-warning">
          {error}
        </div>
      )}

      <section className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Link
              to={metric.path}
              className="metric-card interactive-metric-card"
              key={metric.label}
            >
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </div>

              <span
                className={`metric-icon ${metric.tone}`}
              >
                <Icon />
              </span>

              <small>
                {metric.description}
                <FiArrowRight />
              </small>
            </Link>
          );
        })}
      </section>

      <section className="dashboard-top-grid">
        <article className="dashboard-card revenue-card">
          <div className="dashboard-card-heading">
            <div>
              <h2>Revenue Overview</h2>

              <div className="revenue-total">
                <strong>
                  {formatSek(totalOrderValue)}
                </strong>

                <span>
                  {orders.length} recorded orders
                </span>
              </div>
            </div>

            <div className="admin-period-selector">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={
                    periodDays === days
                      ? "is-active"
                      : ""
                  }
                  onClick={() => setPeriodDays(days)}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>

          <RevenueChart
            orders={orders}
            days={periodDays}
          />
        </article>

        <article className="dashboard-card top-products-card">
          <div className="dashboard-card-heading">
            <h2>Top Selling Products</h2>

            <Link
              to="/admin/products"
              className="dashboard-view-link"
            >
              View all
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="admin-compact-empty">
              Product sales appear after orders contain
              item data.
            </div>
          ) : (
            <div className="top-products-list">
              {topProducts.map((product) => (
                <Link
                  to={
                    product.productId
                      ? `/product/${product.productId}`
                      : "/admin/products"
                  }
                  className="top-product"
                  key={`${product.productId}-${product.name}`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                    />
                  ) : (
                    <span className="admin-product-initial">
                      {product.name.slice(0, 1)}
                    </span>
                  )}

                  <div>
                    <strong>{product.name}</strong>
                  </div>

                  <div>
                    <strong>
                      {formatSek(product.revenue)}
                    </strong>
                    <small>
                      {product.sales} sold
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-middle-grid">
        <Link
          to="/admin/inventory"
          className="dashboard-card inventory-card dashboard-card-link"
        >
          <h2>Inventory Overview</h2>

          <div className="inventory-content">
            <div
              className="inventory-donut"
              style={{
                background: `conic-gradient(
                  #b46063 0 ${inStockPercent}%,
                  #ee9ba7 ${inStockPercent}% ${
                    inStockPercent + lowStockPercent
                  }%,
                  #f3d7dc ${
                    inStockPercent + lowStockPercent
                  }% 100%
                )`,
              }}
            >
              <div>
                <strong>{products.length}</strong>
                <span>Total products</span>
              </div>
            </div>

            <div className="inventory-legend">
              <span>
                <i className="in-stock" />
                <b>In stock</b>
                <small>{inventory.inStock}</small>
              </span>

              <span>
                <i className="low-stock" />
                <b>Low stock</b>
                <small>{inventory.lowStock}</small>
              </span>

              <span>
                <i className="out-stock" />
                <b>Out of stock</b>
                <small>{inventory.outOfStock}</small>
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="dashboard-card order-overview-card dashboard-card-link"
        >
          <h2>Orders Overview</h2>

          <div className="order-status-list">
            {[
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <span key={status}>
                <i
                  className={status.toLowerCase()}
                />
                {status}
                <b>{orderStatusCounts.get(status) || 0}</b>
              </span>
            ))}
          </div>
        </Link>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-card recent-orders-card">
          <div className="dashboard-card-heading">
            <h2>Recent Orders</h2>

            <Link
              to="/admin/orders"
              className="dashboard-view-link"
            >
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="admin-compact-empty">
              No orders have been recorded.
            </div>
          ) : (
            <div className="dashboard-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          to={`/admin/orders/${order.id}`}
                        >
                          #{order.id}
                        </Link>
                      </td>

                      <td>
                        {[
                          order.customer_firstname,
                          order.customer_lastname,
                        ]
                          .filter(Boolean)
                          .join(" ") || "Customer"}
                      </td>

                      <td>
                        {new Date(
                          order.created_at,
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span
                          className={`dashboard-status ${order.order_status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.order_status}
                        </span>
                      </td>

                      <td>
                        {formatSek(
                          numberValue(
                            order.total_price,
                          ),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="dashboard-card update-card">
          <div className="dashboard-card-heading">
            <h2>Product Inventory</h2>

            <Link
              to="/admin/inventory"
              className="dashboard-view-link"
            >
              Manage
            </Link>
          </div>

          <div className="update-list">
            {recentProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="update-product-image"
                  />
                ) : (
                  <span className="update-thumbnail">
                    {product.name.slice(0, 1)}
                  </span>
                )}

                <p>
                  <strong>{product.name}</strong>
                  <small>
                    {numberValue(product.stock)} in stock
                  </small>
                </p>

                <FiArrowRight />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminHome;