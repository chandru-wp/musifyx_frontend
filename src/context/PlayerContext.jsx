import { createContext, useState, useRef, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const onEnded = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", onEnded);
        };
    }, []);

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
            return;
        }

        const audio = audioRef.current;
        audio.src = song.audioUrl;
        audio.volume = 0.5; // Default volume
        console.log("Playing:", song.audioUrl);

        audio.play()
            .then(() => {
                setIsPlaying(true);
                setCurrentSong(song);
            })
            .catch(err => {
                console.error("Playback failed:", err);
                alert("Playback failed. Check the audio URL.");
                setIsPlaying(false);
            });
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            if (currentSong) {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    const seek = (time) => {
        const audio = audioRef.current;
        audio.currentTime = time;
        setProgress(time);
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, progress, duration, playSong, togglePlay, seek }}>
            {children}
        </PlayerContext.Provider>
    );
};
