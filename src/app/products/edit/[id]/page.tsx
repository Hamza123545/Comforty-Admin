'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

type Product = {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount: number;
  badge: string;
  image: string;
  description: string;
  inventory: number;
  tags: string[];
};

export default function EditProductPage() {
  const { id } = useParams(); // Get the product ID from the URL params
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) throw new Error('Failed to fetch product');
          const data = await res.json();
          setProduct(data);

          // Ensure tags is an array before calling join
          const tags = Array.isArray(data.tags) ? data.tags : [];
          setValue('title', data.title);
          setValue('price', data.price);
          setValue('priceWithoutDiscount', data.priceWithoutDiscount);
          setValue('badge', data.badge);
          setValue('description', data.description);
          setValue('inventory', data.inventory);
          setValue('tags', tags.join(', ')); // Convert tags array to a string
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    const updatedProduct = {
      title: data.title,
      price: parseFloat(data.price), // Ensure it's a number
      priceWithoutDiscount: parseFloat(data.priceWithoutDiscount), // Ensure it's a number
      badge: data.badge,
      description: data.description,
      inventory: parseInt(data.inventory, 10), // Ensure it's a number
      tags: data.tags.split(',').map((tag: string) => tag.trim()), // Convert tags string back to array
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error('Failed to update product');
      router.push('/products'); // Navigate to the products list after successful update
    } catch (error) {
      alert('Error: Unable to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8 text-gray-600">Product not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <button
          onClick={() => router.push('/products')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Back to Products
        </button>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border p-8 rounded-xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
      >
        {/* Product Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Product Title</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <input
            type="number"
            {...register('price')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price without Discount */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Price without Discount</label>
          <input
            type="number"
            {...register('priceWithoutDiscount')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Badge */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Badge</label>
          <input
            type="text"
            {...register('badge')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Inventory */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Inventory</label>
          <input
            type="number"
            {...register('inventory')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <input
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}