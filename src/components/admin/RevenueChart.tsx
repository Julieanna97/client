import {
  useId,
  useMemo,
  useState,
} from "react";
import type { MouseEvent } from "react";
import type { AdminOrder } from "../../hooks/useAdminData";
import {
  formatSek,
  numberValue,
} from "../../hooks/useAdminData";

interface RevenueChartProps {
  orders: AdminOrder[];
  days: number;
}

interface RevenuePoint {
  date: Date;
  value: number;
  x: number;
  y: number;
}

const WIDTH = 760;
const HEIGHT = 270;
const LEFT = 52;
const RIGHT = 18;
const TOP = 18;
const BOTTOM = 38;

const getDateKey = (date: Date): string =>
  date.toISOString().slice(0, 10);

const RevenueChart = ({
  orders,
  days,
}: RevenueChartProps) => {
  const gradientId = useId().replace(/:/g, "");
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const chart = useMemo(() => {
    const safeDays = Math.max(days, 2);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - safeDays + 1);

    const revenueByDate = new Map<string, number>();

    for (const order of orders) {
      const orderDate = new Date(order.created_at);

      if (
        Number.isNaN(orderDate.getTime()) ||
        orderDate < startDate
      ) {
        continue;
      }

      const key = getDateKey(orderDate);

      revenueByDate.set(
        key,
        (revenueByDate.get(key) || 0) +
          numberValue(order.total_price),
      );
    }

    const series = Array.from(
      { length: safeDays },
      (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);

        return {
          date,
          value: revenueByDate.get(getDateKey(date)) || 0,
        };
      },
    );

    const maximum = Math.max(
      ...series.map((point) => point.value),
      1,
    );

    const plotWidth = WIDTH - LEFT - RIGHT;
    const plotHeight = HEIGHT - TOP - BOTTOM;

    const points: RevenuePoint[] = series.map(
      (point, index) => ({
        ...point,
        x:
          LEFT +
          (index / Math.max(series.length - 1, 1)) *
            plotWidth,
        y:
          TOP +
          plotHeight -
          (point.value / maximum) * plotHeight,
      }),
    );

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
      )
      .join(" ");

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const chartBottom = HEIGHT - BOTTOM;

    const areaPath =
      firstPoint && lastPoint
        ? `${linePath} L ${lastPoint.x} ${chartBottom} L ${firstPoint.x} ${chartBottom} Z`
        : "";

    const labelIndexes = Array.from(
      new Set(
        [0, 0.25, 0.5, 0.75, 1].map((position) =>
          Math.round((points.length - 1) * position),
        ),
      ),
    );

    return {
      maximum,
      points,
      linePath,
      areaPath,
      labelIndexes,
    };
  }, [days, orders]);

  const selectedPoint =
    chart.points[
      activeIndex ?? Math.max(chart.points.length - 1, 0)
    ];

  const handleMouseMove = (
    event: MouseEvent<SVGSVGElement>,
  ) => {
    const bounds =
      event.currentTarget.getBoundingClientRect();

    const viewBoxX =
      ((event.clientX - bounds.left) / bounds.width) *
      WIDTH;

    const plotWidth = WIDTH - LEFT - RIGHT;
    const ratio = Math.min(
      Math.max((viewBoxX - LEFT) / plotWidth, 0),
      1,
    );

    setActiveIndex(
      Math.round(ratio * (chart.points.length - 1)),
    );
  };

  return (
    <div className="interactive-revenue-chart">
      {selectedPoint && activeIndex !== null && (
        <div
          className="revenue-chart-tooltip"
          style={{
            left: `${(selectedPoint.x / WIDTH) * 100}%`,
            top: `${(selectedPoint.y / HEIGHT) * 100}%`,
          }}
        >
          <strong>{formatSek(selectedPoint.value)}</strong>
          <span>
            {selectedPoint.date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Revenue during the last ${days} days`}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ee8e9f"
              stopOpacity="0.36"
            />
            <stop
              offset="100%"
              stopColor="#ee8e9f"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map(
          (position) => {
            const y =
              TOP +
              position *
                (HEIGHT - TOP - BOTTOM);

            const value =
              chart.maximum * (1 - position);

            return (
              <g key={position}>
                <line
                  x1={LEFT}
                  x2={WIDTH - RIGHT}
                  y1={y}
                  y2={y}
                  className="revenue-grid-line"
                />

                <text
                  x={LEFT - 9}
                  y={y + 3}
                  textAnchor="end"
                  className="revenue-axis-label"
                >
                  {Math.round(value).toLocaleString("sv-SE")}
                </text>
              </g>
            );
          },
        )}

        <path
          d={chart.areaPath}
          fill={`url(#${gradientId})`}
        />

        <path
          d={chart.linePath}
          className="interactive-revenue-line"
        />

        {activeIndex !== null && selectedPoint && (
          <>
            <line
              x1={selectedPoint.x}
              x2={selectedPoint.x}
              y1={TOP}
              y2={HEIGHT - BOTTOM}
              className="revenue-hover-line"
            />

            <circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r="5"
              className="revenue-active-point"
            />
          </>
        )}

        {chart.labelIndexes.map((index) => {
          const point = chart.points[index];

          if (!point) {
            return null;
          }

          return (
            <text
              key={getDateKey(point.date)}
              x={point.x}
              y={HEIGHT - 12}
              textAnchor="middle"
              className="revenue-date-label"
            >
              {point.date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RevenueChart;