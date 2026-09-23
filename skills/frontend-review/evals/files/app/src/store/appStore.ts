import { create } from "zustand";
import { client } from "../api/client";

type Order = { id: string; customer: string; total: number; createdAt: string };

type AppState = {
  user: any;
  orders: Order[];
  ordersLoading: boolean;
  filterQuery: string;
  page: number;
  checkoutForm: { name: string; address: string; card: string };
  theme: "light" | "dark";
  fetchOrders: () => Promise<void>;
  setFilterQuery: (q: string) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  orders: [],
  ordersLoading: false,
  filterQuery: "",
  page: 1,
  checkoutForm: { name: "", address: "", card: "" },
  theme: "light",
  fetchOrders: async () => {
    set({ ordersLoading: true });
    const res = await client.get(`/orders?page=${get().page}`);
    set({ orders: res.data, ordersLoading: false });
  },
  setFilterQuery: (q) => set({ filterQuery: q }),
}));
