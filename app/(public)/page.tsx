import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Welcome to 3D Prints Shop
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
        Explore our collection of high-quality 3D printed figurines, home decor,
        and functional parts. Find something you love and place an order inquiry
        today.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/catalog"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Catalog
        </Link>
        <Link
          href="/contact"
          className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
