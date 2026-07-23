import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import "../Cart.css";
import { API_BASE_URL } from "../lib/api";

interface OrderItem {
  id: number;
  product_id?: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

interface Order {
  id: number;
  customer_firstname: string;
  customer_lastname: string;
  customer_email: string;
  customer_phone: string;
  customer_street_address: string;
  customer_postal_code: string;
  customer_city: string;
  customer_country: string;
  total_price: number | string;
  payment_status: string;
  order_status: string;
  order_items: OrderItem[];
}

const numberValue = (
  value: number | string | undefined,
): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

const formatSek = (value: number): string =>
  `${value.toFixed(2)} SEK`;

const OrderConfirmation = () => {
  const location = useLocation();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const sessionId = new URLSearchParams(
    location.search,
  ).get("session_id");

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!sessionId) {
        setError(
          "The payment session could not be found.",
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await axios.get<Order>(
            `${API_BASE_URL}/orders/payment/${sessionId}`,
          );

        const orderData = response.data;

        await axios.patch(
          `${API_BASE_URL}/orders/${orderData.id}`,
          {
            payment_status: "Paid",
            order_status: "Received",
            payment_id: sessionId,
          },
        );

        if (!isMounted) {
          return;
        }

        setOrder({
          ...orderData,
          payment_status: "Paid",
          order_status: "Received",
        });

        localStorage.removeItem("cart");
        localStorage.removeItem(
          "customerInfo",
        );

        window.dispatchEvent(
          new Event("cart-updated"),
        );
      } catch (requestError) {
        console.error(
          "Failed to load order confirmation:",
          requestError,
        );

        if (isMounted) {
          setError(
            "We could not load your order details. Your payment may still have been completed.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const totals = useMemo(() => {
    if (!order) {
      return {
        subtotal: 0,
        shipping: 0,
        total: 0,
      };
    }

    const subtotal = order.order_items.reduce(
      (sum, item) =>
        sum +
        numberValue(item.unit_price) *
          numberValue(item.quantity),
      0,
    );

    const total = numberValue(
      order.total_price,
    );

    /*
     * The backend stores:
     * total_price = product subtotal + shipping.
     *
     * order_items contains only product lines, so the
     * difference is the shipping charge.
     */
    const shipping = Math.max(
      total - subtotal,
      0,
    );

    return {
      subtotal,
      shipping,
      total,
    };
  }, [order]);

  const hasFreeShipping =
    totals.shipping < 0.005;

  if (loading) {
    return (
      <main className="order-confirmation-page">
        <section className="order-card order-confirmation-loading">
          <p>
            Loading your order confirmation…
          </p>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-confirmation-page">
        <section className="order-card order-confirmation-error">
          <p className="eyebrow">
            Order confirmation
          </p>

          <h1>
            We couldn’t display your order.
          </h1>

          <p>
            {error ||
              "The requested order could not be found."}
          </p>

          <div className="hero-actions">
            <Link
              to="/"
              className="primary-link"
            >
              Return to the shop
            </Link>

            <Link
              to="/admin/orders"
              className="secondary-link"
            >
              View orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="order-confirmation-page">
      <header className="order-confirmation-header">
        <p className="eyebrow">
          Payment complete
        </p>

        <h1>
          Thank you for your purchase!
        </h1>

        <p>
          Your order has been received and
          saved in the admin dashboard.
        </p>
      </header>

      <div className="checkout-grid order-confirmation-grid">
        <section className="order-card">
          <h2>Customer information</h2>

          <div className="customer-information-list">
            <p>
              <strong>Name:</strong>{" "}
              {order.customer_firstname}{" "}
              {order.customer_lastname}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.customer_email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.customer_phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.customer_street_address},{" "}
              {order.customer_postal_code}{" "}
              {order.customer_city},{" "}
              {order.customer_country}
            </p>
          </div>
        </section>

        <section className="order-card">
          <h2>Order summary</h2>

          <div className="order-confirmation-items">
            {order.order_items.map(
              (item) => {
                const lineTotal =
                  numberValue(
                    item.unit_price,
                  ) *
                  numberValue(
                    item.quantity,
                  );

                return (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >
                    <span>
                      {item.product_name} ×{" "}
                      {item.quantity}
                    </span>

                    <strong>
                      {formatSek(lineTotal)}
                    </strong>
                  </div>
                );
              },
            )}
          </div>

          <div className="order-summary-totals">
            <div className="order-summary-row">
              <span>Subtotal</span>

              <strong>
                {formatSek(
                  totals.subtotal,
                )}
              </strong>
            </div>

            <div className="order-summary-row">
              <span>
                Standard shipping
              </span>

              <strong
                className={
                  hasFreeShipping
                    ? "order-summary-free"
                    : undefined
                }
              >
                {hasFreeShipping
                  ? "Free"
                  : formatSek(
                      totals.shipping,
                    )}
              </strong>
            </div>

            <div className="order-summary-row order-summary-total">
              <span>Total</span>

              <strong>
                {formatSek(totals.total)}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <div className="hero-actions">
        <Link
          to="/products"
          className="primary-link"
        >
          Continue shopping
        </Link>

        <Link
          to="/admin/orders"
          className="secondary-link"
        >
          View in admin demo
        </Link>
      </div>
    </main>
  );
};

export default OrderConfirmation;