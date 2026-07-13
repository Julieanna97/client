import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

  if (loading) return <p>Loading order confirmation...</p>;
  if (!order) return null;

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Your order has been received and is being processed.</p>

      <div>
        <h2>Customer Information</h2>

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

      <div>
        <h2>Order Summary</h2>

        <ul>
          {order.order_items.map((item) => (
            <li key={item.id} className="border-b pb-2">
              {item.product_name} x {item.quantity} —{" "}
              {(Number(item.unit_price) * item.quantity).toFixed(2)} SEK
            </li>
          ))}
        </ul>

        <p>Total: {Number(order.total_price).toFixed(2)} SEK</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;