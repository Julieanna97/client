import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import "../Products.css";

declare global {
  interface Window {
    __gcse?: any;
    google?: any;
  }
}

interface GoogleElementResult {
  content?: string;
  contentNoFormatting?: string;
  title?: string;
  titleNoFormatting?: string;
  url?: string;
  visibleUrl?: string;
  thumbnailImage?: {
    url?: string;
    width?: string;
    height?: string;
  };
  richSnippet?: {
    metatags?: Record<string, string>;
  };
  pagemap?: {
    cse_image?: { src: string }[];
    cse_thumbnail?: { src: string }[];
    metatags?: Record<string, string>[];
  };
}

interface SearchProduct {
  title: string;
  description: string;
  image: string;
  externalUrl: string;
  displayLink: string;
}

const CX = "a0975493ac0ae4269";
const ALLOWED_SITE = "nailcandimd.com";

const stripHtml = (text = "") => {
  return text.replace(/<[^>]*>/g, "");
};

const getRealUrl = (googleUrl = "") => {
  try {
    const url = new URL(googleUrl);
    return url.searchParams.get("q") || googleUrl;
  } catch {
    return googleUrl;
  }
};

const getImage = (result: GoogleElementResult) => {
  const metatags =
    result.richSnippet?.metatags ||
    result.pagemap?.metatags?.[0] ||
    {};

  return (
    metatags.ogImage ||
    metatags["og:image"] ||
    metatags.twitterImage ||
    metatags["twitter:image"] ||
    result.pagemap?.cse_image?.[0]?.src ||
    result.pagemap?.cse_thumbnail?.[0]?.src ||
    result.thumbnailImage?.url ||
    "/no-image.png"
  );
};

const convertGoogleResult = (result: GoogleElementResult): SearchProduct => {
  const realUrl = getRealUrl(result.url || "");

  return {
    title: result.titleNoFormatting || stripHtml(result.title || ""),
    description:
      result.contentNoFormatting || stripHtml(result.content || ""),
    image: getImage(result),
    externalUrl: realUrl,
    displayLink: result.visibleUrl || "",
  };
};

const isFromAllowedWebsite = (result: SearchProduct) => {
  return (
    result.displayLink.includes(ALLOWED_SITE) ||
    result.externalUrl.includes(ALLOWED_SITE)
  );
};

const SearchImportHelper = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveProductToStore = async (product: SearchProduct) => {
    const priceInput = window.prompt("Enter price in SEK:", "149");
    if (priceInput === null) return;

    const stockInput = window.prompt("Enter stock quantity:", "10");
    if (stockInput === null) return;

    const price = Number(priceInput.replace(",", "."));
    const stock = Number(stockInput);

    if (Number.isNaN(price) || Number.isNaN(stock)) {
      alert("Please enter valid numbers.");
      return;
    }

    const payload = {
      name: product.title,
      description: product.description,
      price,
      stock,
      category: "Press On Nails",
      image: product.image,
      external_url: product.externalUrl,
    };

    try {
      await axios.post(`${API_BASE_URL}/products`, payload);

      alert("Product added to your store database!");
    } catch (err) {
      console.error("Could not save product:", err);
      alert(
        "Could not save product. Make sure backend is running and external_url exists in products table."
      );
    }
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError("");
    setResults([]);

    const handleResultsReady = (
      gname: string,
      searchQuery: string,
      promos: unknown,
      rawResults: GoogleElementResult[]
    ) => {
      console.log("Google search engine:", gname);
      console.log("Search query:", searchQuery);
      console.log("Raw Google results:", rawResults);

      const convertedResults = (rawResults || [])
        .map(convertGoogleResult)
        .filter(isFromAllowedWebsite);

      console.log("Converted Nail Candi results:", convertedResults);

      setResults(convertedResults);
      setLoading(false);

      return false;
    };

    window.__gcse = {
      parsetags: "explicit",
      searchCallbacks: {
        web: {
          ready: handleResultsReady,
        },
      },
    };

    const renderAndSearch = () => {
      const container = document.getElementById("google-cse-import-results");

      if (!container || !window.google?.search?.cse?.element) {
        setError("Google search element could not be loaded.");
        setLoading(false);
        return;
      }

      const existingElement =
        window.google.search.cse.element.getElement("importresults");

      if (existingElement) {
        existingElement.execute(query);
        return;
      }

      window.google.search.cse.element.render({
        div: "google-cse-import-results",
        tag: "searchresults-only",
        gname: "importresults",
      });

      const element =
        window.google.search.cse.element.getElement("importresults");

      if (element) {
        element.execute(query);
      } else {
        setError("Google search element could not be created.");
        setLoading(false);
      }
    };

    const existingScript = document.querySelector(
      'script[src*="cse.google.com/cse.js"]'
    );

    if (existingScript) {
      setTimeout(renderAndSearch, 200);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://cse.google.com/cse.js?cx=${CX}`;
    script.async = true;
    script.onload = () => {
      setTimeout(renderAndSearch, 200);
    };
    script.onerror = () => {
      setError("Could not load Google Programmable Search script.");
      setLoading(false);
    };

    document.body.appendChild(script);
  }, [query]);

  return (
    <div className="products-page">
      <style>
        {`
          .gsc-results-wrapper-overlay,
          .gsc-modal-background-image,
          .gsc-resultsbox-visible,
          .gsc-control-cse,
          .gcsc-find-more-on-google {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}
      </style>

      <h1 className="products-title">Import Products for: "{query}"</h1>

      <div style={{ marginBottom: "1rem" }}>
        <p>Try common Nail Candi searches:</p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            "nails",
            "press on nails",
            "duck nails",
            "almond nails",
            "coffin nails",
            "ballerina nails",
            "hand painted nails",
            "luxury nails",
            "mystery set",
            "gift card",
          ].map((term) => (
            <a
              key={term}
              href={`/search-import?q=${encodeURIComponent(term)}`}
              style={{
                padding: "0.4rem 0.7rem",
                border: "1px solid #ddd",
                borderRadius: "999px",
                textDecoration: "none",
              }}
            >
              {term}
            </a>
          ))}
        </div>
      </div>

      <p>
        These are results from your custom Google search engine. Add the ones
        you want into your own e-shop database.
      </p>

      <div
        id="google-cse-import-results"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      ></div>

      {loading && <p>Loading import results...</p>}

      {error && <p className="no-products">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="no-products">No import results found.</p>
      )}

      <div className="products-container">
        {results.map((product) => (
          <div key={product.externalUrl} className="product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
            )}

            <h2 className="product-title">{product.title}</h2>

            <p>{product.description}</p>

            <p>
              <strong>Source:</strong> {product.displayLink}
            </p>

            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View original source ↗
            </a>

            <br />
            <br />

            <button type="button" onClick={() => saveProductToStore(product)}>
              Add to My Store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchImportHelper;