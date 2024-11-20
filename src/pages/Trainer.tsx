import { useState, useEffect } from 'react';
import { z } from 'zod';
import { fetchTrainers } from '../services/Trainer.service';
import { LocalStorageService } from '../services/LocalStorage.service';
import { TrainerResponseSchema } from '../assets/schemas/trainer.schema';
import { TrainerSummary } from '../components/trainer/TrainerSummary';
import { SearchBar } from '../components/generic/SearchBar';
import { Pagination } from '../components/generic/Pagination';
import { TrainerSelected } from '../components/trainer/TrainerSelected';
import { ModalProvider } from '../components/generic/ModalContext';
import { Modal } from '../components/generic/Modal';

type TrainerResponse = z.infer<typeof TrainerResponseSchema>;
type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

export function Trainer() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [info, setInfo] = useState<TrainerResponse['info'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState(1);

    // State to manage selected trainers
    const [selectedTrainers, setSelectedTrainers] = useState<Trainer[]>([]);

    // Load trainers on mount or when query/page changes
    useEffect(() => {
        const loadTrainers = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTrainers({ query, page });
                setTrainers(data.results);
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
    const handleToggleTrainer = (trainer: Trainer) => {
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
        <div className='page flex flex-col items-center justify-center space-y-4'>
            <h1 className="text-3xl font-bold">Rick and Morty Trainers</h1>
            <SearchBar query={query} onSearch={handleSearch} onClearSearch={handleClearSearch} />
            <TrainerSelected selectedTrainers={selectedTrainers} />
            {
                isLoading ? (
                    <div className='page h-full w-full flex justify-center items-center'>Loading...</div>
                ) : trainers.length === 0 ?
                    (
                        <div className='page h-full w-full flex justify-center items-center'>No trainers found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {trainers.map((trainer) => (
                                <ModalProvider key={trainer.id * 2}>
                                    <TrainerSummary key={trainer.id} trainer={trainer} selectedTrainers={selectedTrainers} onToggleTrainer={handleToggleTrainer} />
                                    <Modal key={trainer.id * 3} />
                                </ModalProvider>
                            ))}
                        </div>
                    )}
            <Pagination page={page} totalPages={info?.pages ?? 1} onNext={handleNextPage} onPrev={handlePrevPage} />
        </div>
    );
}
