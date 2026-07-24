import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";
import { getShippingFee } from "../../lib/checkout";
import "../../Admin.css";

interface OrderSummary {
  id: number;
  customer_id: number;
  total_price: number | string;
  payment_status: string | null;
  payment_id: string | null;
  order_status: string | null;
  created_at: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number | string;
  unit_price: number | string;
}

interface OrderDetailsResponse {
  order_items?: OrderItem[];
}

interface DisplayOrder extends OrderSummary {
  subtotal: number;
  shipping: number;
  calculatedTotal: number;
}

const toNumber = (value: number | string): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const shortenPaymentId = (paymentId: string | null): string => {
  if (!paymentId) {
    return "N/A";
  }

  if (paymentId.length <= 29) {
    return paymentId;
  }

  return `${paymentId.slice(0, 25)}…`;
};

const getStatusTone = (status: string | null): string => {
  const normalizedStatus = status?.trim().toLowerCase();

  if (
    normalizedStatus === "received" ||
    normalizedStatus === "shipped" ||
    normalizedStatus === "completed"
  ) {
    return "is-success";
  }

  if (
    normalizedStatus === "pending" ||
    normalizedStatus === "processing"
  ) {
    return "is-pending";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "refunded"
  ) {
    return "is-danger";
  }

  return "is-neutral";
};

const getPaymentTone = (status: string | null): string => {
  const normalizedStatus = status?.trim().toLowerCase();

  if (normalizedStatus === "paid") {
    return "is-paid";
  }

  if (
    normalizedStatus === "unpaid" ||
    normalizedStatus === "failed"
  ) {
    return "is-unpaid";
  }

  return "is-neutral";
};

const ManageOrders = () => {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const ordersResponse = await axios.get<OrderSummary[]>(
          `${API_BASE_URL}/orders`,
        );

        const ordersWithTotals = await Promise.all(
          ordersResponse.data.map(
            async (order): Promise<DisplayOrder> => {
              try {
                const detailsResponse =
                  await axios.get<OrderDetailsResponse>(
                    `${API_BASE_URL}/orders/${order.id}`,
                  );

                const orderItems = Array.isArray(
                  detailsResponse.data.order_items,
                )
                  ? detailsResponse.data.order_items
                  : [];

                const subtotal = orderItems.reduce((sum, item) => {
                  return (
                    sum +
                    toNumber(item.quantity) *
                      toNumber(item.unit_price)
                  );
                }, 0);

                const shipping =
                  orderItems.length > 0
                    ? getShippingFee(subtotal)
                    : 0;

                const calculatedTotal =
                  orderItems.length > 0
                    ? subtotal + shipping
                    : toNumber(order.total_price);

                return {
                  ...order,
                  subtotal,
                  shipping,
                  calculatedTotal,
                };
              } catch (detailsError) {
                console.error(
                  `Failed to fetch order ${order.id}:`,
                  detailsError,
                );

                const storedTotal = toNumber(order.total_price);

                return {
                  ...order,
                  subtotal: storedTotal,
                  shipping: 0,
                  calculatedTotal: storedTotal,
                };
              }
            },
          ),
        );

        if (isMounted) {
          setOrders(ordersWithTotals);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);

        if (isMounted) {
          setErrorMessage("Unable to load orders.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const overview = useMemo(() => {
    const paidOrders = orders.filter(
      (order) =>
        order.payment_status?.trim().toLowerCase() === "paid",
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        order.order_status?.trim().toLowerCase() === "pending",
    ).length;

    const totalOrderValue = orders.reduce(
      (sum, order) => sum + order.calculatedTotal,
      0,
    );

    return {
      paidOrders,
      pendingOrders,
      totalOrderValue,
    };
  }, [orders]);

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so order changes are disabled.");
  };

  return (
    <div className="admin-panel orders-page">
      <section className="admin-hero">
        <p className="eyebrow">Admin / orders</p>

        <h1>Orders</h1>

        <p>
          Review customer purchases, payment information, order
          status and shipping totals.
        </p>
      </section>

      {loading ? (
        <p className="loading-state">Loading orders...</p>
      ) : errorMessage ? (
        <p className="loading-state">{errorMessage}</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <h2>No orders yet</h2>
          <p>Completed checkout orders will appear here.</p>
        </div>
      ) : (
        <>
          <section
            className="orders-overview"
            aria-label="Orders overview"
          >
            <article className="orders-stat-card">
              <span className="orders-stat-card__label">
                Total orders
              </span>

              <strong>{orders.length}</strong>

              <span className="orders-stat-card__caption">
                All recorded purchases
              </span>
            </article>

            <article className="orders-stat-card">
              <span className="orders-stat-card__label">
                Paid orders
              </span>

              <strong>{overview.paidOrders}</strong>

              <span className="orders-stat-card__caption">
                Successfully paid
              </span>
            </article>

            <article className="orders-stat-card">
              <span className="orders-stat-card__label">
                Pending orders
              </span>

              <strong>{overview.pendingOrders}</strong>

              <span className="orders-stat-card__caption">
                Awaiting processing
              </span>
            </article>

            <article className="orders-stat-card">
              <span className="orders-stat-card__label">
                Total order value
              </span>

              <strong>
                {overview.totalOrderValue.toFixed(2)}
                <small> SEK</small>
              </strong>

              <span className="orders-stat-card__caption">
                Including shipping
              </span>
            </article>
          </section>

          <section className="orders-grid">
            {orders.map((order) => (
              <article
                key={order.id}
                className="order-summary-card"
              >
                <header className="order-summary-card__header">
                  <div>
                    <span className="order-number">
                      Order #{order.id}
                    </span>

                    <h2>
                      {order.calculatedTotal.toFixed(2)}
                      <small> SEK</small>
                    </h2>
                  </div>

                  <span
                    className={`order-status-badge ${getStatusTone(
                      order.order_status,
                    )}`}
                  >
                    {order.order_status || "Not recorded"}
                  </span>
                </header>

                <div className="order-summary-card__meta">
                  <div className="order-meta-item">
                    <span>Customer</span>
                    <strong>#{order.customer_id}</strong>
                  </div>

                  <div className="order-meta-item">
                    <span>Payment</span>

                    <strong
                      className={`payment-status ${getPaymentTone(
                        order.payment_status,
                      )}`}
                    >
                      {order.payment_status || "Not recorded"}
                    </strong>
                  </div>

                  <div className="order-meta-item">
                    <span>Shipping</span>

                    <strong>
                      {order.shipping === 0
                        ? "FREE"
                        : `${order.shipping.toFixed(2)} SEK`}
                    </strong>
                  </div>

                  <div className="order-meta-item">
                    <span>Created</span>
                    <strong>{formatDate(order.created_at)}</strong>
                  </div>
                </div>

                <div className="payment-reference">
                  <span>Payment ID</span>

                  <code title={order.payment_id || undefined}>
                    {shortenPaymentId(order.payment_id)}
                  </code>
                </div>

                <footer className="order-summary-card__footer">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="order-view-link"
                  >
                    View details
                    <span aria-hidden="true">→</span>
                  </Link>

                  <div className="order-demo-actions">
                    <button
                      type="button"
                      onClick={showReadOnlyMessage}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      onClick={showReadOnlyMessage}
                    >
                      Delete
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default ManageOrders;