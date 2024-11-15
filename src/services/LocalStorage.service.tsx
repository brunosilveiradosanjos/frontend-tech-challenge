// src/services/LocalStorage.service.tsx

import { z } from 'zod';
import { TrainerResponseSchema } from '../assets/schemas/trainer.schema';

type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

const STORAGE_KEY = 'selectedTrainers';

export const LocalStorageService = {
    getSelectedTrainers: (): Trainer[] => {
        const storedTrainers = localStorage.getItem(STORAGE_KEY);
        return storedTrainers ? JSON.parse(storedTrainers) : [];
    },

    addTrainer: (trainer: Trainer): Trainer[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const updatedTrainers = [...selectedTrainers, trainer];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrainers));
        return updatedTrainers;
    },

    removeTrainer: (trainerId: number): Trainer[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const updatedTrainers = selectedTrainers.filter((t) => t.id !== trainerId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrainers));
        return updatedTrainers;
    },

    toggleTrainerSelection: (trainer: Trainer): Trainer[] => {
        const selectedTrainers = LocalStorageService.getSelectedTrainers();
        const isSelected = selectedTrainers.some((t) => t.id === trainer.id);

        return isSelected
            ? LocalStorageService.removeTrainer(trainer.id)
            : LocalStorageService.addTrainer(trainer);
    }
};
