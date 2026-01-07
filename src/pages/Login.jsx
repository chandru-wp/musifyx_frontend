import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showToast = (msg, type = "error") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const submit = async () => {
    if (!data.username || !data.password) return showToast("Please enter your email and password");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      showToast("Access Granted! Syncing your library...", "success");
      login(res.data.token, res.data.user.role, res.data.user.id, res.data.user.username);
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.error || "Login failed";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#1db95433] to-black p-4 font-sans">
      <div className="bg-black p-10 md:p-12 rounded-2xl w-full max-w-md shadow-2xl border border-spotify-gray relative overflow-hidden">

        <div className="flex justify-center mb-10">
          <div className="text-spotify-green text-3xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-4xl text-white">🎵</span> MusifyX
          </div>
        </div>

        <h1 className="text-3xl font-black mb-10 text-center tracking-tight leading-tight">Log in to MusifyX</h1>

        <form
          className="space-y-6"
          onSubmit={(e) => { e.preventDefault(); submit(); }}
        >
          <div>
            <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Email or username</label>
            <input
              placeholder="Email or username"
              className="spotify-input !mb-0"
              onChange={e => setData({ ...data, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black mb-2 block uppercase tracking-[0.2em] text-spotify-light">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="spotify-input !mb-0"
              onChange={e => setData({ ...data, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`spotify-button w-full mt-4 bg-spotify-green text-black py-4 rounded-full font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-spotify-green/10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-white/10 text-center">
          <p className="text-spotify-light text-sm font-bold">
            Don't have an account? <Link to="/register" className="text-white hover:text-spotify-green underline ml-1 font-black transition-colors">Sign up for MusifyX</Link>
          </p>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {message && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50 ${message.type === 'success' ? 'bg-spotify-green/10 border-spotify-green text-spotify-green' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
          <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
          <p className="font-bold text-sm tracking-tight">{message.text}</p>
        </div>
      )}
    </div>
  );
}
