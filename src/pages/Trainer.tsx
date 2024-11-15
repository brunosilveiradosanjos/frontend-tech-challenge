// src/pages/Trainer.tsx

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { fetchTrainers } from '../services/Trainer.service';
import { TrainerResponseSchema } from '../assets/schemas/trainer.schema';
import { TrainerSummary } from '../components/trainer/TrainerSummary';
import { SearchBar } from '../components/generic/SearchBar';
import { Pagination } from '../components/generic/Pagination';

type TrainerResponse = z.infer<typeof TrainerResponseSchema>;
type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];

export function Trainer() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [info, setInfo] = useState<TrainerResponse['info'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState(1);

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
            <h1 className="text-3xl font-bold mb-6">Rick and Morty Trainers</h1>
            <SearchBar query={query} onSearch={handleSearch} onClearSearch={handleClearSearch} />
            {
                isLoading ? <div className='page h-full w-full flex justify-center items-center'>Loading...</div> :
                    (
                        trainers.length === 0 ? <div className='page h-full w-full flex justify-center items-center'>No trainers found</div> :
                            (
                                <div className="flex flex-wrap justify-center">
                                    {trainers.map((trainer) => (
                                        <TrainerSummary key={trainer.id} trainer={trainer} />
                                    ))}
                                </div>
                            )
                    )
            }
            <Pagination page={page} totalPages={info?.pages ?? 1} onNext={handleNextPage} onPrev={handlePrevPage} />
        </div>
    );
};
