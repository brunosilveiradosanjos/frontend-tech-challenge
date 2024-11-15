// src/components/trainer/TrainerSummary.tsx

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { TrainerResponseSchema } from '../../assets/schemas/trainer.schema';
import { LocalStorageService } from '../../services/LocalStorage.service';

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

interface TrainerSummaryProps {
    trainer: Trainer;
}

export function TrainerSummary({ trainer }: TrainerSummaryProps) {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    // Check if the trainer is already selected on initial render
    useEffect(() => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        setIsSelected(selectedTrainers.some((t) => t.id === trainer.id));
    }, [trainer.id]);

    const handleToggleSelect = () => {
        const updatedTrainers = LocalStorageService.toggleTrainerSelection(trainer);
        setIsSelected(updatedTrainers.some((t) => t.id === trainer.id));
    };

    return (
        <div className={`p-2 ${isSelected ? 'bg-green-100' : 'bg-white'}`}>
            <div className="max-w-[300px] mx-auto text-center shadow-lg">
                <div className="h-[30rem] flex flex-col justify-between">
                    <img
                        src={trainer.image || ""}
                        alt={trainer.name}
                        className="w-full"
                    />
                    <h2 className="text-xl font-semibold mt-2">{trainer.name}</h2>
                    <p className="text-gray-500 text-lg">{trainer.status}</p>
                    <p>{trainer.species}</p>
                    <button
                        onClick={handleToggleSelect}
                        className={`w-full py-2 text-lg cursor-pointer ${isSelected ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                    >
                        {isSelected ? 'Remove' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};
