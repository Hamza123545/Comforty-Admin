'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Client-side navigation
import { client } from '@/sanity/lib/client';

type Product = {
  _id: string;
  title: string;
  price: number;
  image: string; // Image URL from Sanity
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "products"]{_id, title, price, "image": image.asset->url}`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to delete product'}`);
      } else {
        setProducts(products.filter((product) => product._id !== id));
      }
    } catch (error) {
      alert('Error: Unable to delete product');
    }
  };

  const viewProduct = (id: string) => {
    router.push(`/products/view/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => router.push('/products/add')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 p-4 rounded-xl bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Product Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h2>

              {/* Product Price */}
              <p className="text-lg font-bold text-blue-600 mb-4">${product.price}</p>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => router.push(`/products/edit/${product._id}`)}
                  className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => viewProduct(product._id)}
                  className="w-full bg-green-100 text-green-600 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}