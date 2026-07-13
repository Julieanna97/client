import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

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
  const [localProductWarning, setLocalProductWarning] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const cx = import.meta.env.VITE_GOOGLE_CX;

      setError("");
      setLocalProductWarning("");
      setResults([]);

      if (!apiKey || !cx) {
        setError("Missing Google Custom Search API credentials.");
        return;
      }

      if (query.length < 3) {
        setError("Search term must be at least 3 characters.");
        return;
      }

      try {
        const googleRes = await axios.get(
          "https://www.googleapis.com/customsearch/v1",
          {
            params: {
              key: apiKey,
              cx,
              q: query,
            },
          }
        );

        setResults(googleRes.data.items || []);
      } catch (err) {
        console.error("Google search error:", err);
        setError(
          "Could not fetch external search results. Check your Google API key, search engine ID, or API restrictions."
        );
      }

      try {
        const localRes = await axios.get(`${API_BASE_URL}/products`);
        setProducts(localRes.data || []);
      } catch (err) {
        console.error("Local products error:", err);
        setLocalProductWarning(
          "Local shop products could not be loaded, but external search can still work."
        );
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for: "{query}"
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      {localProductWarning && (
        <p className="text-gray-500">{localProductWarning}</p>
      )}

      {results.length === 0 && !error && <p>No results found.</p>}

      <div className="grid gap-4">
        {results.map((item, i) => {
          const matchedProduct = matchToLocalProduct(item.title);

          return (
            <div key={i} className="border p-4 rounded shadow">
              {item.pagemap?.cse_thumbnail ? (
                <img
                  src={item.pagemap.cse_thumbnail[0].src}
                  alt={item.title}
                  className="w-32 h-32 object-cover mb-2"
                />
              ) : (
                <img
                  src="/no-image.png"
                  alt="No thumbnail"
                  className="w-32 h-32 object-cover mb-2"
                />
              )}

              <h2 className="text-lg font-semibold">{item.title}</h2>

              <p className="text-sm text-gray-700">{item.snippet}</p>

              <div className="mt-2">
                {matchedProduct && (
                  <Link
                    to={`/product/${matchedProduct.id}`}
                    className="text-blue-500 underline inline-block mr-4"
                  >
                    View on Your Shop →
                  </Link>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline inline-block"
                >
                  Open external result ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;