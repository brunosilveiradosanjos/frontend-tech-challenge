import { PokemonWithDamage, TrainerWithParty } from "../assets/schemas/trainerWithParty.schema";

const STORAGE_KEY = 'selectedTrainers';

export const LocalStorageService = {
    // Retrieve trainers from local storage, ensuring no more than 2 trainers
    getSelectedTrainers: (): TrainerWithParty[] => {
        const storedTrainers = localStorage.getItem(STORAGE_KEY);
        const parsedTrainers = storedTrainers ? JSON.parse(storedTrainers) : [];
        // Enforce a maximum of 2 trainers
        const validTrainers = parsedTrainers.slice(0, 2);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validTrainers));
        return validTrainers;
    },

    // Add a trainer, replacing the second one if necessary
    addTrainer: (trainer: TrainerWithParty): TrainerWithParty[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();

        let updatedTrainers;
        if (selectedTrainers.length < 2) {
            // Add trainer if less than 2 trainers are selected
            updatedTrainers = [...selectedTrainers, trainer];
        } else {
            // Replace the second trainer if 2 trainers are already selected
            updatedTrainers = [selectedTrainers[0], trainer];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrainers));
        return updatedTrainers;
    },

    // Remove a trainer by ID
    removeTrainer: (trainerId: number): TrainerWithParty[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const updatedTrainers = selectedTrainers.filter((t) => t.id !== trainerId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrainers));
        return updatedTrainers;
    },

    // Toggle trainer selection (add or remove)
    toggleTrainerSelection: (trainer: TrainerWithParty): TrainerWithParty[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const isSelected = selectedTrainers.some((t) => t.id === trainer.id);

        if (isSelected) {
            // Remove trainer if already selected
            return LocalStorageService.removeTrainer(trainer.id);
        } else {
            // Add trainer, enforcing the 2-trainer limit
            return LocalStorageService.addTrainer(trainer);
        }
    },
    // Save the Pokemon party with damage relations for a given trainer
    savePokemonParty: (trainerId: number, party: PokemonWithDamage[]): void => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const updatedTrainers = selectedTrainers.map((t) => {
            if (t.id === trainerId) {
                return { ...t, party };
            }
            return t;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrainers));
    }
};
