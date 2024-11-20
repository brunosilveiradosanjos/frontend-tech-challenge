import { useEffect, useState } from "react";
import { Pokemon, PokemonService } from "../../services/Pokemon.service";

interface PokemonDetailedProps {
    id: number;
}

export function PokemonDetailed({ id }: PokemonDetailedProps) {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const data = await PokemonService.getPokemonById(id);
                setPokemon(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setPokemon(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [id]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    if (!pokemon) return <div className="text-center p-4">No Pokemon data found</div>;

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-gray-200 p-4">
                <h2 className="text-2xl font-bold text-center capitalize">{pokemon.name}</h2>
            </div>
            <div className="p-4">
                <div className="flex justify-center mb-4">
                    <img
                        src={pokemon.sprites.other.showdown.front_default || pokemon.sprites.front_default || ''}
                        alt={pokemon.name}
                        className="w-32 h-32"
                    />
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Types:</h3>
                    <div className="flex gap-2">
                        {pokemon.types.map((type) => (
                            <span key={type.type.name} className="px-2 py-1 bg-gray-200 rounded-full text-sm capitalize">
                                {type.type.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Abilities:</h3>
                    <ul className="list-disc list-inside">
                        {pokemon.abilities.map((ability) => (
                            <li key={ability.ability.name} className="capitalize">
                                {ability.ability.name} {ability.is_hidden && <span className="text-gray-500">(Hidden)</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Stats:</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {pokemon.stats.map((stat) => (
                            <div key={stat.stat.name} className="flex justify-between">
                                <span className="font-semibold capitalize">{stat.stat.name}:</span>
                                <span>{stat.base_stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}