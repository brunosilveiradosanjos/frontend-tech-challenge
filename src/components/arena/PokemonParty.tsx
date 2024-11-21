import { useEffect, useState } from "react";
import axios from "axios";

type Pokemon = {
    name: string;
    url: string;
};

type PokemonType = {
    id: number;
    name: string;
    pokemon: { pokemon: Pokemon }[];
};

type PokemonPartyProps = {
    onPartySelect: (selectedParty: Pokemon[]) => void;
};

export function PokemonParty({ onPartySelect }: PokemonPartyProps) {
    const [pokemonType, setPokemonType] = useState<PokemonType | null>(null);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);

    useEffect(() => {
        // Fetch Pokémon of a specific type (e.g., Fire type with ID 10)
        axios.get("https://pokeapi.co/api/v2/type/10")
            .then(response => setPokemonType(response.data))
            .catch(error => console.error("Error fetching Pokémon type data:", error));
    }, []);

    const handleSelectPokemon = (pokemon: Pokemon) => {
        if (!selectedPokemon.find(p => p.name === pokemon.name)) {
            setSelectedPokemon([...selectedPokemon, pokemon]);
        }
    };

    const handleConfirmParty = () => {
        onPartySelect(selectedPokemon);
    };

    return (
        <div className="pokemon-party">
            <h2 className="text-2xl font-bold">Select Pokémon for Your Party</h2>
            <div className="pokemon-list grid grid-cols-3 gap-4 mt-4">
                {pokemonType?.pokemon.map(({ pokemon }) => (
                    <div
                        key={pokemon.name}
                        className="pokemon-card p-4 border rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectPokemon(pokemon)}
                    >
                        {pokemon.name}
                    </div>
                ))}
            </div>
            <div className="selected-party mt-4">
                <h3 className="text-xl font-bold">Selected Party</h3>
                <ul>
                    {selectedPokemon.map(pokemon => (
                        <li key={pokemon.name}>{pokemon.name}</li>
                    ))}
                </ul>
            </div>
            <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleConfirmParty}
            >
                Confirm Party
            </button>
        </div>
    );
}
