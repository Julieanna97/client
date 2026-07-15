import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import "../Products.css";

interface Product {
    id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  image: string;
  external_url?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const ALLOWED_SITE = "nailcandimd.com";

const normalize = (value = "") => {
  return value.toLowerCase().trim();
};

const productMatchesQuery = (product: Product, query: string) => {
  const searchText = normalize(`
    ${product.name}
    ${product.description}
    ${product.category}
    ${product.external_url || ""}
  `);

  const queryWords = normalize(query)
    .split(" ")
    .filter((word) => word.length > 0);

  return queryWords.every((word) => searchText.includes(word));
};

const isImportedProduct = (product: Product) => {
  return product.external_url?.includes(ALLOWED_SITE);
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/products`);

      const allProducts: Product[] = Array.isArray(response.data)
        ? response.data
        : [];

      const matched = allProducts.filter((product) => {
        return isImportedProduct(product) && productMatchesQuery(product, query);
      });

      setProducts(allProducts);
      setFilteredProducts(matched);
    } catch (err) {
      console.error("Could not fetch products:", err);
      setError(
        "Could not load products from your database. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
    navigate("/cart");
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);

  return (
    <div className="products-page">
      <h1 className="products-title">Search Results for: "{query}"</h1>

      <p>
        These results are products saved in your e-shop database and matched
        from the custom Nail Candi search project.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/search-import?q=${encodeURIComponent(query)}`}>
          Import products from custom search →
        </Link>
      </div>

      {loading && <p>Loading search results...</p>}

      {error && <p className="no-products">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No saved products found for "{query}".</p>
          <p>
            Use the import helper to add matching products from Nail Candi into
            your database first.
          </p>
        </div>
      )}

      <div className="products-container">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            )}

            <h2 className="product-title">{product.name}</h2>

            <p>{product.description}</p>

            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <p>
              <strong>Price:</strong> {Number(product.price).toFixed(2)} SEK
            </p>

            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            <div>
              <Link to={`/product/${product.id}`}>View Product →</Link>
            </div>

            <br />

            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", opacity: 0.7 }}>
        Total saved Nail Candi products in database:{" "}
        {products.filter(isImportedProduct).length}
      </p>
    </div>
  );
};

export default SearchResults;