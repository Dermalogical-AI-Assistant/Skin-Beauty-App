import { E_OrderStatus } from "./Order.ts";

export interface MonthlySales {
  newSales: number;
  totalSales: number;
  incrementalRate: number;
}

export interface MonthlyOrders {
  newOrdersCount: number;
  totalOrdersCount: number;
  incrementalRate: number;
}

export interface NewCustomerCount {
  newCustomersCount: number;
  totalUsersCount: number;
  incrementalRate: number;
}

export interface ResOrdersStatusCount {
  data: OrdersStatusCount[];
}

export interface OrdersStatusCount {
  status: E_OrderStatus;
  count: number;
}

export interface PeriodicalRevenues {
  time: string;
  amount: number;
};

export interface ResPeriodicalRevenues {
  data: PeriodicalRevenues[];
};
