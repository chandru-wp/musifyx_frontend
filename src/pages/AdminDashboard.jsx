import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [song, setSong] = useState({ title: "", artist: "", image: "", audioUrl: "", albumId: "" });
  const [album, setAlbum] = useState({ title: "", artist: "", desc: "", image: "", bgColor: "#121212" });
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("songs");
  const [musicMode, setMusicMode] = useState("song"); // 'song' or 'album'
  const [preview, setPreview] = useState(null);
  const [albumPreview, setAlbumPreview] = useState(null);

  // File state for Cloudinary
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [albumImageFile, setAlbumImageFile] = useState(null);

  // Song Editing State
  const [editingSong, setEditingSong] = useState(null);

  // User Management State
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", name: "", role: "USER" });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalPlays: 0,
    avgSession: 0,
    storageUsed: 0,
    apiRequests: 0,
    userGrowth: [0, 0, 0, 0, 0, 0, 0],
    deviceDistribution: { mobile: 0, desktop: 0, tablet: 0 },
    activeUsers: 0,
    serverStatus: "CHECKING..."
  });

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics");
      if (res.data?.data) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.log("Analytics fetch error, using defaults");
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await api.get("/songs");
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await api.get("/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'song') {
          setPreview(reader.result);
          setImageFile(file); // Store file for upload
        } else {
          setAlbumPreview(reader.result);
          setAlbumImageFile(file); // Store file for upload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      // Optional: simulate a URL or just show the filename
      setSong({ ...song, audioUrl: file.name });
    }
  };

  const addOrUpdateSong = async (e) => {
    e.preventDefault();
    if (!song.title || !song.artist) return alert("Title and Artist are required");
    if (!editingSong && !audioFile && !song.audioUrl) return alert("Audio file or URL is required for new songs");

    setLoading(true);
    try {
      let finalImageUrl = song.image;
      let finalAudioUrl = song.audioUrl;

      // 1. Upload image if it's a new file
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const imgRes = await api.post('/upload/image', formData);
        finalImageUrl = imgRes.data.url;
      }

      // 2. Upload audio if it's a new file (overrides text input)
      if (audioFile) {
        const formData = new FormData();
        formData.append('file', audioFile);
        const audRes = await api.post('/upload/audio', formData);
        finalAudioUrl = audRes.data.url;
      }

      const songData = {
        ...song,
        image: finalImageUrl,
        audioUrl: finalAudioUrl
      };

      if (editingSong) {
        await api.put(`/songs/${editingSong.id}`, songData);
        alert("Song Updated Successfully! ✏️");
        setEditingSong(null);
      } else {
        await api.post("/songs", songData);
        alert("Song Published Successfully! 🚀");
      }

      setSong({ title: "", artist: "", image: "", audioUrl: "", albumId: "" });
      setPreview(null);
      setImageFile(null);
      setAudioFile(null);
      fetchSongs();
    } catch (err) {
      console.error("Upload/Save Error:", err);
      alert("Failed to save song. Error: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditSong = (songToEdit) => {
    setEditingSong(songToEdit);
    setSong({
      title: songToEdit.title,
      artist: songToEdit.artist,
      image: songToEdit.image || "",
      audioUrl: songToEdit.audioUrl || "",
      albumId: songToEdit.albumId || ""
    });
    setPreview(songToEdit.image);
    setImageFile(null);
    setAudioFile(null);
    setMusicMode('song');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSong(null);
    setSong({ title: "", artist: "", image: "", audioUrl: "", albumId: "" });
    setPreview(null);
  };

  const deleteSong = async (id) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      await api.delete(`/songs/${id}`);
      alert("Song deleted successfully! 🗑️");
      fetchSongs(); // Auto refresh
    } catch (err) {
      alert("Failed to delete song: " + (err.response?.data?.msg || err.message));
    }
  };

  const addAlbum = async (e) => {
    e.preventDefault();
    if (!album.title || !album.artist) return alert("Title and Artist are required");

    setLoading(true);
    try {
      let finalImageUrl = album.image;

      if (albumImageFile) {
        const formData = new FormData();
        formData.append('file', albumImageFile);
        const imgRes = await api.post('/upload/image', formData);
        finalImageUrl = imgRes.data.url;
      }

      await api.post("/albums", { ...album, image: finalImageUrl });
      alert("Album Created Successfully! 💿");
      setAlbum({ title: "", artist: "", desc: "", image: "", bgColor: "#121212" });
      setAlbumPreview(null);
      setAlbumImageFile(null);
      fetchAlbums();
    } catch (err) {
      alert("Failed to create album. Error: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.name) return alert("All fields are required");
    setLoading(true);
    try {
      await api.post("/auth/register", newUser);
      alert("User Created Successfully!");
      setNewUser({ username: "", password: "", name: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      alert("Failed to create user: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/auth/users/${editingUser.id}`, editingUser);
      alert("User Updated Successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-2">Editor's Choice</h1>
          <p className="text-spotify-light font-bold">Manage your music catalog, users, and performance.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-spotify-gray px-6 py-4 rounded-xl text-center border border-white/5">
            <p className="text-[10px] text-spotify-light font-bold uppercase mb-1 tracking-widest">Active Users</p>
            <p className="text-2xl font-black">{users.length}</p>
          </div>
          <div className={`${analytics.serverStatus === 'ONLINE' ? 'bg-spotify-green' : 'bg-red-500'} text-black px-6 py-4 rounded-xl text-center shadow-lg`}>
            <p className="text-[10px] font-bold uppercase mb-1 tracking-widest">Server Status</p>
            <p className="text-2xl font-black">{analytics.serverStatus}</p>
          </div>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab("songs")}
          className={`text-sm font-black tracking-widest uppercase transition-all pb-2 border-b-2 ${activeTab === 'songs' ? 'border-spotify-green text-white' : 'border-transparent text-spotify-light hover:text-white'}`}
        >
          Music Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`text-sm font-black tracking-widest uppercase transition-all pb-2 border-b-2 ${activeTab === 'users' ? 'border-spotify-green text-white' : 'border-transparent text-spotify-light hover:text-white'}`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`text-sm font-black tracking-widest uppercase transition-all pb-2 border-b-2 ${activeTab === 'analytics' ? 'border-spotify-green text-white' : 'border-transparent text-spotify-light hover:text-white'}`}
        >
          Insights & Analytics
        </button>
      </div>
      {
        activeTab === 'songs' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Modern Upload Form */}
            <section className="xl:col-span-1 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl h-fit">
              <div className="flex gap-4 mb-8 bg-black/20 p-1 rounded-xl">
                <button
                  onClick={() => setMusicMode('song')}
                  className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${musicMode === 'song' ? 'bg-spotify-green text-black shadow-lg' : 'text-spotify-light hover:text-white'}`}
                >
                  Single Track
                </button>
                <button
                  onClick={() => setMusicMode('album')}
                  className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${musicMode === 'album' ? 'bg-spotify-green text-black shadow-lg' : 'text-spotify-light hover:text-white'}`}
                >
                  Create Album
                </button>
              </div>

              {musicMode === 'song' ? (
                <form onSubmit={addOrUpdateSong} className="flex flex-col gap-8">
                  <div className="group">
                    <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Cover Image</label>
                    <div className="relative aspect-square w-full bg-spotify-gray rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-spotify-green/50 transition-all cursor-pointer">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-spotify-light">
                          <span className="text-4xl mb-2">📸</span>
                          <p className="text-xs font-bold">Click to upload</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageChange(e, 'song')}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <input
                      value={song.title}
                      placeholder="Song Title"
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green"
                      onChange={e => setSong({ ...song, title: e.target.value })}
                    />
                    <input
                      value={song.artist}
                      placeholder="Artist"
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green"
                      onChange={e => setSong({ ...song, artist: e.target.value })}
                    />
                    <select
                      value={song.albumId}
                      onChange={e => setSong({ ...song, albumId: e.target.value })}
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green appearance-none cursor-pointer text-spotify-light"
                    >
                      <option value="">No Album (Single)</option>
                      {albums.map(alb => (
                        <option key={alb.id} value={alb.id} className="bg-spotify-gray text-white">{alb.title}</option>
                      ))}
                    </select>
                    <div>
                      <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Audio URL / Track</label>
                      <div className="flex gap-2">
                        <input
                          value={song.audioUrl}
                          placeholder="Paste audio link here..."
                          className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green flex-1"
                          onChange={e => setSong({ ...song, audioUrl: e.target.value })}
                        />
                        <div className="relative group overflow-hidden">
                          <button type="button" className="h-full px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-xs uppercase">
                            {audioFile ? "✓ File Selected" : "📁 Upload"}
                          </button>
                          <input
                            type="file"
                            accept="audio/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleAudioChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="spotify-button w-full !rounded-xl !py-4 shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <>{editingSong ? '✏️ Update Track' : '🚀 Publish Track'}</>}
                  </button>
                  {editingSong && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-3 border border-white/20 rounded-xl text-spotify-light hover:text-white hover:bg-white/5 transition-all font-bold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              ) : (
                <form onSubmit={addAlbum} className="flex flex-col gap-8">
                  <div className="group">
                    <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Album Art</label>
                    <div className="relative aspect-square w-full bg-spotify-gray rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-spotify-green/50 transition-all cursor-pointer">
                      {albumPreview ? (
                        <img src={albumPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-spotify-light">
                          <span className="text-4xl mb-2">💿</span>
                          <p className="text-xs font-bold">Click to upload</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageChange(e, 'album')}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <input
                      value={album.title}
                      placeholder="Album Title"
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green"
                      onChange={e => setAlbum({ ...album, title: e.target.value })}
                    />
                    <input
                      value={album.artist}
                      placeholder="Artist"
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green"
                      onChange={e => setAlbum({ ...album, artist: e.target.value })}
                    />
                    <input
                      value={album.desc}
                      placeholder="Description / Release Year"
                      className="spotify-input !mb-0 !bg-white/5 !border-white/10 focus:!border-spotify-green"
                      onChange={e => setAlbum({ ...album, desc: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={album.bgColor}
                        onChange={e => setAlbum({ ...album, bgColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border-none"
                      />
                      <span className="text-xs font-bold text-spotify-light">Theme Color</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="spotify-button w-full !rounded-xl !py-4 shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <>💾 Create Album</>}
                  </button>
                </form>
              )}

            </section>

            {/* Catalog */}
            <section className="xl:col-span-2 bg-black/20 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">Live Catalog</h2>
              <div className="space-y-2">
                {musicMode === 'song' ? (
                  songs.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all group">
                      <span className="w-4 text-[10px] font-black text-spotify-light">{idx + 1}</span>
                      <div className="w-12 h-12 rounded-lg bg-spotify-gray overflow-hidden shrink-0">
                        {s.image && <img src={s.image} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{s.title}</p>
                        <p className="text-[10px] text-spotify-light font-bold uppercase">{s.artist}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditSong(s)} className="text-blue-500/50 hover:text-blue-500 p-2 bg-blue-500/10 rounded-lg" title="Edit">✏️</button>
                        <button onClick={() => deleteSong(s.id)} className="text-red-500/50 hover:text-red-500 p-2 bg-red-500/10 rounded-lg" title="Delete">🗑</button>
                      </div>
                    </div>
                  ))
                ) : (
                  albums.map((alb, idx) => (
                    <div key={alb.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all group">
                      <span className="w-4 text-[10px] font-black text-spotify-light">{idx + 1}</span>
                      <div className="w-12 h-12 rounded-lg bg-spotify-gray overflow-hidden shrink-0 border border-white/10">
                        {alb.image ? <img src={alb.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-800">💿</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate text-white">{alb.title}</p>
                        <p className="text-[10px] text-spotify-light font-bold uppercase">{alb.artist} • {alb.songs?.length || 0} tracks</p>
                      </div>
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: alb.bgColor }}></div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : activeTab === 'users' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* User Form */}
            <section className="xl:col-span-1 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl h-fit sticky top-4">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-spotify-green/20 rounded-full flex items-center justify-center text-spotify-green">👤</span>
                {editingUser ? "Edit Profile" : "Add Admin/User"}
              </h2>

              <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="flex flex-col gap-10">
                <div>
                  <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Full Name</label>
                  <input
                    value={editingUser ? editingUser.name : newUser.name}
                    placeholder="Full Name"
                    className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                    onChange={e => editingUser ? setEditingUser({ ...editingUser, name: e.target.value }) : setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Email / Username</label>
                  <input
                    value={editingUser ? editingUser.username : newUser.username}
                    placeholder="Email address"
                    className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                    onChange={e => editingUser ? setEditingUser({ ...editingUser, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">{editingUser ? "Change Password (optional)" : "Set Password"}</label>
                  <input
                    type="password"
                    value={editingUser ? (editingUser.password || "") : newUser.password}
                    placeholder={editingUser ? "Leave blank to keep current" : "Password"}
                    className="spotify-input !mb-0 !bg-white/5 !border-white/10"
                    onChange={e => editingUser ? setEditingUser({ ...editingUser, password: e.target.value }) : setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-spotify-light mb-2 block uppercase tracking-widest">Assign Role</label>
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
                    {loading ? "..." : (editingUser ? "Save Changes" : "Create Account")}
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
              <h2 className="text-2xl font-bold mb-8 text-white">Member Directory</h2>
              <div className="space-y-2">
                {users.map((u, idx) => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
                    <span className="w-4 text-[10px] font-black text-spotify-light">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spotify-green/20 to-emerald-900/20 flex items-center justify-center text-spotify-green font-black">
                      {u.name ? u.name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{u.name || "Unnamed User"}</p>
                      <p className="text-[10px] text-spotify-light font-bold truncate lowercase">{u.username}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-spotify-green text-black' : 'bg-white/10 text-spotify-light'}`}>
                        {u.role}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-2 bg-white/10 hover:bg-spotify-green hover:text-black rounded-lg transition-all"
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                          title="Delete User"
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
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Plays", val: "124.5k", hint: "↑ 12% this week" },
                { label: "Avg. Session", val: "42m", hint: "↑ 5% this month" },
                { label: "Storage Used", val: "82 GB", hint: "of 500GB limit" },
                { label: "API Requests", val: "1.2M", hint: "Stable performance" }
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                  <p className="text-[10px] font-black text-spotify-light uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-3xl font-black mb-2">{stat.val}</p>
                  <p className="text-[10px] text-spotify-green font-bold">{stat.hint}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6">User Growth (Last 7 Days)</h2>
                <div className="h-64 flex items-end gap-2">
                  {[40, 60, 45, 90, 75, 120, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-spotify-green/20 to-spotify-green rounded-t-lg transition-all hover:scale-105 cursor-pointer relative group" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">+{h} Users</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-black text-spotify-light uppercase tracking-widest">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6">Device Distribution</h2>
                <div className="space-y-6">
                  {[
                    { name: "Mobile App", percent: 65, color: "bg-spotify-green" },
                    { name: "Web Player", percent: 25, color: "bg-blue-500" },
                    { name: "Desktop", percent: 10, color: "bg-purple-500" }
                  ].map(device => (
                    <div key={device.name} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>{device.name}</span>
                        <span className="text-white">{device.percent}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${device.color} shadow-[0_0_10px_rgba(29,185,84,0.3)]`} style={{ width: `${device.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
