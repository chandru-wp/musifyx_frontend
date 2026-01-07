import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { role, logout, username } = useContext(AuthContext);

    const stats = [
        { label: "Public Playlists", value: "12" },
        { label: "Followers", value: "1.2k" },
        { label: "Following", value: "348" },
    ];

    return (
        <div className="relative min-h-[60vh] -m-4 md:-m-8 p-6 md:p-10 overflow-hidden rounded-[32px] animate-in fade-in duration-1000">
            {/* High-End Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-spotify-green/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-12">
                {/* Immersive Profile Header */}
                <header className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    {/* Avatar with Ring Animation */}
                    <div className="relative shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-spotify-green to-emerald-500 rounded-full blur opacity-40 animate-spin-slow"></div>
                        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-[#121212] to-spotify-dark shadow-2xl flex items-center justify-center text-6xl font-black text-white border-4 border-white/5 overflow-hidden">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
                                {username?.charAt(0).toUpperCase() || role?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center text-black text-xl shadow-xl border-4 border-spotify-dark">
                            {role === 'ADMIN' ? '🛡️' : '👑'}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.4em] mb-4 text-spotify-green animate-in slide-in-from-left-4 duration-700">Verified Profile</p>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none break-all bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                                {username || 'MusifyX User'}
                            </h1>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-4">
                            {stats.map((stat, i) => (
                                <div key={stat.label} className={`animate-in slide-in-from-bottom-${4 + i * 2} duration-700`}>
                                    <p className="text-3xl font-black mb-1">{stat.value}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-spotify-light">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Activity Section */}
                    <section className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <span className="w-2 h-8 bg-spotify-green rounded-full"></span>
                                Featured Tracks
                            </h2>
                            <button className="text-[10px] font-black uppercase tracking-widest text-spotify-light hover:text-white transition-colors">See Directory →</button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 border border-white/5 shadow-2xl divide-y divide-white/5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-6 py-5 group cursor-pointer hover:bg-white/5 px-6 rounded-2xl transition-all">
                                    <span className="text-spotify-light font-black w-4 text-sm opacity-30 group-hover:opacity-100 group-hover:text-spotify-green">0{i}</span>
                                    <div className="w-14 h-14 bg-spotify-gray rounded-xl shadow-lg border border-white/5 overflow-hidden group-hover:scale-110 transition-transform">
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-600/40 to-black"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-base truncate group-hover:text-spotify-green transition-colors">Digital Serenity {i}</p>
                                        <p className="text-[10px] text-spotify-light font-black uppercase tracking-[0.1em]">Atmospheric Flow • 2024</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-spotify-light text-xs font-black tabular-nums">03:4{i}</span>
                                        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">▶</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Controls Section */}
                    <aside className="space-y-10">
                        <div className="bg-[#181818] p-10 rounded-[40px] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-spotify-green/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="font-black text-xl mb-4 tracking-tight">Account Ecosystem</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group/btn">
                                    <span className="font-black text-sm text-spotify-light group-hover/btn:text-white">Edit Profile</span>
                                    <span className="text-xl opacity-20 group-hover/btn:opacity-100 transition-all">✏️</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group/btn">
                                    <span className="font-black text-sm text-spotify-light group-hover/btn:text-white">Privacy Vault</span>
                                    <span className="text-xl opacity-20 group-hover/btn:opacity-100 transition-all">🛡️</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all group/logout"
                                >
                                    <span className="font-black text-sm text-red-500/70 group-hover/logout:text-red-500">Secure Logout</span>
                                    <span className="text-xl opacity-30 group-hover/logout:opacity-100">⏻</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-spotify-green to-emerald-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center text-2xl">🏆</div>
                                    <h3 className="font-black text-black text-xl italic tracking-tighter uppercase">MusifyX Elite</h3>
                                </div>
                                <p className="text-spotify-dark font-bold text-xs leading-relaxed mb-8 opacity-90">
                                    You are currently on a premium membership. Enjoy ad-free listening and high-fidelity audio streams.
                                </p>
                                <button className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                                    Manage Subscription
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
