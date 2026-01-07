import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [data, setData] = useState({ username: "", password: "", confirmPassword: "", name: "", role: "USER" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const showToast = (msg, type = "error") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const submit = async () => {
        if (!data.username || !data.password || !data.name || !data.confirmPassword) {
            return showToast("Please fill all fields");
        }
        if (data.password !== data.confirmPassword) {
            return showToast("Passwords do not match!");
        }

        setLoading(true);
        try {
            await api.post("/auth/register", data);
            showToast("Welcome to MusifyX! Redirecting to login...", "success");
            setTimeout(() => navigate("/login"), 800);
        } catch (err) {
            const msg = err.response?.data?.msg || err.response?.data?.error || "Registration failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#1db95433] to-black p-4 font-sans">
            <div className="bg-black p-8 md:p-12 rounded-2xl w-full max-w-md shadow-2xl border border-spotify-gray overflow-hidden relative">
                {/* Logo and Content */}
                <div className="flex justify-center mb-8">
                    <div className="text-spotify-green text-3xl font-black tracking-tighter flex items-center gap-2">
                        <span className="text-4xl text-white">🎵</span> MusifyX
                    </div>
                </div>

                <h1 className="text-2xl font-black mb-8 text-center tracking-tight leading-tight">Create your account to start listening.</h1>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Full Name</label>
                        <input
                            placeholder="Enter your full name"
                            className="spotify-input !mb-0"
                            onChange={e => setData({ ...data, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Email Address</label>
                        <input
                            placeholder="Enter your email"
                            className="spotify-input !mb-0"
                            onChange={e => setData({ ...data, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Create Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="spotify-input !mb-0"
                            onChange={e => setData({ ...data, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            className="spotify-input !mb-0 shadow-inner"
                            onChange={e => setData({ ...data, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={submit}
                        disabled={loading}
                        className={`spotify-button w-full mt-4 bg-spotify-green text-black py-4 rounded-full font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-spotify-green/10 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10 text-center">
                    <p className="text-spotify-light text-sm font-bold">
                        Already have an account? <Link to="/login" className="text-white hover:text-spotify-green underline ml-1 transition-colors">Log in</Link>
                    </p>
                </div>

                {/* Floating Toast Notification */}
                {message && (
                    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 ${message.type === 'success' ? 'bg-spotify-green/10 border-spotify-green text-spotify-green' : 'bg-red-500/10 border-red-500 text-red-500'} whitespace-nowrap`}>
                        <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
                        <p className="font-bold text-sm tracking-tight">{message.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
