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
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const cx = import.meta.env.VITE_GOOGLE_CX;

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
          axios.get("https://ecommerce-api-new-two.vercel.app/products"),
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h1>
      {error && <p className="text-red-500">{error}</p>}
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

              {matchedProduct ? (
                <Link
                  to={`/product/${matchedProduct.id}`}
                  className="text-blue-500 underline mt-2 inline-block"
                >
                  View on Your Shop →
                </Link>
              ) : (
                <span className="text-gray-400 italic mt-2 inline-block cursor-not-allowed">
                  External link disabled
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
