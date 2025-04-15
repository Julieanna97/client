import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
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

    // Optional: Redirect if cart is empty
    if (storedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...customerInfo, [name]: value };
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

    // Optional: Redirect if cart becomes empty
    if (updatedCart.length === 0) {
      navigate("/cart");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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

      const response = await fetch("https://ecommerce-api-new-two.vercel.app/stripe/create-checkout-session-hosted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart, customerInfo }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
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
    return <p className="text-center mt-8 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p>${item.price} x {item.quantity}</p>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              className="w-16 border rounded p-1 text-center"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Customer Form */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Customer Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {Object.entries(customerInfo).map(([key, value]) => (
          <div key={key}>
            <label className="block font-medium capitalize mb-1">{key.replace("_", " ")}:</label>
            <input
              type="text"
              name={key}
              value={String(value)}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white px-6 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700 transition"
          }`}
        >
          {loading ? "Redirecting to payment..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
