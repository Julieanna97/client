import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Cart.css";
import { API_BASE_URL } from "../lib/api";

interface CartItem {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchLatestProductInfo = async (storedCart: CartItem[]) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const latestProducts: Product[] = response.data;

      const updatedCart = storedCart.map((item) => {
        const latestProduct = latestProducts.find(
          (product) => product.id === item.id
        );

        if (latestProduct) {
          return {
            ...item,
            price: latestProduct.price,
            name: latestProduct.name,
            image: latestProduct.image,
          };
        }

        return item;
      });

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Failed to refresh cart items", error);
      setCart(storedCart);
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (storedCart.length > 0) {
      fetchLatestProductInfo(storedCart);
    } else {
      setCart([]);
    }
  }, []);

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
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  if (cart.length === 0) {
    return (
      <section className="cart-empty">
        <p className="eyebrow">Your bag</p>
        <h1>Your cart is empty</h1>
        <p>Start with a set you love and come back when you are ready.</p>
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
                    {Number(item.price).toFixed(2)} SEK
                  </p>
                </div>
              </div>

              <div className="cart-item-actions">
                <label>
                  Qty
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.id, Number(event.target.value))
                    }
                    className="cart-item-quantity"
                  />
                </label>

                <button
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
          <h2>{getTotal().toFixed(2)} SEK</h2>
          <p>Shipping and final payment are handled at checkout.</p>

          <button
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
