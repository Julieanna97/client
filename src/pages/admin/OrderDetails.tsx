import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import { getShippingFee } from "../../lib/checkout";
import "../../Admin.css";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

interface OrderDetailsData {
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
  payment_status: string | null;
  order_status: string | null;
  order_items: OrderItem[];
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setLoading(false);
        navigate("/admin/orders", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get<OrderDetailsData>(
          `${API_BASE_URL}/orders/${id}`,
        );

        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
        alert("Order not found.");
        navigate("/admin/orders", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [id, navigate]);

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so order item changes are disabled.");
  };

  if (loading) {
    return (
      <p className="loading-state">
        Loading order details...
      </p>
    );
  }

  if (!order) {
    return (
      <p className="loading-state">
        Order not found.
      </p>
    );
  }

  const subtotal = order.order_items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unit_price);

    return sum + quantity * unitPrice;
  }, 0);

  // Shipping costs 49 SEK below 499 SEK.
  // Orders at or above 499 SEK receive free shipping.
  const shipping = getShippingFee(subtotal);
  const total = subtotal + shipping;

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

                <td>
                  {Number(item.unit_price).toFixed(2)} SEK
                </td>

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
        <p>
          <strong>Subtotal:</strong> {subtotal.toFixed(2)} SEK
        </p>

        <p>
          <strong>Shipping:</strong>{" "}
          {shipping === 0
            ? "FREE"
            : `${shipping.toFixed(2)} SEK`}
        </p>

        <h2>Total: {total.toFixed(2)} SEK</h2>

        <p>
          <strong>Payment:</strong>{" "}
          {order.payment_status || "Not recorded"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {order.order_status || "Not recorded"}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;