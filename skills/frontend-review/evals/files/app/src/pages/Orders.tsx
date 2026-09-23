import { useEffect } from "react";
import moment from "moment";
import { useAppStore } from "../store/appStore";
import { OrderNote } from "../components/OrderNote";

export function Orders() {
  const { orders, filterQuery, fetchOrders, setFilterQuery } = useAppStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o: any) => o.customer.includes(filterQuery));

  return (
    <div>
      <input value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
      {/* orders can be 5,000+ rows */}
      {filtered.map((o: any) => (
        <div key={o.id}>
          {o.customer} {o.total} {moment(o.createdAt).format("YYYY-MM-DD")}
          <OrderNote note={o.note} />
        </div>
      ))}
    </div>
  );
}
