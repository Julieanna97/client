import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Cart.css";
import { API_BASE_URL } from "../lib/api";

interface OrderItem {
  id: number;
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

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) {
      alert("No session ID found!");
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/payment/${sessionId}`
        );

        const orderData: Order = response.data;

        await axios.patch(`${API_BASE_URL}/orders/${orderData.id}`, {
          payment_status: "Paid",
          order_status: "Received",
          payment_id: sessionId,
        });

        setOrder(orderData);

        localStorage.removeItem("cart");
        localStorage.removeItem("customerInfo");
      } catch (error) {
        console.error("Failed to fetch order", error);
        alert("Order not found or something went wrong.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, navigate]);

  if (loading) return <p className="loading-state">Loading order confirmation...</p>;
  if (!order) return null;

  return (
    <section className="order-confirmation-page">
      <div>
        <p className="eyebrow">Payment complete</p>
        <h1>Thank you for your purchase!</h1>
        <p>Your order has been received and saved in the admin dashboard.</p>
      </div>

      <div className="checkout-grid">
        <div className="order-card">
          <h2>Customer information</h2>

          <p>
            <strong>Name:</strong> {order.customer_firstname}{" "}
            {order.customer_lastname}
          </p>

          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>

          <p>
            <strong>Phone:</strong> {order.customer_phone}
          </p>

          <p>
            <strong>Address:</strong> {order.customer_street_address},{" "}
            {order.customer_postal_code} {order.customer_city},{" "}
            {order.customer_country}
          </p>
        </div>

        <div className="order-card">
          <h2>Order summary</h2>

          {order.order_items.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>
                {item.product_name} x {item.quantity}
              </span>
              <strong>
                {(Number(item.unit_price) * item.quantity).toFixed(2)} SEK
              </strong>
            </div>
          ))}

          <h2>Total: {Number(order.total_price).toFixed(2)} SEK</h2>
        </div>
      </div>

      <div className="hero-actions">
        <Link to="/products" className="primary-link">
          Continue shopping
        </Link>
        <Link to="/admin/orders" className="secondary-link">
          View in admin demo
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;
