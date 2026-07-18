import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";
import "../../Admin.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number | string;
  stock: number;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so the live portfolio database stays safe.");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="loading-state">Loading products...</p>;

  return (
    <div className="admin-panel">
      <section className="admin-hero">
        <p className="eyebrow">Admin / products</p>
        <h1>Product catalog</h1>
        <p>
          This table shows the products saved in the Aiven MySQL database and
          displayed in the live shop.
        </p>

        <button type="button" className="disabled-demo-button" onClick={showReadOnlyMessage}>
          + Create Product disabled in demo
        </button>
      </section>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Preview</th>
                <th>Demo actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{Number(product.price).toFixed(2)} SEK</td>
                  <td>{product.stock}</td>
                  <td>
                    <Link to={`/product/${product.id}`} className="link-button">
                      View
                    </Link>
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className="disabled-demo-button"
                      onClick={showReadOnlyMessage}
                    >
                      Edit disabled
                    </button>
                    <button
                      type="button"
                      className="disabled-demo-button"
                      onClick={showReadOnlyMessage}
                    >
                      Delete disabled
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
