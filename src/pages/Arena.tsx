import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorageService } from "../services/LocalStorage.service";
import { TrainerCard } from "../components/trainer/TrainerCard";
import { ModalProvider } from "../components/generic/ModalContext";
import { Modal } from "../components/generic/Modal";
import { TrainerWithParty } from "../assets/schemas/trainerWithParty.schema";
import { BattleStatus } from "../assets/enums/battleStatus.enum";
import { PokemonParty } from "../components/arena/PokemonParty";
import { BattleAnalysis } from "../components/arena/BattleAnalysis";

export function Arena() {
    const [selectedTrainers, setSelectedTrainers] = useState<TrainerWithParty[]>([])
    const [currentBattleStatus, setCurrentBattleStatus] = useState<BattleStatus>(BattleStatus.selectTrainers)
    
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch selected trainers from local storage
        setSelectedTrainers(LocalStorageService.getSelectedTrainers())
    }, []);

    const handleNextStage = () => {
        setCurrentBattleStatus((prevStatus) =>
            prevStatus < BattleStatus.battleAnalise ? prevStatus + 1 : prevStatus
        );
    };

    // If there is only one trainer selected, display a message and a button to go to the Trainer page
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
                <button disabled={currentBattleStatus >= BattleStatus.selectParty1}
                    className="btn bg-blue-500 rounded-md"
                    onClick={handleNextStage}
                >
                    Battle
                </button>
            </div>
        </div>
    );
}