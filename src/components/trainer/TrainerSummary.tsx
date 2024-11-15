import { z } from 'zod';
import { TrainerResponseSchema } from '../../assets/schemas/trainer.schema';

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

interface TrainerSummaryProps {
    trainer: Trainer;
    selectedTrainers: Trainer[];
    onToggleTrainer: (trainer: Trainer) => void;
}

export function TrainerSummary({ trainer, selectedTrainers, onToggleTrainer }: TrainerSummaryProps) {
    const isSelected = selectedTrainers.some((t) => t.id === trainer.id);
    const isAddDisabled = !isSelected && selectedTrainers.length >= 2;

    return (
        <div className={`${isSelected ? 'bg-green-300' : 'bg-white'}`}>
            <div className="max-w-[300px] mx-auto text-center shadow-lg">
                <div className="h-[30rem] flex flex-col justify-between">
                    <img src={trainer.image || ""} alt={trainer.name} className="w-full" />
                    <h2 className="text-xl font-semibold mt-2">{trainer.name}</h2>
                    <p className="text-gray-500 text-lg">{trainer.status}</p>
                    <p>{trainer.species}</p>
                    {selectedTrainers.length >= 2 && !isSelected && (
                        <p className="text-red-500 text-sm mt-2">
                            Maximum of 2 trainers selected.
                        </p>
                    )}
                    <button
                        onClick={() => onToggleTrainer(trainer)}
                        disabled={isAddDisabled}
                        className={`w-full py-2 text-lg cursor-pointer ${isSelected ? 'bg-red-500' : isAddDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                            } text-white`}
                    >
                        {isSelected ? 'Remove' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
