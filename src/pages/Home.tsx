import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/img/home.png';
import backgroundMusic from '../assets/audio/opening-part-1.mp3';

export function Home() {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = new Audio(backgroundMusic);
        audio.loop = true;

        if (!isMuted) {
            audio.play().catch(error => console.error("Audio playback failed:", error));
        }

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [isMuted]);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <img
                src={backgroundImage}
                alt="Pokémon Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                <h1 className="text-6xl font-bold mb-8 animate-pulse">Pokémon Battle Arena</h1>
                <Link
                    to="/trainer"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 transform hover:scale-110"
                >
                    Start Your Journey
                </Link>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="mt-8 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
                >
                    {isMuted ? '🔇 Unmute' : '🔊 Mute'} Music
                </button>
            </div>
        </div>
    );
}