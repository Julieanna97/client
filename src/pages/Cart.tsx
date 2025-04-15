import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Cart.css"; // ✅ Import CSS

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Fetch latest products and update cart prices
  const fetchLatestProductInfo = async (storedCart: CartItem[]) => {
    try {
      const response = await axios.get("https://ecommerce-api-new-two.vercel.app/products");
      const latestProducts = response.data;

      const updatedCart = storedCart.map((item) => {
        const latestProduct = latestProducts.find(
          (product: any) => product.id === item.id
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
      console.error("Failed to fetch latest product info", error);
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
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cart.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div>
                <h2 className="cart-item-name">{item.name}</h2>
                <p className="cart-item-price">${item.price}</p>
              </div>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="cart-item-quantity"
              />
              <button onClick={() => removeItem(item.id)} className="cart-remove-button">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: ${getTotal().toFixed(2)}</h2>
        <button onClick={() => navigate("/checkout")} className="cart-checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
