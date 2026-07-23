import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../Cart.css";
import { API_BASE_URL } from "../lib/api";
import {
  SHIPPING_COUNTRIES,
  formatSek,
  getShippingFee,
  isShippingCountryCode,
} from "../lib/checkout";
import type { ShippingCountryCode } from "../lib/checkout";

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
  country: ShippingCountryCode | "";
}

const defaultCustomerInfo: CustomerInfo = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  street_address: "",
  postal_code: "",
  city: "",
  country: "SE",
};

const readCustomerInfo = (): CustomerInfo => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem("customerInfo") || "null",
    );

    if (!parsed || typeof parsed !== "object") {
      return defaultCustomerInfo;
    }

    return {
      ...defaultCustomerInfo,
      ...parsed,
      country: isShippingCountryCode(parsed.country)
        ? parsed.country
        : "SE",
    };
  } catch {
    return defaultCustomerInfo;
  }
};

const readCart = (): CartItem[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem("cart") || "[]");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>(readCustomerInfo);

  useEffect(() => {
    const storedCart = readCart();

    setCart(storedCart);

    if (storedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const saveCustomerInfo = (updatedInfo: CustomerInfo) => {
    setCustomerInfo(updatedInfo);
    localStorage.setItem(
      "customerInfo",
      JSON.stringify(updatedInfo),
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    const updatedInfo = {
      ...customerInfo,
      [name]: value,
    } as CustomerInfo;

    saveCustomerInfo(updatedInfo);
  };

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));

    if (updatedCart.length === 0) {
      navigate("/cart");
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    saveCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(Math.floor(quantity) || 1, 1),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0,
  );

  const shippingFee = getShippingFee(subtotal);
  const total = subtotal + shippingFee;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (cart.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const requiredValues = [
      customerInfo.firstname,
      customerInfo.lastname,
      customerInfo.email,
      customerInfo.phone,
      customerInfo.street_address,
      customerInfo.postal_code,
      customerInfo.city,
      customerInfo.country,
    ];

    if (requiredValues.some((value) => value.trim() === "")) {
      setSubmitError("Please fill out all delivery details.");
      return;
    }

    if (!isShippingCountryCode(customerInfo.country)) {
      setSubmitError("Please select a supported delivery country.");
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
            cartItems: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            customerInfo,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({ error: "Invalid server response." }));

      if (!response.ok) {
        throw new Error(
          data.error || "Checkout could not be started.",
        );
      }

      if (!data.checkout_url) {
        throw new Error("The payment URL was not returned.");
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Checkout error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong during checkout.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <p className="eyebrow">Secure checkout</p>
        <h1>Complete your order</h1>
        <p>Enter your details and continue to secure payment.</p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-card">
          <h2>Your cart</h2>

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div>
                <strong>{item.name}</strong>

                <p>
                  {formatSek(Number(item.price))} × {item.quantity}
                </p>
              </div>

              <div className="cart-item-actions">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  aria-label={`Quantity for ${item.name}`}
                  onChange={(event) =>
                    updateQuantity(
                      item.id,
                      Number(event.target.value),
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="checkout-total-breakdown">
            <div>
              <span>Subtotal</span>
              <strong>{formatSek(subtotal)}</strong>
            </div>

            <div>
              <span>Standard shipping</span>

              <strong
                className={shippingFee === 0 ? "free-shipping-price" : ""}
              >
                {shippingFee === 0 ? "Free" : formatSek(shippingFee)}
              </strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatSek(total)}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Delivery details</h2>

          <div className="checkout-form-grid">
            <div>
              <label htmlFor="firstname">First name</label>

              <input
                id="firstname"
                name="firstname"
                value={customerInfo.firstname}
                onChange={handleInputChange}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label htmlFor="lastname">Last name</label>

              <input
                id="lastname"
                name="lastname"
                value={customerInfo.lastname}
                onChange={handleInputChange}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="checkout-form-wide">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="checkout-form-wide">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                autoComplete="tel"
                required
              />
            </div>

            <div className="checkout-form-wide">
              <label htmlFor="street_address">Street address</label>

              <input
                id="street_address"
                name="street_address"
                value={customerInfo.street_address}
                onChange={handleInputChange}
                autoComplete="street-address"
                required
              />
            </div>

            <div>
              <label htmlFor="postal_code">Postal code</label>

              <input
                id="postal_code"
                name="postal_code"
                value={customerInfo.postal_code}
                onChange={handleInputChange}
                autoComplete="postal-code"
                required
              />
            </div>

            <div>
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="checkout-form-wide">
              <label htmlFor="country">Country</label>

              <select
                id="country"
                name="country"
                value={customerInfo.country}
                onChange={handleInputChange}
                autoComplete="country"
                required
              >
                <option value="" disabled>
                  Select a country
                </option>

                {SHIPPING_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {submitError && (
            <p className="checkout-submit-error" role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Opening secure payment..."
              : `Proceed to payment · ${formatSek(total)}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;