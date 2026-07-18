import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Cart.css";
import { API_BASE_URL } from "../lib/api";

interface CartItem {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
}

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    return JSON.parse(localStorage.getItem("customerInfo") || "null") || {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      street_address: "",
      postal_code: "",
      city: "",
      country: "",
    };
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    if (storedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const updatedInfo = {
      ...customerInfo,
      [name]: value,
    };

    setCustomerInfo(updatedInfo);
    localStorage.setItem("customerInfo", JSON.stringify(updatedInfo));
  };

  const updateQuantity = (id: number, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (updatedCart.length === 0) {
      navigate("/cart");
    }
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (Object.values(customerInfo).some((field) => field.trim() === "")) {
      alert("Please fill out all customer fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/stripe/create-checkout-session-hosted`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems: cart,
            customerInfo,
          }),
        }
      );

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error("Checkout response:", data);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <section className="checkout-page">
      <div>
        <p className="eyebrow">Secure checkout</p>
        <h1>Complete your order</h1>
      </div>

      <div className="checkout-grid">
        <div className="checkout-card">
          <h2>Your cart</h2>

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div>
                <strong>{item.name}</strong>
                <p>
                  {Number(item.price).toFixed(2)} SEK x {item.quantity}
                </p>
              </div>

              <div className="cart-item-actions">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value))
                  }
                />

                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total: {getTotal().toFixed(2)} SEK</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Customer information</h2>

          {Object.entries(customerInfo).map(([key, value]) => (
            <div key={key}>
              <label>{key.replace("_", " ")}</label>

              <input
                type="text"
                name={key}
                value={String(value)}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Redirecting to Stripe..." : "Proceed to payment"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
