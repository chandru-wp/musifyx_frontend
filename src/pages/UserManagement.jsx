import { useState, useEffect } from "react";
import api from "../api/axios";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: "", password: "", name: "", role: "USER" });
    const [message, setMessage] = useState(null);

    const showToast = (msg, type = "error") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 4000);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/auth/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.password || !newUser.name) return showToast("All fields are required");
        setLoading(true);
        try {
            await api.post("/auth/register", newUser);
            showToast("New member joined MusifyX!", "success");
            setNewUser({ username: "", password: "", name: "", role: "USER" });
            fetchUsers();
        } catch (err) {
            showToast("Failed to create: " + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/auth/users/${editingUser.id}`, editingUser);
            showToast("Account details updated successfully", "success");
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
            showToast("Failed to update user details");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/auth/users/${id}`);
            showToast("User removed from directory", "success");
            fetchUsers();
        } catch (err) {
            console.error(err);
            showToast("Failed to delete user profile");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="pb-6 border-b border-white/10">
                <h1 className="text-6xl font-black tracking-tighter mb-2">Member Control</h1>
                <p className="text-spotify-light font-bold">Add admins, manage permissions, and oversee the MusifyX community.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* User Form */}
                <section className="xl:col-span-1 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl h-fit relative overflow-hidden">
                    {/* Simulation Badge */}
                    <div className="absolute top-0 right-0 bg-spotify-green px-4 py-1 text-[8px] font-black text-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                        DB Sim Active
                    </div>

                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-10 h-10 bg-spotify-green/20 rounded-full flex items-center justify-center text-spotify-green">👤</span>
                        {editingUser ? "Edit Account" : "Add New Member"}
                    </h2>

                    <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="flex flex-col gap-10">
                        <div>
                            <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-[0.2em]">Full Name</label>
                            <input
                                value={editingUser ? editingUser.name : newUser.name}
                                placeholder="Full Name"
                                className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                                onChange={e => editingUser ? setEditingUser({ ...editingUser, name: e.target.value }) : setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-[0.2em]">Email / Username</label>
                            <input
                                value={editingUser ? editingUser.username : newUser.username}
                                placeholder="Email address"
                                className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                                onChange={e => editingUser ? setEditingUser({ ...editingUser, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </div>
                        {editingUser ? (
                            <div>
                                <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-[0.2em]">Update Password (Optional)</label>
                                <input
                                    type="password"
                                    value={editingUser.password || ""}
                                    placeholder="Leave blank to keep same"
                                    className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-[0.2em]">Initial Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    placeholder="Set password"
                                    className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-[0.2em]">Role Assignment</label>
                            <select
                                value={editingUser ? editingUser.role : newUser.role}
                                className="spotify-input !mb-0 !bg-white/5 !border-white/10 appearance-none cursor-pointer"
                                onChange={e => editingUser ? setEditingUser({ ...editingUser, role: e.target.value }) : setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="USER" className="bg-spotify-gray text-white">USER</option>
                                <option value="ADMIN" className="bg-spotify-gray text-white">ADMIN</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-spotify-green text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-spotify-green/10"
                            >
                                {loading ? "..." : (editingUser ? "Update User" : "Create User")}
                            </button>
                            {editingUser && (
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-6 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* User List */}
                <section className="xl:col-span-2 bg-black/20 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-8 text-white">MusifyX Directory</h2>
                    <div className="space-y-1">
                        {users.map((u, idx) => (
                            <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
                                <span className="w-4 text-[10px] font-black text-white/20">{idx + 1}</span>
                                <div className="w-10 h-10 rounded-full bg-spotify-gray flex items-center justify-center text-spotify-green font-black border border-white/5">
                                    {u.name ? u.name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{u.name || "Unnamed User"}</p>
                                    <p className="text-[10px] text-spotify-light font-bold truncate lowercase">{u.username}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-spotify-green text-black' : 'bg-white/5 text-spotify-light'}`}>
                                        {u.role}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => setEditingUser(u)}
                                            className="p-2 bg-white/5 hover:bg-spotify-green hover:text-black rounded-lg transition-all"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Custom Toast Notification */}
            {message && (
                <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 z-50 ${message.type === 'success' ? 'bg-spotify-green/10 border-spotify-green text-spotify-green' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                    <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
                    <p className="font-bold text-sm tracking-tight">{message.text}</p>
                </div>
            )}
        </div>
    );
}
