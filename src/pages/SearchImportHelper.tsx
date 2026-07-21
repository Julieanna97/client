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
    result.richSnippet?.metatags || result.pagemap?.metatags?.[0] || {};

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
    description: result.contentNoFormatting || stripHtml(result.content || ""),
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
      alert("Product added to the catalog.");
    } catch (err) {
      console.error("Could not save product:", err);
      alert("Could not save product. Please check the server connection.");
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
      _promos: unknown,
      rawResults: GoogleElementResult[]
    ) => {
      console.log("Supplier search:", gname, searchQuery);

      const convertedResults = (rawResults || [])
        .map(convertGoogleResult)
        .filter(isFromAllowedWebsite);

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
        setError("The supplier finder could not be loaded.");
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
        setError("The supplier finder could not be created.");
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
      setError("The supplier finder could not be loaded.");
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

      <section className="shop-hero">
        <p className="eyebrow">Studio tools</p>
        <h1 className="products-title">Supplier product finder</h1>
        <p>
          Find supplier listings and save selected items into the shop catalog.
        </p>
      </section>

      <div className="quick-searches">
        {["pink", "duck nails", "almond nails", "coffin nails", "luxury nails"].map(
          (term) => (
            <a key={term} href={`/admin/import?q=${encodeURIComponent(term)}`}>
              {term}
            </a>
          )
        )}
      </div>

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

      {loading && <p className="loading-state">Finding products...</p>}

      {error && <p className="no-products">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="no-products">No supplier results found.</p>
      )}

      <div className="products-container">
        {results.map((product) => (
          <article key={product.externalUrl} className="product-card">
            <div className="product-image-wrap">
              <img
                src={product.image || "/no-image.png"}
                alt={product.title}
                className="product-image"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/no-image.png";
                }}
              />
            </div>

            <div className="product-card-content">
              <p className="product-category">Supplier listing</p>
              <h2 className="product-title">{product.title}</h2>
              <p className="product-description">{product.description}</p>

              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="muted-link"
              >
                View supplier page ↗
              </a>

              <button type="button" onClick={() => saveProductToStore(product)}>
                Add to catalog
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SearchImportHelper;
