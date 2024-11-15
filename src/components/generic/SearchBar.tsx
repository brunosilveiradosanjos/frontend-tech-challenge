// SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
    query: string;
    onSearch: (query: string) => void;
    onClearSearch: () => void;
}

export function SearchBar({ query, onSearch, onClearSearch }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState(query);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchInput); // Pass the search input as a string
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-row space-x-2">
            <input
                type="text"
                name="searchInput"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search Trainers"
                className="p-2 border rounded"
            />
            <button type="submit" className="w-20 p-2 bg-blue-500 text-white rounded">Search</button>
            <button type="button" onClick={onClearSearch} className="w-20 p-2 bg-red-500 text-white rounded">Clear</button>
        </form>
    );
}
