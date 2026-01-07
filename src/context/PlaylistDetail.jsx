import { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

export default function PlaylistDetail({ playlist, onClose }) {
    const { removeSongFromPlaylist, renamePlaylist, deletePlaylist } = useContext(PlaylistContext);
    const { playSong, currentSong, isPlaying } = useContext(PlayerContext);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(playlist.name);
    const navigate = useNavigate();

    const handleRename = () => {
        if (newName.trim()) {
            renamePlaylist(playlist.id, newName.trim());
            setIsEditing(false);
        }
    };

    const playAll = () => {
        if (playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-spotify-gray to-spotify-dark rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-purple-600/30 to-pink-500/20">
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-5xl shadow-2xl">
                            🎵
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest text-spotify-light mb-1">Playlist</p>
                            {isEditing ? (
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-spotify-green"
                                        autoFocus
                                    />
                                    <button onClick={handleRename} className="text-spotify-green text-xl">✓</button>
                                    <button onClick={() => setIsEditing(false)} className="text-red-500 text-xl">✕</button>
                                </div>
                            ) : (
                                <h1
                                    className="text-3xl font-black mb-2 cursor-pointer hover:text-spotify-green transition-colors"
                                    onClick={() => setIsEditing(true)}
                                    title="Click to edit name"
                                >
                                    {playlist.name} ✏️
                                </h1>
                            )}
                            <p className="text-spotify-light text-sm">{playlist.songs.length} songs</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-2xl text-spotify-light hover:text-white"
                        >✕</button>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={playAll}
                            disabled={playlist.songs.length === 0}
                            className="bg-spotify-green text-black font-black py-3 px-8 rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ▶ Play All
                        </button>
                        <button
                            onClick={() => { deletePlaylist(playlist.id); onClose(); }}
                            className="bg-red-500/20 text-red-500 font-bold py-3 px-6 rounded-full hover:bg-red-500/30 transition-all"
                        >
                            🗑️ Delete Playlist
                        </button>
                    </div>
                </div>

                {/* Songs List */}
                <div className="p-4 overflow-y-auto max-h-[40vh] custom-scroll">
                    {playlist.songs.length > 0 ? (
                        <div className="space-y-2">
                            {playlist.songs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                    <span className="w-6 text-spotify-light text-sm">{index + 1}</span>
                                    <div className="w-12 h-12 bg-spotify-gray rounded overflow-hidden">
                                        {song.image ? (
                                            <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{song.title}</p>
                                        <p className="text-xs text-spotify-light truncate">{song.artist}</p>
                                    </div>
                                    <button
                                        onClick={() => playSong(song)}
                                        className="opacity-0 group-hover:opacity-100 bg-spotify-green w-10 h-10 rounded-full flex items-center justify-center text-black hover:scale-110 transition-all"
                                    >
                                        {currentSong?.id === song.id && isPlaying ? '⏸' : '▶'}
                                    </button>
                                    <button
                                        onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all"
                                        title="Remove from playlist"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-6xl mb-4">🎵</p>
                            <p className="text-spotify-light font-bold">No songs yet</p>
                            <p className="text-sm text-spotify-light/70">Add songs by clicking ➕ on any song card</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
