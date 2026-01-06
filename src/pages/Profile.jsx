import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { role, logout } = useContext(AuthContext);

    const stats = [
        { label: "Public Playlists", value: "12" },
        { label: "Followers", value: "1.2k" },
        { label: "Following", value: "348" },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-end gap-8 mb-12 bg-gradient-to-b from-spotify-green/20 to-transparent p-8 rounded-3xl border border-white/5">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-spotify-green to-emerald-900 shadow-2xl flex items-center justify-center text-8xl font-black text-black ring-8 ring-black/40">
                    {role?.charAt(0) || 'U'}
                </div>

                <div className="flex-1 pb-4">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-spotify-light">Profile</p>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-spotify-light">
                        {role === 'ADMIN' ? 'Super Admin' : 'Premium User'}
                    </h1>

                    <div className="flex flex-wrap gap-8">
                        {stats.map(stat => (
                            <div key={stat.label}>
                                <p className="text-2xl font-black">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-spotify-light">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-spotify-green rounded-full"></span>
                            Top tracks this month
                        </h2>
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/5 divide-y divide-white/5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 py-3 group cursor-pointer hover:bg-white/5 px-4 rounded-xl transition-all">
                                    <span className="text-spotify-light font-bold w-4 text-sm">{i}</span>
                                    <div className="w-10 h-10 bg-spotify-gray rounded"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Example Track {i}</p>
                                        <p className="text-[10px] text-spotify-light font-bold uppercase">Artist Selection</p>
                                    </div>
                                    <span className="text-spotify-light text-xs font-bold">3:42</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-spotify-gray/20 rounded-3xl p-8 border border-white/5 shadow-xl">
                        <h3 className="font-bold mb-6 text-xl">Account Settings</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all text-sm font-bold flex justify-between items-center group">
                                Edit Profile
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all text-sm font-bold flex justify-between items-center group">
                                Privacy Settings
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button
                                onClick={logout}
                                className="w-full text-left p-4 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-sm font-bold flex justify-between items-center group"
                            >
                                Log Out
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">⏻</span>
                            </button>
                        </div>
                    </section>

                    <section className="bg-spotify-green/5 rounded-3xl p-8 border border-spotify-green/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center text-black text-xl">👑</div>
                            <h3 className="font-black italic">PREMIUM</h3>
                        </div>
                        <p className="text-xs text-spotify-light font-bold leading-relaxed mb-6">
                            Your plan will expire on Dec 20, 2024. Renew now to keep your offline downloads.
                        </p>
                        <button className="w-full bg-white text-black py-3 rounded-full font-black text-xs hover:scale-105 transition-transform">
                            UPGRADE PLAN
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
