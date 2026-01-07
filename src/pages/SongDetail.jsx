import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PlayerContext } from "../context/PlayerContext";

export default function SongDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const { playSong, currentSong, isPlaying } = useContext(PlayerContext);

    useEffect(() => {
        api.get("/songs")
            .then(res => {
                const found = res.data.find(s => s.id === id);
                if (found) setSong(found);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="animate-pulse bg-spotify-gray h-96 rounded-3xl"></div>;
    if (!song) return <div className="text-center py-20 text-3xl font-black">Track not found.</div>;

    return (
        <div className="relative min-h-[60vh] -m-4 md:-m-8 p-6 md:p-10 overflow-hidden rounded-2xl animate-in fade-in duration-1000">
            {/* Immersive Background Blur */}
            <div className="absolute inset-0 z-0">
                {song.image ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-[100px] opacity-30 transition-all duration-1000"
                        style={{ backgroundImage: `url(${song.image})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/20 to-spotify-dark" />
                )}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 flex flex-col gap-12 max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="w-fit flex items-center gap-2 text-spotify-light hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-x-1 group"
                >
                    <span className="text-xl group-hover:scale-125 transition-transform">←</span>
                    Back to Library
                </button>

                {/* Main Content Card */}
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-12">
                    {/* Art Work */}
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-4 bg-white/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-spotify-gray rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-all duration-500 relative">
                            {song.image ? (
                                <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl">🎵</div>
                            )}
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-spotify-green mb-6 animate-in slide-in-from-bottom-2 duration-700">
                            <span className="w-1 h-1 bg-spotify-green rounded-full animate-pulse"></span>
                            Now Discovering
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-[1.1] md:leading-[1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 break-words lg:break-all max-w-full">
                            {song.title}
                        </h1>

                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spotify-green to-emerald-900 flex items-center justify-center text-xs font-black text-black ring-4 ring-black/20 group-hover:scale-110 transition-transform">
                                    {song.artist?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-spotify-light uppercase tracking-widest leading-none mb-1">Artist</p>
                                    <p className="font-black text-lg group-hover:text-spotify-green transition-colors">{song.artist}</p>
                                </div>
                            </div>

                            <div className="hidden md:block h-8 w-px bg-white/10"></div>

                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-spotify-light uppercase tracking-widest leading-none mb-2">Released</p>
                                    <p className="font-bold">2024</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-spotify-light uppercase tracking-widest leading-none mb-2">Length</p>
                                    <p className="font-bold">3:45</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Actions Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl">
                        <div className="flex flex-wrap items-center gap-8 md:gap-12 mb-12">
                            <button
                                onClick={() => playSong(song)}
                                className="bg-spotify-green text-black px-10 py-5 rounded-full flex items-center gap-3 text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-[0_12px_24px_-8px_rgba(29,185,84,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(29,185,84,0.6)]"
                            >
                                <span className="text-2xl">{currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}</span>
                                {currentSong?.id === song.id && isPlaying ? 'PAUSE' : 'PLAY TRACK'}
                            </button>

                            <div className="flex items-center gap-6">
                                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl hover:bg-white/10 hover:text-spotify-green transition-all hover:scale-110">♡</button>
                                <button
                                    onClick={() => {
                                        if (!song.audioUrl) return alert("Download not available");
                                        const link = document.createElement("a");
                                        link.href = song.audioUrl;
                                        link.download = `${song.title}.mp3`;
                                        link.click();
                                    }}
                                    className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 hover:text-white transition-all hover:scale-110"
                                    title="Download"
                                >
                                    ⬇
                                </button>
                                <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all">•••</button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-spotify-green rounded-full"></span>
                                Lyrics Preview
                            </h3>
                            <div className="space-y-4">
                                <p className="text-3xl md:text-4xl font-black text-white/90 leading-tight">Finding beauty in the quiet moments...</p>
                                <p className="text-3xl md:text-4xl font-black text-white/30 leading-tight">Walking down the streets we used to know...</p>
                                <p className="text-sm font-bold text-spotify-light border-t border-white/5 pt-6 mt-6 uppercase tracking-widest italic">
                                    [ Full lyrics coming soon for {song.title} ]
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/5 shadow-2xl space-y-8">
                        <div>
                            <h4 className="text-xs font-black text-spotify-light uppercase tracking-widest mb-6">Related Collections</h4>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-14 h-14 bg-spotify-gray rounded-xl overflow-hidden shadow-lg border border-white/5 group-hover:scale-105 transition-transform">
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate group-hover:text-spotify-green transition-colors">Vibe Mix {i}</p>
                                            <p className="text-[10px] font-black text-spotify-light uppercase tracking-widest">Playlist • 40 songs</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-4 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                            View All Mixes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
