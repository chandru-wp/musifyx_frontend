import { createContext, useState, useRef, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
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
        audio.volume = volume;
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

    const changeVolume = (newVolume) => {
        const audio = audioRef.current;
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    const downloadCurrentSong = () => {
        if (!currentSong?.audioUrl) {
            alert("No song is currently playing");
            return;
        }

        // Create a temporary link to download
        const link = document.createElement("a");
        link.href = currentSong.audioUrl;
        link.download = `${currentSong.title} - ${currentSong.artist}.mp3`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            progress,
            duration,
            volume,
            playSong,
            togglePlay,
            seek,
            changeVolume,
            downloadCurrentSong
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
