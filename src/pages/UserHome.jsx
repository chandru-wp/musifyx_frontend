import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

export default function UserHome() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    api.get("/songs")
      .then(res => {
        console.log("Songs fetched:", res.data);
        setSongs(res.data);
      })
      .catch(err => console.error("Failed to fetch songs", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", "Music", "Podcasts", "Audiobooks"];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Category Pills */}
      <div className="flex gap-3 sticky top-0 z-30 py-2 overflow-x-auto no-scrollbar pb-4 md:pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all shadow-lg ${cat === 'All' ? 'bg-white text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Welcome Section */}
      <section className="bg-gradient-to-br from-[#1e1e1e] to-spotify-dark p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-spotify-green/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 animate-in slide-in-from-left duration-700">Good Evening</h1>
        <p className="text-spotify-light font-bold mb-8 max-w-lg leading-relaxed">Continue where you left off. Your personalized discovery mix and favorite tracks are waiting for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-all cursor-pointer group shadow-xl">
            <div className="w-16 h-16 bg-red-600 rounded shadow-lg flex items-center justify-center text-3xl">🔥</div>
            <p className="font-bold">Liked Songs</p>
            <button className="ml-auto w-10 h-10 bg-spotify-green rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center text-black">▶</button>
          </div>
          <div className="bg-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-all cursor-pointer group shadow-xl">
            <div className="w-16 h-16 bg-blue-600 rounded shadow-lg flex items-center justify-center text-3xl">🧩</div>
            <p className="font-bold">Discover Weekly</p>
            <button className="ml-auto w-10 h-10 bg-spotify-green rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center text-black">▶</button>
          </div>
          <div className="bg-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-all cursor-pointer group shadow-xl">
            <div className="w-16 h-16 bg-emerald-600 rounded shadow-lg flex items-center justify-center text-3xl">🎧</div>
            <p className="font-bold">Release Radar</p>
            <button className="ml-auto w-10 h-10 bg-spotify-green rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center text-black">▶</button>
          </div>
        </div>
      </section>

      {/* Featured Playlists */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">Your top mixes</h2>
          <span className="text-xs font-black text-spotify-light hover:text-white uppercase tracking-widest cursor-pointer transition-colors">Show all</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <PlaylistCard title="Mega Hit Mix" desc="All your favorite hits in one place" emoji="🌟" color="bg-gradient-to-br from-yellow-500 to-orange-700" />
          <PlaylistCard title="Rap Caviar" desc="New music from Drake, Travis Scott..." emoji="💎" color="bg-gradient-to-br from-green-900 to-teal-800" />
          <PlaylistCard title="Mood Booster" desc="Get happy with these tracks" emoji="☀️" color="bg-gradient-to-br from-cyan-500 to-blue-700" />
          <PlaylistCard title="Deep Focus" desc="Keep your head in the game" emoji="🚀" color="bg-gradient-to-br from-purple-900 to-indigo-900" />
          <PlaylistCard title="Today's Top" desc="The hottest tracks globally" emoji="🌎" color="bg-gradient-to-br from-red-600 to-rose-900" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">Recently Added</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5].map(i => <div key={i} className="animate-pulse bg-spotify-gray h-72 rounded-2xl"></div>)
          ) : songs.length > 0 ? (
            songs.map(song => (
              <div
                key={song.id}
                className="spotify-card group p-5 bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-white/10"
                onClick={() => navigate(`/song/${song.id}`)}
              >
                <div className="relative mb-5 shadow-2xl aspect-square rounded-xl overflow-hidden group">
                  <div className="w-full h-full bg-spotify-gray flex items-center justify-center text-5xl">
                    {song.image ? (
                      <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : "🎵"}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!song.audioUrl) return alert("Download not available");
                      const link = document.createElement("a");
                      link.href = song.audioUrl;
                      link.download = `${song.title}.mp3`;
                      link.click();
                    }}
                    className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/20"
                    title="Quick Download"
                  >
                    ⬇
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                    className="absolute bottom-4 right-4 bg-spotify-green w-14 h-14 rounded-full flex items-center justify-center text-black shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ring-8 ring-black/20 hover:scale-110 active:scale-95"
                  >
                    <span className="text-xl ml-1">{currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}</span>
                  </button>
                </div>
                <p className="font-black truncate text-base mb-1 group-hover:text-spotify-green transition-colors">{song.title}</p>
                <p className="text-[11px] font-black text-spotify-light tracking-widest uppercase truncate">{song.artist}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center animate-pulse">
              <p className="text-spotify-light font-black italic uppercase tracking-widest">No music found. Add tracks in the dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* Album Folders Horizontal */}
      <section className="pb-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black">Jump back in</h2>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6 custom-scroll">
          <AlbumFolder title="Chill Hits" color="bg-teal-700" count="45 songs" icon="🌊" />
          <AlbumFolder title="Workout Mix" color="bg-orange-700" count="22 songs" icon="⚡" />
          <AlbumFolder title="Retro 80s" color="bg-purple-900" count="102 songs" icon="🕹️" />
          <AlbumFolder title="New Releases" color="bg-emerald-900" count="15 songs" icon="🔥" />
          <AlbumFolder title="Jazz Night" color="bg-amber-900" count="30 songs" icon="🎷" />
        </div>
      </section>
    </div>
  );
}

function AlbumFolder({ title, color, count, icon }) {
  return (
    <div className="min-w-[220px] spotify-card group p-6 !bg-white/5 border border-white/5">
      <div className={`aspect-square ${color} rounded-2xl mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
        <span className="text-7xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 z-10 drop-shadow-2xl">{icon}</span>
        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/75 bg-black/20 px-2 py-1 rounded backdrop-blur-md">COLLECTION</p>
        </div>
      </div>
      <p className="font-black truncate text-lg mb-2">{title}</p>
      <p className="text-[10px] text-spotify-light font-black uppercase tracking-widest">{count}</p>
    </div>
  )
}

function PlaylistCard({ title, desc, emoji, color }) {
  return (
    <div className="spotify-card group !bg-white/5 border border-white/5 p-5">
      <div className={`aspect-square ${color} rounded-xl mb-5 flex items-center justify-center text-6xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]`}>
        <span className="drop-shadow-2xl">{emoji}</span>
      </div>
      <p className="font-black truncate text-base mb-2">{title}</p>
      <p className="text-[10px] text-spotify-light font-black uppercase tracking-widest leading-relaxed line-clamp-2">{desc}</p>
    </div>
  );
}
