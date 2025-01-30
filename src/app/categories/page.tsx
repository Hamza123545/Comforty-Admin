'use client'
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

type Category = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const query = `*[_type == "categories"]{_id, title, products, "image": image.asset->url}`;
      const data = await client.fetch(query);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="border p-4 rounded-lg shadow">
            <img src={category.image} alt={category.title} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{category.title}</h2>
            <p className="text-gray-600">Products: {category.products}</p>
            <div className="flex space-x-2 mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
