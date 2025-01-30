'use client'
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

type Order = {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  orderItems: { product: string; price: number; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const query = `*[_type == "orders"]{_id, orderNumber, totalAmount, orderStatus, orderItems[]->{product->title, price, quantity}}`;
      const data = await client.fetch(query);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Order Number: {order.orderNumber}</h2>
            <p>Status: {order.orderStatus}</p>
            <p>Total: ${order.totalAmount}</p>
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  <strong>{item.product}</strong> - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
