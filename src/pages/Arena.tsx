import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorageService } from "../services/LocalStorage.service";
import { TrainerCard } from "../components/trainer/TrainerCard";
import { ModalProvider } from "../components/generic/ModalContext";
import { Modal } from "../components/generic/Modal";
import { TrainerWithParty } from "../assets/schemas/trainerWithParty.schema";
import { BattleStatus } from "../assets/enums/battleStatus.enum";
import { PokemonParty } from "../components/arena/PokemonParty";
import { BattleAnalysis } from "../components/arena/BattleAnalysis";
import backgroundMusic from '../assets/audio/battle.mp3';

export function Arena() {
    const [selectedTrainers, setSelectedTrainers] = useState<TrainerWithParty[]>([])
    const [currentBattleStatus, setCurrentBattleStatus] = useState<BattleStatus>(BattleStatus.selectTrainers)
    const [battleStarted, setBattleStarted] = useState(false);
    const [battleFinished, setBattleFinished] = useState(false);
    const navigate = useNavigate();
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
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

    useEffect(() => {
        setSelectedTrainers(LocalStorageService.getSelectedTrainers())
    }, []);

    useEffect(() => {
        if (battleStarted && currentBattleStatus < BattleStatus.battleAnalise) {
            const timer = setTimeout(() => {
                setCurrentBattleStatus((prevStatus) => prevStatus + 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
        if (currentBattleStatus === BattleStatus.battleAnalise) {
            setBattleStarted(false);
            setBattleFinished(true);
        }
        // Use setTimeout to scroll after the new content has been rendered
        setTimeout(scrollToBottom, 100);
    }, [battleStarted, currentBattleStatus, scrollToBottom]);

    const handleNextStage = () => {
        if (battleFinished) {
            window.location.reload();
            return;
        }
        setBattleStarted(true);
        setCurrentBattleStatus(BattleStatus.selectParty1);
    };

    if (selectedTrainers.length < 2) {
        return (
            <div className="page">
                <p className="text-gray-500 mb-4">Please select two trainers to battle.</p>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/trainer')}
                >
                    Go to Trainers
                </button>
            </div>
        );
    }

    const renderComponents = () => {
        const components = [];

        if (currentBattleStatus >= BattleStatus.selectParty1) {
            components.push(
                <div key="selectParty1" className="mb-4">
                    <PokemonParty trainerId={selectedTrainers[0].id} />
                </div>
            );
        }

        if (currentBattleStatus >= BattleStatus.selectParty2) {
            components.push(
                <div key="selectParty2" className="mb-4">
                    <PokemonParty trainerId={selectedTrainers[1].id} />
                </div>
            );
        }

        if (currentBattleStatus >= BattleStatus.battleAnalise) {
            components.push(
                <div key="battleAnalise" className="mb-4">
                    <BattleAnalysis />
                </div>
            );
        }

        // Scroll to bottom when battle status changes
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        return components;
    };

    return (
        <div className="page">
            <h1 className="text-3xl font-bold">Arena</h1>
            <div className="flex justify-center gap-8 mt-8">
                <ModalProvider key={`${selectedTrainers[0].id}-${selectedTrainers[0].name}`}>
                    <div className="grid grid-flow-row lg:grid-flow-col justify-center items-center">
                        <TrainerCard key={`${selectedTrainers[0].id}-${selectedTrainers[0].type}`} trainer={selectedTrainers[0]} selectedTrainers={selectedTrainers} />
                        <Modal key={`${selectedTrainers[0].id}-${selectedTrainers[0].status}`} />
                        <div className="text-center w-full text-2xl font-bold p-4">
                            VS
                        </div>
                        <TrainerCard key={`${selectedTrainers[1].id}-${selectedTrainers[1].type}`} trainer={selectedTrainers[1]} selectedTrainers={selectedTrainers} />
                    </div>
                </ModalProvider>
            </div>
            <div>
                {renderComponents()}
            </div>
            <div className="flex justify-center mt-8">
                <button
                    disabled={battleStarted}
                    className={`btn ${battleStarted ? 'bg-gray-400' : 'bg-blue-500'} rounded-md`}
                    onClick={handleNextStage}
                >
                    {battleStarted ? 'Battle in Progress' : battleFinished ? 'Battle Again' : 'Start Battle'}
                </button>
            </div>
            {/* This is the element we'll scroll to */}
            <div className='fixed bottom-2 right-2'>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="mt-8 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
                >
                    {isMuted ? '🔇 Unmute' : '🔊 Mute'} Music
                </button>
            </div>
            <div ref={bottomRef} />
        </div>
    );
}