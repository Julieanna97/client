import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  FiArchive,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiEyeOff,
  FiPackage,
  FiSearch,
  FiStar,
  FiTag,
} from "react-icons/fi";

import RevenueChart from "../../components/admin/RevenueChart";
import {
  formatSek,
  numberValue,
  useAdminData,
} from "../../hooks/useAdminData";
import "../../Admin.css";

type InventoryFilter =
  | "all"
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

type ReviewStatus =
  | "pending"
  | "approved"
  | "hidden";

interface DemoReview {
  id: number;
  customer: string;
  rating: number;
  text: string;
  date: string;
  productIndex: number;
}

const DEMO_REVIEWS: DemoReview[] = [
  {
    id: 1,
    customer: "Amelia R.",
    rating: 5,
    text: "Beautiful finish and much easier to apply than I expected.",
    date: "2026-07-18",
    productIndex: 0,
  },
  {
    id: 2,
    customer: "Sofia M.",
    rating: 4,
    text: "The set looked elegant and lasted through the weekend.",
    date: "2026-07-16",
    productIndex: 1,
  },
  {
    id: 3,
    customer: "Ella K.",
    rating: 5,
    text: "The shape was perfect and the packaging felt premium.",
    date: "2026-07-12",
    productIndex: 2,
  },
];

const getInventoryStatus = (
  stockValue: number,
): Exclude<InventoryFilter, "all"> => {
  if (stockValue <= 0) {
    return "out-of-stock";
  }

  if (stockValue <= 5) {
    return "low-stock";
  }

  return "in-stock";
};

