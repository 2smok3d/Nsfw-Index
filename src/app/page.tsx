import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nsfw Index — Home",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">Nsfw Index</h1>
        <p className="text-xl text-gray-400">
          A curated content index. Browse, search, and discover.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/browse"
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Browse
          </a>
          <a
            href="/search"
            className="px-6 py-3 border border-white rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
          >
            Search
          </a>
        </div>
      </div>
    </main>
  );
}
