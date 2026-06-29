import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-800 px-6 py-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
          Nsfw Index
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/browse" className="hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/search" className="hover:text-white transition-colors">
            Search
          </Link>
        </div>
      </nav>
    </header>
  );
}