const AdminWorkspace = () => {
  const location = useLocation();

  const {
    products,
    customers,
    orders,
    loading,
    error,
  } = useAdminData();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const section =
    pathParts[pathParts.length - 1] ||
    "inventory";

  const [inventorySearch, setInventorySearch] =
    useState("");

  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilter>("all");

  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState("");

  const [analyticsDays, setAnalyticsDays] =
    useState(30);

  const [reviewFilter, setReviewFilter] =
    useState<ReviewStatus | "all">("all");

  const [
    reviewStatuses,
    setReviewStatuses,
  ] = useState<Record<number, ReviewStatus>>(
    () => {
      try {
        const saved = localStorage.getItem(
          "naile-demo-review-statuses",
        );

        if (!saved) {
          return {};
        }

        const parsed = JSON.parse(saved);

        return parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
          ? parsed
          : {};
      } catch {
        return {};
      }
    },
  );

  useEffect(() => {
    localStorage.setItem(
      "naile-demo-review-statuses",
      JSON.stringify(reviewStatuses),
    );
  }, [reviewStatuses]);

  const inventoryCounts = useMemo(() => {
    const result = {
      "in-stock": 0,
      "low-stock": 0,
      "out-of-stock": 0,
    };

    for (const product of products) {
      const status = getInventoryStatus(
        numberValue(product.stock),
      );

      result[status] += 1;
    }

    return result;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = inventorySearch
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const status = getInventoryStatus(
        numberValue(product.stock),
      );

      const matchesFilter =
        inventoryFilter === "all" ||
        inventoryFilter === status;

      const name = product.name.toLowerCase();
      const category =
        product.category?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [
    inventoryFilter,
    inventorySearch,
    products,
  ]);

  const collections = useMemo(() => {
    const grouped = new Map<
      string,
      {
        name: string;
        products: typeof products;
        inventory: number;
        value: number;
        coverImage?: string;
      }
    >();

    for (const product of products) {
      const name =
        product.category?.trim() ||
        "Uncategorized";

      const existingCollection =
        grouped.get(name);

      const current =
        existingCollection || {
          name,
          products: [],
          inventory: 0,
          value: 0,
          coverImage:
            product.image?.trim() || undefined,
        };

      current.products.push(product);

      current.inventory += numberValue(
        product.stock,
      );

      current.value +=
        numberValue(product.stock) *
        numberValue(product.price);

      if (
        !current.coverImage &&
        product.image?.trim()
      ) {
        current.coverImage =
          product.image.trim();
      }

      grouped.set(name, current);
    }

    return Array.from(
      grouped.values(),
    ).sort(
      (first, second) =>
        second.products.length -
        first.products.length,
    );
  }, [products]);

  const activeCollection =
    collections.find(
      (collection) =>
        collection.name ===
        selectedCollection,
    ) || collections[0];

  const filteredReviews = useMemo(
    () =>
      DEMO_REVIEWS.filter((review) => {
        const status =
          reviewStatuses[review.id] ||
          "pending";

        return (
          reviewFilter === "all" ||
          reviewFilter === status
        );
      }),
    [reviewFilter, reviewStatuses],
  );

  const filteredAnalyticsOrders =
    useMemo(() => {
      const start = new Date();

      start.setDate(
        start.getDate() -
          analyticsDays +
          1,
      );

      start.setHours(0, 0, 0, 0);

      return orders.filter((order) => {
        const orderDate = new Date(
          order.created_at,
        );

        return (
          !Number.isNaN(
            orderDate.getTime(),
          ) && orderDate >= start
        );
      });
    }, [analyticsDays, orders]);

  const analyticsRevenue = useMemo(
    () =>
      filteredAnalyticsOrders.reduce(
        (total, order) =>
          total +
          numberValue(order.total_price),
        0,
      ),
    [filteredAnalyticsOrders],
  );

  const averageOrderValue =
    filteredAnalyticsOrders.length > 0
      ? analyticsRevenue /
        filteredAnalyticsOrders.length
      : 0;

  const countries = useMemo(() => {
    const totals = new Map<
      string,
      number
    >();

    for (const customer of customers) {
      const country =
        customer.country?.trim() ||
        "Unknown";

      totals.set(
        country,
        (totals.get(country) || 0) + 1,
      );
    }

    return Array.from(totals.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (first, second) =>
          second.count - first.count,
      )
      .slice(0, 8);
  }, [customers]);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    );
  }

  if (section === "inventory") {
    return (
      <div className="admin-section-page">
        <header className="admin-section-header">
          <div>
            <p>Catalog operations</p>

            <h1>Inventory</h1>

            <span>
              Monitor stock levels using
              live product data.
            </span>
          </div>

          <FiArchive aria-hidden="true" />
        </header>

        {error && (
          <div className="admin-data-warning">
            {error}
          </div>
        )}

        <section className="admin-summary-grid">
          <article>
            <strong>
              {products.length}
            </strong>

            <span>Total products</span>
          </article>

          <article>
            <strong>
              {
                inventoryCounts[
                  "in-stock"
                ]
              }
            </strong>

            <span>Healthy stock</span>
          </article>

          <article>
            <strong>
              {
                inventoryCounts[
                  "low-stock"
                ]
              }
            </strong>

            <span>Low stock</span>
          </article>

          <article>
            <strong>
              {
                inventoryCounts[
                  "out-of-stock"
                ]
              }
            </strong>

            <span>Out of stock</span>
          </article>
        </section>

        <section className="admin-data-card">
          <div className="admin-filter-bar">
            <label className="admin-search-field">
              <FiSearch
                aria-hidden="true"
              />

              <input
                type="search"
                value={inventorySearch}
                onChange={(event) =>
                  setInventorySearch(
                    event.target.value,
                  )
                }
                placeholder="Search products or categories"
                aria-label="Search inventory"
              />
            </label>

            <div className="admin-filter-pills">
              {[
                ["all", "All"],
                [
                  "in-stock",
                  "In stock",
                ],
                [
                  "low-stock",
                  "Low stock",
                ],
                [
                  "out-of-stock",
                  "Out of stock",
                ],
              ].map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      inventoryFilter ===
                      value
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setInventoryFilter(
                        value as InventoryFilter,
                      )
                    }
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          {filteredProducts.length ===
          0 ? (
            <div className="admin-compact-empty">
              No products match the
              selected inventory filter.
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Preview</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => {
                      const stock =
                        numberValue(
                          product.stock,
                        );

                      const status =
                        getInventoryStatus(
                          stock,
                        );

                      return (
                        <tr
                          key={product.id}
                        >
                          <td>
                            <div className="admin-product-cell">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt=""
                                  onError={(
                                    event,
                                  ) => {
                                    event.currentTarget.onerror =
                                      null;

                                    event.currentTarget.src =
                                      "/no-image.png";
                                  }}
                                />
                              ) : (
                                <span>
                                  {product.name.slice(
                                    0,
                                    1,
                                  )}
                                </span>
                              )}

                              <strong>
                                {
                                  product.name
                                }
                              </strong>
                            </div>
                          </td>

                          <td>
                            {product.category ||
                              "Uncategorized"}
                          </td>

                          <td>
                            {formatSek(
                              numberValue(
                                product.price,
                              ),
                            )}
                          </td>

                          <td>{stock}</td>

                          <td>
                            <span
                              className={`inventory-status ${status}`}
                            >
                              {status.replace(
                                /-/g,
                                " ",
                              )}
                            </span>
                          </td>

                          <td>
                            <Link
                              to={`/product/${product.id}`}
                              className="admin-table-link"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (section === "collections") {
    return (
      <div className="admin-section-page">
        <header className="admin-section-header">
          <div>
            <p>
              Catalog organization
            </p>

            <h1>Collections</h1>

            <span>
              Categories are generated
              from your live products.
            </span>
          </div>

          <FiTag aria-hidden="true" />
        </header>

        {error && (
          <div className="admin-data-warning">
            {error}
          </div>
        )}

        {collections.length === 0 ? (
          <div className="admin-data-card admin-compact-empty">
            No product collections are
            available yet.
          </div>
        ) : (
          <>
            <div className="admin-collection-grid">
              {collections.map(
                (collection) => (
                  <button
                    key={collection.name}
                    type="button"
                    className={
                      activeCollection?.name ===
                      collection.name
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCollection(
                        collection.name,
                      )
                    }
                  >
                    <div className="admin-collection-cover">
                      {collection.coverImage ? (
                        <img
                          src={
                            collection.coverImage
                          }
                          alt={`${collection.name} collection`}
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.onerror =
                              null;

                            event.currentTarget.src =
                              "/no-image.png";
                          }}
                        />
                      ) : (
                        <FiPackage
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="admin-collection-details">
                      <strong>
                        {collection.name}
                      </strong>

                      <span>
                        {
                          collection
                            .products.length
                        }{" "}
                        {collection.products
                          .length === 1
                          ? "product"
                          : "products"}
                      </span>

                      <small>
                        {
                          collection.inventory
                        }{" "}
                        units ·{" "}
                        {formatSek(
                          collection.value,
                        )}
                      </small>
                    </div>
                  </button>
                ),
              )}
            </div>

            {activeCollection && (
              <section className="admin-data-card">
                <div className="admin-card-title-row">
                  <div>
                    <p>
                      Selected collection
                    </p>

                    <h2>
                      {
                        activeCollection.name
                      }
                    </h2>
                  </div>

                  <span>
                    {
                      activeCollection
                        .products.length
                    }{" "}
                    {activeCollection.products
                      .length === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <div className="collection-product-list">
                  {activeCollection.products.map(
                    (product) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                      >
                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt=""
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.onerror =
                                null;

                              event.currentTarget.src =
                                "/no-image.png";
                            }}
                          />
                        ) : (
                          <span>
                            {product.name.slice(
                              0,
                              1,
                            )}
                          </span>
                        )}

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            {formatSek(
                              numberValue(
                                product.price,
                              ),
                            )}{" "}
                            ·{" "}
                            {numberValue(
                              product.stock,
                            )}{" "}
                            in stock
                          </small>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    );
  }

  if (section === "reviews") {
    return (
      <div className="admin-section-page">
        <header className="admin-section-header">
          <div>
            <p>
              Portfolio demonstration
            </p>

            <h1>Reviews</h1>

            <span>
              Moderation actions are
              stored locally in this
              browser.
            </span>
          </div>

          <FiStar aria-hidden="true" />
        </header>

        <div className="admin-demo-notice">
          The backend does not currently
          have a reviews endpoint. This
          section demonstrates the intended
          moderation experience without
          changing production data.
        </div>

        <div className="admin-filter-pills review-filter-pills">
          {[
            ["all", "All"],
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["hidden", "Hidden"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                reviewFilter === value
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setReviewFilter(
                  value as
                    | ReviewStatus
                    | "all",
                )
              }
            >
              {label}
            </button>
          ))}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="admin-data-card admin-compact-empty">
            There are no reviews with this
            status.
          </div>
        ) : (
          <div className="admin-review-list">
            {filteredReviews.map(
              (review) => {
                const status =
                  reviewStatuses[
                    review.id
                  ] || "pending";

                const product =
                  products[
                    review.productIndex
                  ];

                return (
                  <article
                    key={review.id}
                  >
                    <div className="review-card-heading">
                      <div>
                        <strong>
                          {
                            review.customer
                          }
                        </strong>

                        <span
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {"★".repeat(
                            review.rating,
                          )}

                          {"☆".repeat(
                            5 -
                              review.rating,
                          )}
                        </span>
                      </div>

                      <span
                        className={`review-status ${status}`}
                      >
                        {status}
                      </span>
                    </div>

                    <h2>
                      {product?.name ||
                        "Press-on nail set"}
                    </h2>

                    <p>{review.text}</p>

                    <small>
                      {new Date(
                        review.date,
                      ).toLocaleDateString()}
                    </small>

                    <div className="review-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setReviewStatuses(
                            (current) => ({
                              ...current,
                              [review.id]:
                                "approved",
                            }),
                          )
                        }
                      >
                        <FiCheckCircle
                          aria-hidden="true"
                        />
                        Approve
                      </button>

                      <button
                        type="button"
                        className="secondary-review-action"
                        onClick={() =>
                          setReviewStatuses(
                            (current) => ({
                              ...current,
                              [review.id]:
                                "hidden",
                            }),
                          )
                        }
                      >
                        <FiEyeOff
                          aria-hidden="true"
                        />
                        Hide
                      </button>

                      <button
                        type="button"
                        className="secondary-review-action"
                        onClick={() =>
                          setReviewStatuses(
                            (current) => ({
                              ...current,
                              [review.id]:
                                "pending",
                            }),
                          )
                        }
                      >
                        <FiClock
                          aria-hidden="true"
                        />
                        Pending
                      </button>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-section-page">
      <header className="admin-section-header">
        <div>
          <p>Business performance</p>

          <h1>Analytics</h1>

          <span>
            Revenue and customer insights
            generated from live API data.
          </span>
        </div>

        <FiBarChart2 aria-hidden="true" />
      </header>

      {error && (
        <div className="admin-data-warning">
          {error}
        </div>
      )}

      <div className="analytics-toolbar">
        <span>Reporting period</span>

        <div className="admin-period-selector">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              type="button"
              className={
                analyticsDays === days
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setAnalyticsDays(days)
              }
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      <section className="admin-summary-grid">
        <article>
          <strong>
            {formatSek(
              analyticsRevenue,
            )}
          </strong>

          <span>Order value</span>
        </article>

        <article>
          <strong>
            {
              filteredAnalyticsOrders.length
            }
          </strong>

          <span>Orders</span>
        </article>

        <article>
          <strong>
            {formatSek(
              averageOrderValue,
            )}
          </strong>

          <span>Average order</span>
        </article>

        <article>
          <strong>
            {customers.length}
          </strong>

          <span>Total customers</span>
        </article>
      </section>

      <section className="analytics-main-grid">
        <article className="admin-data-card">
          <div className="admin-card-title-row">
            <div>
              <p>Revenue trend</p>

              <h2>
                Last {analyticsDays} days
              </h2>
            </div>
          </div>

          <RevenueChart
            orders={orders}
            days={analyticsDays}
          />
        </article>

        <article className="admin-data-card">
          <div className="admin-card-title-row">
            <div>
              <p>Customer locations</p>

              <h2>Top countries</h2>
            </div>
          </div>

          {countries.length === 0 ? (
            <div className="admin-compact-empty">
              Customer location data will
              appear here after customers
              complete checkout.
            </div>
          ) : (
            <div className="analytics-bar-list">
              {countries.map(
                (country) => {
                  const percentage =
                    customers.length > 0
                      ? (country.count /
                          customers.length) *
                        100
                      : 0;

                  return (
                    <div
                      key={country.name}
                    >
                      <span>
                        <b>
                          {country.name}
                        </b>

                        <small>
                          {country.count}
                        </small>
                      </span>

                      <i>
                        <em
                          style={{
                            width: `${Math.min(
                              percentage,
                              100,
                            )}%`,
                          }}
                        />
                      </i>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default AdminWorkspace;