import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Order {
  id: number;
  customer_id: number;
  total_price: number;
  payment_status: string;
  payment_id: string;
  order_status: string;
  created_at: string;
}

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://ecommerce-api-new-two.vercel.app/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`https://ecommerce-api-new-two.vercel.app/orders/${orderId}`, {
        order_status: newStatus,
      });
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`https://ecommerce-api-new-two.vercel.app/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <h1>Manage Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer ID:</strong> {order.customer_id}</p>
              <p><strong>Total Price:</strong> {order.total_price} SEK</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
              <p><strong>Payment ID:</strong> {order.payment_id || "N/A"}</p>
              <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <div>
                <label>Order Status:</label>
                <select
                  value={order.order_status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Received">Received</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete Order
                </button>
                <Link
                  to={`/admin/orders/${order.id}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
