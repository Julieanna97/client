import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";

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

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}`, {
        order_status: newStatus,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order.");
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>

              <p>
                <strong>Customer ID:</strong> {order.customer_id}
              </p>

              <p>
                <strong>Total Price:</strong>{" "}
                {Number(order.total_price).toFixed(2)} SEK
              </p>

              <p>
                <strong>Payment Status:</strong> {order.payment_status}
              </p>

              <p>
                <strong>Payment ID:</strong> {order.payment_id || "N/A"}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>

              <div>
                <label>Order Status:</label>

                <select
                  value={order.order_status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Received">Received</option>
                </select>
              </div>

              <div>
                <button onClick={() => deleteOrder(order.id)}>
                  Delete Order
                </button>

                <Link to={`/admin/orders/${order.id}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;