import { useState } from "react";

export default function Search() {
    const [query, setQuery] = useState("");

    const genres = [
        { title: "Pop", color: "bg-pink-600" },
        { title: "Hip-Hop", color: "bg-orange-600" },
        { title: "Rock", color: "bg-red-700" },
        { title: "Jazz", color: "bg-amber-600" },
        { title: "Lofi", color: "bg-indigo-600" },
        { title: "Electronic", color: "bg-cyan-600" },
        { title: "Ambient", color: "bg-emerald-600" },
        { title: "Classical", color: "bg-blue-800" },
        { title: "Country", color: "bg-yellow-700" },
        { title: "R&B", color: "bg-rose-800" },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="sticky top-0 z-20 mb-10 -mt-2">
                <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-spotify-light text-xl group-focus-within:text-white transition-colors">🔍</span>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="What do you want to listen to?"
                        className="w-full max-w-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border-none rounded-full py-4 pl-14 pr-6 text-sm font-bold placeholder-white/50 transition-all outline-none ring-1 ring-white/5 focus:ring-white/20"
                    />
                </div>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-black mb-6">Browse all</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {genres.map(genre => (
                        <div key={genre.title} className={`${genre.color} aspect-square rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl group`}>
                            <h3 className="text-2xl font-black tracking-tighter leading-none z-10 relative">{genre.title}</h3>
                            <div className="absolute -bottom-2 -right-4 w-28 h-28 bg-white/20 rotate-[25deg] shadow-2xl group-hover:rotate-[15deg] transition-transform duration-500"></div>
                            <span className="absolute bottom-2 right-2 text-4xl opacity-40 group-hover:opacity-100 transition-opacity duration-500">💿</span>
                        </div>
                    ))}
                </div>
            </section>

            {query && (
                <section className="animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <h2 className="text-2xl font-black mb-6">Search results for "{query}"</h2>
                    <div className="bg-black/20 rounded-3xl p-20 text-center border border-dashed border-white/5">
                        <p className="text-spotify-light font-bold italic">No results found matching your search.</p>
                    </div>
                </section>
            )}
        </div>
    );
}
