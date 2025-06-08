import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios.ts";
import {
  REQUEST_MONTHLY_CRAWL_COUNT,
  REQUEST_MONTHLY_ORDERS,
  REQUEST_MONTHLY_SALES,
  REQUEST_NEW_CUSTOMER_COUNT,
  REQUEST_ORDER_COUNT, REQUEST_PERIODICAL_REVENUES
} from "../constants/apis.ts";
import {
  MonthlyOrders,
  MonthlySales,
  NewCustomerCount,
  OrdersStatusCount, PeriodicalRevenues,
  ResOrdersStatusCount, ResPeriodicalRevenues
} from "../types/DashboardType.ts";

const useDashboard = () => {

  const useFetchMonthlySales = useQuery<MonthlySales>({
    queryKey: ["monthly-sales"],
    queryFn: async () => {
      const res = await axios.get<MonthlySales>(`${REQUEST_MONTHLY_SALES}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const useFetchCrawlDataCount = useQuery<MonthlySales>({
    queryKey: ["data-crawl-count"],
    queryFn: async () => {
      const res = await axios.get(`${REQUEST_MONTHLY_CRAWL_COUNT}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const useFetchMonthlyOrders = useQuery<MonthlyOrders>({
    queryKey: ["monthly-orders"],
    queryFn: async () => {
      const res = await axios.get<MonthlyOrders>(`${REQUEST_MONTHLY_ORDERS}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const useFetchNewCustommerCount = useQuery<NewCustomerCount>({
    queryKey: ["new-custommer-count"],
    queryFn: async () => {
      const res = await axios.get<NewCustomerCount>(`${REQUEST_NEW_CUSTOMER_COUNT}`);
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const useFetchOrderStatusCount = useQuery<OrdersStatusCount[]>({
    queryKey: ["order-status-count"],
    queryFn: async () => {
      const res = await axios.get<ResOrdersStatusCount>(`${REQUEST_ORDER_COUNT}`);
      return res.data.data;
    },
    refetchOnWindowFocus: true,
  });

  const useFetchPeriodicalRevenues = (type: "ANNUALLY" | "MONTHLY") => {
    return useQuery<PeriodicalRevenues[]>({
      queryKey: ["periodical-revenues", type],
      queryFn: async ({ queryKey }) => {
        const [, type] = queryKey as [string, "ANNUALLY" | "MONTHLY"];
        const res = await axios.get<ResPeriodicalRevenues>(`${REQUEST_PERIODICAL_REVENUES}`, {
          params: { type },
          paramsSerializer: {
            indexes: false,
          },
        });
        return res.data.data;
      },
      refetchOnWindowFocus: true,
    });
  };

  return {
    useFetchMonthlySales,
    useFetchMonthlyOrders,
    useFetchNewCustommerCount,
    useFetchOrderStatusCount,
    useFetchPeriodicalRevenues,
    useFetchCrawlDataCount
  };

};

export default useDashboard;