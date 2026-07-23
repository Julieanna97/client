import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCheck, FiTruck } from "react-icons/fi";
import "../Cart.css";
import { API_BASE_URL } from "../lib/api";
import {
  FREE_SHIPPING_THRESHOLD_SEK,
  formatSek,
  getShippingFee,
} from "../lib/checkout";

interface CartItem {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  image: string;
  stock?: number;
}

interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string;
  stock: number;
}

const readStoredCart = (): CartItem[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem("cart") || "[]");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  useEffect(() => {
    let active = true;

    const fetchLatestProductInfo = async () => {
      const storedCart = readStoredCart();

      if (storedCart.length === 0) {
        if (active) {
          setCart([]);
          setLoading(false);
        }

        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        const latestProducts: Product[] = Array.isArray(response.data)
          ? response.data
          : [];

        const updatedCart = storedCart
          .map((item) => {
            const latestProduct = latestProducts.find(
              (product) => product.id === item.id,
            );

            if (!latestProduct) {
              return item;
            }

            const stock = Math.max(0, Number(latestProduct.stock) || 0);

            return {
              ...item,
              name: latestProduct.name,
              price: latestProduct.price,
              image: latestProduct.image,
              stock,
              quantity: Math.min(Math.max(item.quantity, 1), Math.max(stock, 1)),
            };
          })
          .filter((item) => Number(item.stock ?? 1) > 0);

        if (active) {
          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          window.dispatchEvent(new Event("cart-updated"));
        }
      } catch (error) {
        console.error("Failed to refresh cart items", error);

        if (active) {
          setCart(storedCart);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchLatestProductInfo();

    return () => {
      active = false;
    };
  }, []);

  const updateQuantity = (id: number, requestedQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const maximum =
        item.stock && item.stock > 0
          ? item.stock
          : Number.MAX_SAFE_INTEGER;

      const safeQuantity = Math.min(
        Math.max(Math.floor(requestedQuantity) || 1, 1),
        maximum,
      );

      return {
        ...item,
        quantity: safeQuantity,
      };
    });

    saveCart(updatedCart);
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
  const orderTotal = subtotal + shippingFee;

  const amountUntilFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD_SEK - subtotal,
    0,
  );

  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD_SEK) * 100,
    100,
  );

  if (loading) {
    return (
      <section className="cart-empty">
        <p>Loading your cart…</p>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="cart-empty">
        <p className="eyebrow">Your bag</p>
        <h1>Your cart is empty</h1>

        <p>
          Start with a set you love and come back when you are ready.
        </p>

        <Link to="/products" className="primary-link">
          Shop nails
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-container">
      <div className="cart-header">
        <p className="eyebrow">Your bag</p>
        <h1 className="cart-title">Shopping cart</h1>
        <p>Review your sets before heading to checkout.</p>
      </div>

      <div className="shipping-progress-card">
        <div className="shipping-progress-heading">
          <span className="shipping-progress-icon">
            {shippingFee === 0 ? <FiCheck /> : <FiTruck />}
          </span>

          <div>
            <strong>
              {shippingFee === 0
                ? "You qualify for free shipping"
                : `${formatSek(amountUntilFreeShipping)} away from free shipping`}
            </strong>

            <small>
              Free standard shipping on orders of{" "}
              {FREE_SHIPPING_THRESHOLD_SEK} SEK or more.
            </small>
          </div>
        </div>

        <div
          className="shipping-progress-track"
          aria-label={`${shippingProgress.toFixed(0)}% toward free shipping`}
        >
          <span style={{ width: `${shippingProgress}%` }} />
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/no-image.png";
                  }}
                />

                <div>
                  <h2 className="cart-item-name">{item.name}</h2>

                  <p className="cart-item-price">
                    {formatSek(Number(item.price))}
                  </p>
                </div>
              </div>

              <div className="cart-item-actions">
                <label>
                  Qty

                  <input
                    type="number"
                    min="1"
                    max={item.stock || undefined}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.id,
                        Number(event.target.value),
                      )
                    }
                    className="cart-item-quantity"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="cart-remove-button"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <p className="eyebrow">Order summary</p>

          <div className="cart-summary-lines">
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

            <div className="cart-summary-total">
              <span>Total</span>
              <strong>{formatSek(orderTotal)}</strong>
            </div>
          </div>

          <p className="cart-summary-note">
            The final total is verified securely before payment.
          </p>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="cart-checkout-button"
          >
            Continue to checkout
          </button>

          <Link to="/products" className="muted-link">
            Keep shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;