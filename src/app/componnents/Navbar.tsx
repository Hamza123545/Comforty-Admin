import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/products" className="hover:text-gray-300">Products</Link>
        </li>
        <li>
          <Link href="/order" className="hover:text-gray-300">Orders</Link>
        </li>
        <li>
          <Link href="/categories" className="hover:text-gray-300">Categories</Link>
        </li>
      </ul>
    </nav>
  );
}
