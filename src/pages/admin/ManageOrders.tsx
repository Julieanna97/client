import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";
import "../../Admin.css";

interface Order {
  id: number;
  customer_id: number;
  total_price: number | string;
  payment_status: string;
  payment_id: string;
  order_status: string;
  created_at: string;
}

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so order changes are disabled.");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-panel">
      <section className="admin-hero">
        <p className="eyebrow">Admin / orders</p>
        <h1>Orders</h1>
        <p>
          Orders are created when a visitor completes the checkout flow. This
          screen demonstrates how order management is displayed in the admin
          area.
        </p>
      </section>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="eyebrow">Order #{order.id}</p>
                  <h2>{Number(order.total_price).toFixed(2)} SEK</h2>
                </div>

                <span className="status-pill">{order.order_status}</span>
              </div>

              <p>
                <strong>Customer ID:</strong> {order.customer_id}
              </p>

              <p>
                <strong>Payment:</strong> {order.payment_status}
              </p>

              <p>
                <strong>Payment ID:</strong> {order.payment_id || "N/A"}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>

              <div className="actions">
                <Link to={`/admin/orders/${order.id}`} className="link-button">
                  View details
                </Link>

                <button
                  type="button"
                  className="disabled-demo-button"
                  onClick={showReadOnlyMessage}
                >
                  Update disabled
                </button>

                <button
                  type="button"
                  className="disabled-demo-button"
                  onClick={showReadOnlyMessage}
                >
                  Delete disabled
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
