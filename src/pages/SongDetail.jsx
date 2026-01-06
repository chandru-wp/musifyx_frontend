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
        <div className="animate-in fade-in zoom-in-95 duration-700">
            {/* ... song header ... */}
            <div className="flex flex-col md:flex-row items-end gap-8 mb-10">
                <div className="w-64 h-64 bg-spotify-gray rounded-2xl shadow-2xl overflow-hidden shrink-0 border border-white/10 group relative">
                    {song.image ? (
                        <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-8xl">🎵</div>
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-spotify-light">Single Track</p>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">{song.title}</h1>
                    <div className="flex items-center gap-2 font-bold">
                        <div className="w-6 h-6 rounded-full bg-spotify-green flex items-center justify-center text-[10px] text-black ring-2 ring-black">A</div>
                        <span className="hover:underline cursor-pointer">{song.artist}</span>
                        <span className="text-spotify-light">• 2024</span>
                        <span className="text-spotify-light">• 3:45</span>
                    </div>
                </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/5">
                <div className="flex items-center gap-6 mb-10">
                    <button
                        onClick={() => playSong(song)}
                        className="bg-spotify-green text-black w-14 h-14 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg shadow-spotify-green/20 font-black"
                    >
                        {currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="text-3xl text-spotify-light hover:text-spotify-green transition-colors">♡</button>
                    <button
                        onClick={() => {
                            if (!song.audioUrl) return alert("Download not available for this track");
                            const link = document.createElement("a");
                            link.href = song.audioUrl;
                            link.download = `${song.title} - ${song.artist}.mp3`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="text-3xl text-spotify-light hover:text-white transition-all hover:scale-110"
                        title="Download track"
                    >
                        ⬇
                    </button>
                    <button className="text-3xl text-spotify-light hover:text-white">•••</button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">Lyrics</h3>
                    <p className="text-2xl md:text-3xl font-bold text-spotify-light leading-relaxed">
                        [Lyrics not available for this track] <br />
                        Be the first to contribute lyrics for <span className="text-white">"{song.title}"</span>.
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <button
                    onClick={() => navigate(-1)}
                    className="text-spotify-light hover:text-white font-bold text-sm flex items-center gap-2 mb-10"
                >
                    ← Back to library
                </button>
            </div>
        </div>
    );
}
