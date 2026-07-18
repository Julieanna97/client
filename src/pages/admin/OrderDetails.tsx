import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import "../../Admin.css";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

interface OrderDetails {
  id: number;
  customer_id: number;
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

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order", err);
      alert("Order not found.");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so order item changes are disabled.");
  };

  useEffect(() => {
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <p className="loading-state">Loading order details...</p>;
  if (!order) return null;

  return (
    <div className="admin-panel">
      <section className="admin-hero">
        <Link to="/admin/orders" className="muted-link">
          ← Back to orders
        </Link>
        <p className="eyebrow">Admin / order details</p>
        <h1>Order #{order.id}</h1>
        <p>
          Detailed view of the customer, payment status and order items created
          through the checkout flow.
        </p>
      </section>

      <div className="order-card">
        <h2>Customer info</h2>

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

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit price</th>
              <th>Demo actions</th>
            </tr>
          </thead>

          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{Number(item.unit_price).toFixed(2)} SEK</td>
                <td>
                  <button
                    type="button"
                    className="disabled-demo-button"
                    onClick={showReadOnlyMessage}
                  >
                    Editing disabled
                  </button>
                </td>
              </tr>
            ))}

            {order.order_items.length === 0 && (
              <tr>
                <td colSpan={4}>No items in this order.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="order-card">
        <h2>Total: {Number(order.total_price).toFixed(2)} SEK</h2>
        <p>
          <strong>Payment:</strong> {order.payment_status}
        </p>
        <p>
          <strong>Status:</strong> {order.order_status}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
