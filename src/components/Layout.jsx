import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistDetail from "../context/PlaylistDetail";

export default function Layout({ children }) {
    const { role, logout } = useContext(AuthContext);
    const { currentSong, isPlaying, togglePlay, progress, duration, seek, volume, changeVolume, downloadCurrentSong } = useContext(PlayerContext);
    const { playlists, createPlaylist, deletePlaylist, showCreateModal, setShowCreateModal } = useContext(PlaylistContext);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showFriendActivity, setShowFriendActivity] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const isActive = (path) => location.pathname === path;
    const goBack = () => navigate(-1);
    const goForward = () => navigate(1);

    const friends = [
        { name: "Sarah M.", track: "Blinding Lights", artist: "The Weeknd", lastSeen: "2 min ago" },
        { name: "Jessica W.", track: "Levitating", artist: "Dua Lipa", lastSeen: "15 min ago" },
        { name: "David K.", track: "Stay", artist: "Kid LAROI", lastSeen: "1h ago" }
    ];

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSeek = (e) => {
        const width = e.target.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const seekTime = (clickX / width) * duration;
        seek(seekTime);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans">
            <div className="flex flex-1 overflow-hidden p-2 gap-2 relative">
                {/* Mobile Sidebar Overlay */}
                {showSidebar && (
                    <div
                        className="absolute inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setShowSidebar(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`
                    absolute top-0 bottom-0 left-0 z-50 w-80 bg-spotify-black p-2 flex flex-col gap-2 transition-transform duration-300 md:relative md:translate-x-0 md:bg-transparent md:p-0
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    {/* Combined Mobile Sidebar */}
                    <div className="bg-spotify-dark rounded-lg p-4 flex flex-col h-full overflow-hidden border border-white/5 md:border-none shadow-2xl md:shadow-none">
                        {/* Mobile Close Button */}
                        <button className="md:hidden self-end text-white mb-2 text-2xl" onClick={() => setShowSidebar(false)}>✕</button>

                        {/* Navigation */}
                        <div className="space-y-2 mb-4">
                            <Link to="/" className={`sidebar-item ${isActive('/') ? 'text-white' : ''}`} onClick={() => setShowSidebar(false)}>
                                <span className="text-xl">{isActive('/') ? '🏠' : '🏚️'}</span> Home
                            </Link>
                            <Link to="/search" className={`sidebar-item ${isActive('/search') ? 'text-white' : ''}`} onClick={() => setShowSidebar(false)}>
                                <span className="text-xl">🔍</span> Search
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-white/10 my-2"></div>

                        {/* Library Header */}
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="sidebar-item text-white">
                                <span className="text-xl">📚</span> Your Library
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="text-spotify-light hover:text-white text-2xl hover:scale-110 transition-all"
                                title="Create Playlist"
                            >+</button>
                        </div>

                        {/* Scrollable Library Content */}
                        <div className="flex-1 overflow-y-auto custom-scroll space-y-4 pr-1">
                            {/* User's Playlists */}
                            {playlists.length > 0 ? (
                                playlists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                                        onClick={() => setSelectedPlaylist(playlist)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-xl shadow-lg">🎵</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-sm truncate group-hover:text-spotify-green transition-colors">{playlist.name}</p>
                                                <p className="text-[11px] font-bold text-spotify-light uppercase tracking-wider">{playlist.songs.length} songs</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all p-2"
                                                title="Delete Playlist"
                                            >🗑</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-2xl border border-white/10 shadow-xl">
                                    <p className="font-black text-base mb-2">Create your first playlist</p>
                                    <p className="text-xs text-spotify-light font-medium mb-5 leading-relaxed">It's easy, we'll help you through the process.</p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="bg-white text-black text-xs font-black py-3 px-6 rounded-full hover:scale-105 active:scale-95 transition-all shadow-white/10 shadow-lg"
                                    >Create playlist</button>
                                </div>
                            )}
                        </div>

                        {/* Admin Links - Fixed at Bottom */}
                        {role === 'ADMIN' && (
                            <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
                                <Link to="/admin" onClick={() => setShowSidebar(false)} className={`sidebar-item hover:text-spotify-green transition-colors ${isActive('/admin') ? 'text-spotify-green' : ''}`}>
                                    <span className="text-lg">⚙️</span> Manage Catalog
                                </Link>
                                <Link to="/admin/users" onClick={() => setShowSidebar(false)} className={`sidebar-item hover:text-spotify-green transition-colors ${isActive('/admin/users') ? 'text-spotify-green' : ''}`}>
                                    <span className="text-lg">👥</span> Manage Users
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-spotify-dark rounded-lg overflow-y-auto relative bg-gradient-to-b from-[#222] to-spotify-dark shadow-2xl custom-scroll w-full">
                    {/* Header */}
                    <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-black/20 backdrop-blur-3xl border-b border-white/5">
                        <div className="flex gap-2 items-center">
                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="md:hidden bg-black/50 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-black"
                            >
                                ☰
                            </button>

                            {/* Navigation Buttons - Now visible on mobile */}
                            <button onClick={goBack} className="bg-black/50 w-8 h-8 rounded-full flex items-center justify-center text-xl hover:bg-black transition-all">‹</button>
                            <button onClick={goForward} className="bg-black/50 w-8 h-8 rounded-full flex items-center justify-center text-xl hover:bg-black transition-all">›</button>
                        </div>
                        <div className="flex items-center gap-4 relative">
                            <button className="bg-white text-black font-black py-2 px-6 rounded-full text-[10px] hover:scale-105 transition-all hidden md:block uppercase tracking-widest">Upgrade</button>

                            <div
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-spotify-green to-emerald-700 flex items-center justify-center text-black font-black text-xs ring-2 ring-white/10 cursor-pointer hover:scale-110 transition-all shadow-lg"
                            >
                                {role?.charAt(0) || 'U'}
                            </div>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute right-0 top-12 w-52 bg-spotify-gray rounded-xl shadow-2xl py-2 z-50 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link
                                        to="/profile"
                                        className="flex justify-between items-center px-4 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                                        onClick={() => setShowMenu(false)}
                                    >
                                        Profile <span>👤</span>
                                    </Link>
                                    <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
                                    <button
                                        onClick={() => { setShowFriendActivity(!showFriendActivity); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-white/10 transition-all flex justify-between items-center"
                                    >
                                        {showFriendActivity ? 'Hide Activity' : 'Show Activity'} <span>👥</span>
                                    </button>
                                    <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-white/10 text-red-500 transition-all flex justify-between items-center"
                                    >
                                        Log out <span>⏻</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </div>

                {/* Right Sidebar: Friend Activity */}
                {showFriendActivity && (
                    <div className="w-64 bg-spotify-dark rounded-lg border border-white/5 p-6 hidden xl:flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-white/80 uppercase tracking-widest">Friend Activity</h3>
                            <button className="text-spotify-light hover:text-white" onClick={() => setShowFriendActivity(false)}>✕</button>
                        </div>

                        <div className="space-y-6">
                            {friends.map(friend => (
                                <div key={friend.name} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                                    <div className="w-10 h-10 rounded-full bg-spotify-gray shrink-0 flex items-center justify-center font-bold text-xs ring-2 ring-transparent group-hover:ring-spotify-green transition-all">
                                        {friend.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black truncate">{friend.name}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-spotify-light font-bold truncate">
                                            <span className="text-spotify-green group-hover:animate-pulse">▶</span>
                                            <span className="truncate">{friend.track}</span>
                                        </div>
                                        <p className="text-[9px] text-spotify-light/50 font-bold uppercase tracking-tight truncate">
                                            {friend.artist} • {friend.lastSeen}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto bg-spotify-gray/20 p-4 rounded-xl border border-white/5 text-center">
                            <p className="text-[10px] text-spotify-light font-bold mb-3 uppercase tracking-widest leading-loose">Find more friends to see what they're listening to</p>
                            <button className="bg-white text-black text-[10px] font-black py-2 px-6 rounded-full hover:scale-105 transition-all">ADD FRIENDS</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Music Player Bar (Glassmorphism) */}
            <div className="min-h-20 md:min-h-24 h-auto safe-bottom py-2 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center px-4 md:px-6 justify-between select-none relative z-50 shadow-2xl">
                <div className="flex items-center gap-3 md:gap-5 w-full md:w-1/3 min-w-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#333] to-[#111] rounded-lg shadow-2xl overflow-hidden flex items-center justify-center border border-white/10 shrink-0 group relative cursor-pointer">
                        {currentSong?.image ?
                            <img src={currentSong.image} alt={currentSong.title} className="w-full h-full object-cover" /> :
                            <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-500">🎹</span>
                        }
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-black hover:underline hover:text-spotify-green cursor-pointer truncate leading-tight mb-0.5 md:mb-1">{currentSong?.title || "Select any track"}</p>
                        <p className="text-[10px] md:text-[11px] text-spotify-light/70 font-bold hover:underline cursor-pointer truncate">{currentSong?.artist || "Play from your library"}</p>
                    </div>
                    <button className="text-spotify-light hover:text-spotify-green hover:scale-125 transition-all ml-2 md:ml-4 text-lg hidden sm:block">♡</button>
                    {/* Mobile Play Button (Simpler layout for mobile) */}
                    <button
                        onClick={togglePlay}
                        className="md:hidden text-white w-10 h-10 flex items-center justify-center ml-auto"
                    >
                        <span className="text-2xl">{isPlaying ? '⏸' : '▶'}</span>
                    </button>
                </div>

                {/* Center Controls - Desktop */}
                <div className="hidden md:flex flex-col items-center w-1/3 max-w-2xl px-8">
                    <div className="flex items-center gap-8 mb-3">
                        <button className="text-spotify-light hover:text-spotify-green text-sm transition-colors">🔀</button>
                        <button className="text-2xl hover:scale-125 transition-all text-white/90">⏮</button>
                        <button
                            onClick={togglePlay}
                            className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl p-0 ring-4 ring-white/5"
                        >
                            <span className="ml-0.5 text-lg">{isPlaying ? '⏸' : '▶'}</span>
                        </button>
                        <button className="text-2xl hover:scale-125 transition-all text-white/90">⏭</button>
                        <button className="text-spotify-light hover:text-spotify-green text-sm transition-colors">🔁</button>
                    </div>
                    <div className="w-full flex items-center gap-4 text-[11px] text-spotify-light font-black tracking-tighter">
                        <span className="w-10 text-right opacity-60">{formatTime(progress)}</span>
                        <div
                            className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer relative shadow-inner"
                            onClick={handleSeek}
                        >
                            <div className="absolute inset-0 h-full bg-spotify-green/10"></div>
                            <div
                                className="h-full bg-white group-hover:bg-spotify-green transition-all duration-300 relative"
                                style={{ width: `${(progress / duration) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                        <span className="w-10 opacity-60">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right Controls - Desktop */}
                <div className="hidden md:flex items-center justify-end gap-5 w-1/3 min-w-fit">
                    <button
                        onClick={downloadCurrentSong}
                        className="text-spotify-light hover:text-white transition-all hover:scale-110"
                        title="Download Current Track"
                    >⬇</button>
                    <button className="text-spotify-light hover:text-white transition-colors">mic</button>
                    <button className="text-spotify-light hover:text-white transition-colors">queue</button>
                    <div className="flex items-center gap-3 group w-32 ml-2">
                        <button
                            onClick={() => changeVolume(volume > 0 ? 0 : 0.7)}
                            className="text-spotify-light group-hover:text-white text-sm transition-colors"
                        >
                            {volume === 0 ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'}
                        </button>
                        <div
                            className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden cursor-pointer group shadow-inner"
                            onClick={(e) => {
                                const rect = e.target.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
                                changeVolume(newVolume);
                            }}
                        >
                            <div className="absolute inset-0 h-full bg-spotify-green/10"></div>
                            <div
                                className="h-full bg-white group-hover:bg-spotify-green transition-colors"
                                style={{ width: `${volume * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-spotify-dark rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Create Playlist</h2>
                        <input
                            type="text"
                            placeholder="My Playlist"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full bg-spotify-gray/50 border border-white/10 rounded-xl p-4 text-white placeholder-spotify-light focus:outline-none focus:ring-2 focus:ring-spotify-green mb-6"
                            autoFocus
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setShowCreateModal(false); setNewPlaylistName(""); }}
                                className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { createPlaylist(newPlaylistName || "My Playlist"); setNewPlaylistName(""); }}
                                className="flex-1 py-3 rounded-full bg-spotify-green text-black font-bold hover:scale-105 transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Playlist Detail Modal */}
            {selectedPlaylist && (
                <PlaylistDetail
                    playlist={selectedPlaylist}
                    onClose={() => setSelectedPlaylist(null)}
                />
            )}
        </div>
    );
}
