'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Product = {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount: number;
  badge: string;
  description: string;
  inventory: number;
  tags: string[];
};

export default function ViewProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product details');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8 text-gray-600">Product not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Product Details</h1>

      {/* Product Card */}
      <div className="border p-8 rounded-xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
        {/* Product Title */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">{product.title}</h2>

        {/* Price and Discount */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          {product.priceWithoutDiscount && (
            <p className="text-lg text-gray-500 line-through">${product.priceWithoutDiscount}</p>
          )}
          {product.badge && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {product.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

        {/* Inventory */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="font-semibold">Inventory:</span> {product.inventory} units
          </p>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <strong className="block mb-3 text-gray-700">Tags:</strong>
          <ul className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <li
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}