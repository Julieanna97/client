import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface SearchItem {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_thumbnail?: { src: string }[];
  };
}

interface Product {
  id: number;
  name: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const apiKey = "AIzaSyDAcq7_76H9eGpJilQFsYi51Jjpu-V6D1o";
      const cx = "a0975493ac0ae4269";

      if (!apiKey || !cx) {
        setError("Missing API credentials.");
        return;
      }

      if (query.length < 3) {
        setError("Search term must be at least 3 characters.");
        return;
      }

      try {
        const [googleRes, localRes] = await Promise.all([
          axios.get("https://www.googleapis.com/customsearch/v1", {
            params: { key: apiKey, cx, q: query },
          }),
          axios.get("https://ecommerce-api-new-two.vercel.app/products"), // ✅ Your API for products
        ]);

        setResults(googleRes.data.items || []);
        setProducts(localRes.data || []);
      } catch (err) {
        console.error("❌ Search error:", err);
        setError("Failed to fetch search results.");
      }
    };

    fetchResults();
  }, [query]);

  const matchToLocalProduct = (title: string) => {
    return products.find((product) =>
      title.toLowerCase().includes(product.name.toLowerCase())
    );
  };

  return (
    <div>
      <h1>Search Results for: "{query}"</h1>
      {error && <p>{error}</p>}
      {results.length === 0 && !error && <p>No results found.</p>}

      <div>
        {results.map((item, i) => {
          const matchedProduct = matchToLocalProduct(item.title);
          return (
            <div key={i} className="border p-4 rounded shadow">
              {item.pagemap?.cse_thumbnail ? (
                <img
                  src={item.pagemap.cse_thumbnail[0].src}
                  alt={item.title}
                />
              ) : (
                <img
                  src="/no-image.png"
                  alt="No thumbnail"
                />
              )}
              <h2>{item.title}</h2>
              <p>{item.snippet}</p>
              {matchedProduct ? (
                <Link
                  to={`/product/${matchedProduct.id}`}
                >
                  View on Your Shop →
                </Link>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View External →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
