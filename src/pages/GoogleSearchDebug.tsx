import { useEffect } from "react";

declare global {
  interface Window {
    __gcse?: any;
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
}

interface TeacherStyleResult {
  displayLink: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  htmlSnippet: string;
  htmlTitle: string;
  kind: string;
  link: string;
  pagemap: {
    cse_image?: { src: string }[];
    cse_thumbnail?: { src: string }[];
    metatags?: Record<string, string>[];
  };
  snippet: string;
  title: string;
}

const stripHtml = (text = "") => {
  return text.replace(/<[^>]*>/g, "");
};

const getRealUrl = (googleUrl = "") => {
  try {
    const url = new URL(googleUrl);

    const realUrl = url.searchParams.get("q");

    return realUrl || googleUrl;
  } catch {
    return googleUrl;
  }
};

const makeTeacherStyleResult = (
  result: GoogleElementResult
): TeacherStyleResult => {
  const realLink = getRealUrl(result.url || "");
  const metatags = result.richSnippet?.metatags || {};
  const thumbnail = result.thumbnailImage?.url || "";
  const ogImage = metatags.ogImage || metatags["og:image"] || "";

  return {
    displayLink: result.visibleUrl || "",
    formattedUrl: realLink,
    htmlFormattedUrl: realLink,
    htmlSnippet: result.content || "",
    htmlTitle: result.title || "",
    kind: "customsearch#result",
    link: realLink,
    pagemap: {
      cse_image: ogImage ? [{ src: ogImage }] : [],
      cse_thumbnail: thumbnail ? [{ src: thumbnail }] : [],
      metatags: Object.keys(metatags).length > 0 ? [metatags] : [],
    },
    snippet: result.contentNoFormatting || stripHtml(result.content || ""),
    title: result.titleNoFormatting || stripHtml(result.title || ""),
  };
};

const GoogleSearchDebug = () => {
  useEffect(() => {
    const cx = "a0975493ac0ae4269";

    const handleResultsReady = (
      gname: string,
      searchQuery: string,
      _promos: unknown,
      rawResults: GoogleElementResult[]
    ) => {
      console.clear();

      const teacherStyleResults = (rawResults || []).map(makeTeacherStyleResult);

      console.log({
        kind: "customsearch#search",
        searchEngineName: gname,
        query: searchQuery,
        items: teacherStyleResults,
      });

      console.log("items:");
      console.log(teacherStyleResults);

      console.log("First item like teacher example:");
      console.log(teacherStyleResults[0]);

      console.log("First item pagemap:");
      console.log(teacherStyleResults[0]?.pagemap);

      console.table(
        teacherStyleResults.map((item) => ({
          title: item.title,
          link: item.link,
          displayLink: item.displayLink,
          image:
            item.pagemap.cse_image?.[0]?.src ||
            item.pagemap.cse_thumbnail?.[0]?.src ||
            "",
        }))
      );

      const productsForDatabase = teacherStyleResults.map((item) => ({
        name: item.title,
        description: item.snippet,
        price: 0,
        stock: 10,
        category: "Press On Nails",
        image:
          item.pagemap.cse_image?.[0]?.src ||
          item.pagemap.cse_thumbnail?.[0]?.src ||
          "",
        external_url: item.link,
      }));

      console.log("Products ready to copy into database:");
      console.log(productsForDatabase);

      return false;
    };

    window.__gcse = {
      searchCallbacks: {
        web: {
          ready: handleResultsReady,
        },
      },
    };

    const existingScript = document.querySelector(
      'script[src*="cse.google.com/cse.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://cse.google.com/cse.js?cx=${cx}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Google Search Debug</h1>

      <p>
        Search for nail products. Then open the console to see the results in a
        teacher-style object format.
      </p>

        <div className="gcse-search"></div>
    </div>
  );
};

export default GoogleSearchDebug;