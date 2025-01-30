// app/products/add/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

type Category = {
    id: number;
    _id: string;
  title: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      const query = `*[_type == "categories"]{_id, title}`;
      const data = await client.fetch(query);
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    const newProduct = {
      _type: 'products',
      title: data.title,
      price: parseFloat(data.price),
      priceWithoutDiscount: parseFloat(data.priceWithoutDiscount),
      badge: data.badge,
      description: data.description,
      inventory: parseInt(data.inventory, 10),
      tags: data.tags.split(',').map((tag: string) => tag.trim()),
      category: {
        _type: 'reference',
        _ref: data.category, // Reference to the selected category
      },
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.imageRef, // Replace with the actual image reference ID
        },
      },
    };

    try {
      const res = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error('Failed to add product');
      router.push('/products');
    } catch (error) {
      alert('Error: Unable to add product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
        <button
          onClick={() => router.push('/products')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Back to Products
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border p-8 rounded-xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Product Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <input
            type="number"
            {...register('price', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Price without Discount</label>
          <input
            type="number"
            {...register('priceWithoutDiscount', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Badge</label>
          <input
            type="text"
            {...register('badge')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            {...register('category', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            {...register('description', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Inventory</label>
          <input
            type="number"
            {...register('inventory', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <input
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}