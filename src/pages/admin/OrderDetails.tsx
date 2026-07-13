import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";

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

  const deleteItem = async (itemId: number) => {
    if (!window.confirm("Are you sure you want to remove this item?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/order-items/${itemId}`);
      fetchOrder();
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Error deleting item.");
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/order-items/${itemId}`, {
        quantity,
      });

      fetchOrder();
    } catch (err) {
      console.error("Failed to update quantity", err);
      alert("Error updating quantity.");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return null;

  return (
    <div>
      <h1>Order #{order.id}</h1>

      <div>
        <h2>Customer Info</h2>

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
        <h2>Order Items</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>

                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  />
                </td>

                <td>{Number(item.unit_price).toFixed(2)} SEK</td>

                <td>
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
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

      <div>Total: {Number(order.total_price).toFixed(2)} SEK</div>
    </div>
  );
};

export default OrderDetails;