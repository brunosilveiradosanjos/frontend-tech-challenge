import { TrainerWithParty } from '../../assets/schemas/trainerWithParty.schema';
import { useModal } from '../generic/ModalContext';

interface TrainerCardProps {
    trainer: TrainerWithParty;
    selectedTrainers: TrainerWithParty[];
    onToggleTrainer?: (trainer: TrainerWithParty) => void;
}

export function TrainerCard({ trainer, selectedTrainers, onToggleTrainer }: TrainerCardProps) {
    const { openModal } = useModal();
    const isSelected = selectedTrainers.some((t) => t.id === trainer.id);
    const isAddDisabled = !onToggleTrainer

    const handleFavoritePokemonClick = () => {
        openModal(trainer.id);
    }

    const handleAddTrainer = () => {
        if (onToggleTrainer) {
            onToggleTrainer(trainer);
        }
    }

    return (
        <div className={`${isSelected ? 'bg-green-300' : 'bg-gray-200'}`}>
            <div className="max-w-[300px] mx-auto text-center shadow-lg">
                <div className="h-[30rem] flex flex-col justify-between">
                    <img src={trainer.image || ""} alt={trainer.name} className="w-full" />
                    <h2 className="text-xl font-semibold mt-2">{trainer.name}</h2>
                    <p className="text-gray-500 text-lg">{trainer.status}</p>
                    <p>{trainer.species}</p>
                    <button onClick={handleFavoritePokemonClick}>Favorite Pokemon</button>
                    {selectedTrainers.length >= 2 && !isSelected && (
                        <p className="text-red-500 text-sm mt-2">
                            Maximum of 2 trainers selected.
                        </p>
                    )}
                </div>
                <button
                    onClick={handleAddTrainer}
                    disabled={isAddDisabled}
                    className={`btn ${isSelected && !isAddDisabled ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {isSelected ? 'Remove' : 'Add'}
                </button>
            </div>
        </div>
    );
}