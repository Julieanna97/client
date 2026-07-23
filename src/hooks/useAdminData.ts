import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

export interface AdminProduct {
  id: number;
  name: string;
  category?: string;
  price: number | string;
  stock: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminCustomer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface AdminOrder {
  id: number;
  customer_id: number;
  total_price: number | string;
  payment_status: string;
  payment_id?: string;
  order_status: string;
  created_at: string;
  customer_firstname?: string;
  customer_lastname?: string;
  customer_email?: string;
  customer_country?: string;
}

export interface AdminOrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
}

export interface AdminOrderDetail extends AdminOrder {
  order_items: AdminOrderItem[];
}

interface AdminData {
  products: AdminProduct[];
  customers: AdminCustomer[];
  orders: AdminOrder[];
  orderDetails: AdminOrderDetail[];
}

const EMPTY_DATA: AdminData = {
  products: [],
  customers: [],
  orders: [],
  orderDetails: [],
};

const asArray = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const numberValue = (
  value: number | string | undefined,
): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatSek = (value: number): string =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        axios.get<AdminProduct[]>(`${API_BASE_URL}/products`),
        axios.get<AdminCustomer[]>(`${API_BASE_URL}/customers`),
        axios.get<AdminOrder[]>(`${API_BASE_URL}/orders`),
      ]);

      const products =
        results[0].status === "fulfilled"
          ? asArray<AdminProduct>(results[0].value.data)
          : [];

      const customers =
        results[1].status === "fulfilled"
          ? asArray<AdminCustomer>(results[1].value.data)
          : [];

      const orders =
        results[2].status === "fulfilled"
          ? asArray<AdminOrder>(results[2].value.data)
          : [];

      if (results.every((result) => result.status === "rejected")) {
        throw new Error("The admin API could not be reached.");
      }

      const sortedOrders = [...orders].sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime(),
      );

      const detailResults = await Promise.allSettled(
        sortedOrders.slice(0, 15).map((order) =>
          axios.get<AdminOrderDetail>(
            `${API_BASE_URL}/orders/${order.id}`,
          ),
        ),
      );

      const orderDetails = detailResults.flatMap((result) =>
        result.status === "fulfilled" &&
        result.value.data &&
        Array.isArray(result.value.data.order_items)
          ? [result.value.data]
          : [],
      );

      const failedRequests = results.filter(
        (result) => result.status === "rejected",
      ).length;

      if (failedRequests > 0) {
        setError(
          "Some dashboard information could not be loaded. The available live data is still shown.",
        );
      }

      setData({
        products,
        customers,
        orders: sortedOrders,
        orderDetails,
      });
    } catch (requestError) {
      console.error("Admin dashboard request failed:", requestError);

      setData(EMPTY_DATA);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The dashboard could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    ...data,
    loading,
    error,
    reload,
  };
};