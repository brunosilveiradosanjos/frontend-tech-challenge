import { useState, useEffect } from 'react';
import { z } from 'zod';
import { fetchTrainers } from '../services/Trainer.service';
import { LocalStorageService } from '../services/LocalStorage.service';
import { TrainerResponseSchema } from '../assets/schemas/trainer.schema';
import { SearchBar } from '../components/generic/SearchBar';
import { Pagination } from '../components/generic/Pagination';
import { ModalProvider } from '../components/generic/ModalContext';
import { Modal } from '../components/generic/Modal';
import { TrainersSelectedToBattle } from '../components/trainer/TrainersSelectedToBattle';
import { TrainerCard } from '../components/trainer/TrainerCard';
import { PokemonService } from '../services/Pokemon.service';
import { TrainerWithParty } from '../assets/schemas/trainerWithParty.schema';

type TrainerResponse = z.infer<typeof TrainerResponseSchema>;

export function Trainer() {
    const [trainers, setTrainers] = useState<TrainerWithParty[]>([]);
    const [info, setInfo] = useState<TrainerResponse['info'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState(1);

    // State to manage selected trainers
    const [selectedTrainers, setSelectedTrainers] = useState<TrainerWithParty[]>([]);

    // Load trainers on mount or when query/page changes
    useEffect(() => {
        const loadTrainers = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTrainers({ query, page });
                // Convert fetched trainers to TrainerWithParty
                const trainersWithParty: TrainerWithParty[] = data.results.map((trainer) => ({
                    ...trainer,
                    party: [], // Initialize the party as an empty array
                }));
                setTrainers(trainersWithParty);
                setInfo(data.info);
            } catch (error) {
                console.error('Trainer error:', error);
                setTrainers([]);
                setInfo({ count: 0, pages: 1, next: null, prev: null });
            } finally {
                setIsLoading(false);
            }
        };

        loadTrainers();
    }, [query, page]);

    // Load initial selected trainers from LocalStorage
    useEffect(() => {
        const storedTrainers = LocalStorageService.getSelectedTrainers();
        setSelectedTrainers(storedTrainers.slice(0, 2)); // Ensure max 2 trainers on initial load
    }, []);

    // Handle toggling a trainer's selection
    const handleToggleTrainer = async (trainer: TrainerWithParty) => {
        if (trainer.party.length === 0) {
            const pokemon = await PokemonService.getPokemonById(trainer.id);
            if (pokemon) trainer.party.push(pokemon)
        }
        const updatedTrainers = LocalStorageService.toggleTrainerSelection(trainer);
        setSelectedTrainers(updatedTrainers.slice(0, 2)); // Ensure max 2 trainers
    };

    const handleSearch = (searchQuery: string) => {
        setSearchQuery(searchQuery);
        setPage(1);
    };

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, info?.pages ?? prev));
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    return (
        <div className='page'>
            <h1 className="text-3xl font-bold">Rick and Morty Trainers</h1>
            <SearchBar query={query} onSearch={handleSearch} onClearSearch={handleClearSearch} />
            <TrainersSelectedToBattle selectedTrainers={selectedTrainers} />
            {
                isLoading ? (
                    <div className='page h-full w-full flex justify-center items-center'>Loading...</div>
                ) : trainers.length === 0 ?
                    (
                        <div className='page h-full w-full flex justify-center items-center'>No trainers found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {trainers.map((trainer) => (
                                <ModalProvider key={trainer.id * 22}>
                                    <TrainerCard
                                        key={trainer.id}
                                        trainer={trainer}
                                        selectedTrainers={selectedTrainers}
                                        onToggleTrainer={handleToggleTrainer}
                                    />
                                    <Modal key={trainer.id * 33} />
                                </ModalProvider>
                            ))}
                        </div>
                    )}
            <Pagination page={page} totalPages={info?.pages ?? 1} onNext={handleNextPage} onPrev={handlePrevPage} />
        </div>
    );
}
