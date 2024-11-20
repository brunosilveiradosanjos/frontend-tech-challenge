import { useEffect, useState } from "react";
import { LocalStorageService } from "../services/LocalStorage.service";
import { z } from "zod";
import { TrainerResponseSchema } from "../assets/schemas/trainer.schema";
import { useNavigate } from "react-router-dom";
import { TrainerCard } from "../components/trainer/TrainerCard";
import { ModalProvider } from "../components/generic/ModalContext";
import { Modal } from "../components/generic/Modal";

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

export function Arena() {
    const [selectedTrainers, setSelectedTrainers] = useState<Trainer[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch selected trainers from local storage
        setSelectedTrainers(LocalStorageService.getSelectedTrainers())
    }, []);

    // If there is only one trainer selected, display a message and a button to go to the Trainer page
    if (selectedTrainers.length < 2) {
        return (
            <div className="page">
                <h1 className="text-2xl">Arena</h1>
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

    const handleBattle = () => {
        // Implement battle logic here
        console.log("Battle started!");
    };

    return (
        <div className="page">
            <h1 className="text-2xl">Arena</h1>
            <div className="flex justify-center gap-8 mt-8">
                <ModalProvider key={selectedTrainers[0].id * 2}>
                    <TrainerCard key={selectedTrainers[0].id} trainer={selectedTrainers[0]} selectedTrainers={selectedTrainers} />
                    <Modal key={selectedTrainers[0].id * 3} />
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">VS</span>
                    </div>
                    <TrainerCard key={selectedTrainers[1].id} trainer={selectedTrainers[1]} selectedTrainers={selectedTrainers} />
                </ModalProvider>
            </div>
            <div className="flex justify-center mt-8">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleBattle}
                >
                    Battle
                </button>
            </div>
        </div>
    );
}