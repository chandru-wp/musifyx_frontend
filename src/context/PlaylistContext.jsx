import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const { role } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchPlaylists = async () => {
        try {
            const res = await api.get("/playlists");
            setPlaylists(res.data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchPlaylists();
        } else {
            setPlaylists([]);
        }
    }, [role]);

    const createPlaylist = async (name) => {
        try {
            const res = await api.post("/playlists", { name });
            setPlaylists([...playlists, res.data]);
            setShowCreateModal(false);
            return res.data;
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    const deletePlaylist = async (playlistId) => {
        if (!confirm("Are you sure you want to delete this playlist?")) return;
        try {
            await api.delete(`/playlists/${playlistId}`);
            setPlaylists(playlists.filter(p => p.id !== playlistId));
        } catch (error) {
            console.error("Error deleting playlist:", error);
            alert("Failed to delete playlist");
        }
    };

    const addSongToPlaylist = async (playlistId, song) => {
        try {
            const res = await api.post("/playlists/add-song", { playlistId, songId: song.id });
            setPlaylists(playlists.map(p => p.id === playlistId ? res.data : p));
            return res.data;
        } catch (error) {
            console.error("Error adding song:", error);
            alert("Failed to add song to playlist");
        }
    };

    const removeSongFromPlaylist = async (playlistId, songId) => {
        try {
            const res = await api.post("/playlists/remove-song", { playlistId, songId });
            setPlaylists(playlists.map(p => p.id === playlistId ? res.data : p));
            return res.data;
        } catch (error) {
            console.error("Error removing song:", error);
            alert("Failed to remove song");
        }
    };

    const renamePlaylist = async (playlistId, name) => {
        try {
            const res = await api.put(`/playlists/${playlistId}`, { name });
            setPlaylists(playlists.map(p => p.id === playlistId ? res.data : p));
            return res.data;
        } catch (error) {
            console.error("Error renaming playlist:", error);
            alert("Failed to rename playlist");
        }
    };

    return (
        <PlaylistContext.Provider value={{
            playlists,
            createPlaylist,
            deletePlaylist,
            addSongToPlaylist,
            removeSongFromPlaylist,
            renamePlaylist,
            showCreateModal,
            setShowCreateModal,
            fetchPlaylists
        }}>
            {children}
        </PlaylistContext.Provider>
    );
};
