import { useEffect, useState } from "react";
import { PokemonWithDamage, TrainerWithParty } from "../../assets/schemas/trainerWithParty.schema";
import { LocalStorageService } from "../../services/LocalStorage.service";
import { PokemonService } from "../../services/Pokemon.service";

interface PokemonPartyProps {
    trainerId: number;
}

export function PokemonParty({ trainerId }: PokemonPartyProps) {
    const [trainer, setTrainer] = useState<TrainerWithParty | null>(null);
    const [randomPokemon, setRandomPokemon] = useState<PokemonWithDamage[]>([]);

    useEffect(() => {
        const fetchTrainerAndPokemon = async () => {
            const trainers = LocalStorageService.getSelectedTrainers();
            const selectedTrainer = trainers.find(t => t.id === trainerId);

            if (selectedTrainer) {
                setTrainer(selectedTrainer as TrainerWithParty);

                // Fetch the trainer's Pokémon first
                const trainerPokemon = await PokemonService.getPokemonById(trainerId);

                // Fetch 5 additional random Pokemon
                const pokemonPromises = Array(5).fill(null).map(() => {
                    const randomId = Math.floor(Math.random() * 898) + 1;
                    return PokemonService.getPokemonById(randomId);
                });

                const additionalRandomPokemon = await Promise.all(pokemonPromises);
                const allPokemon = [trainerPokemon, ...additionalRandomPokemon];

                // Fetch damage relations for each Pokémon
                const pokemonWithDamage = await Promise.all(allPokemon.map(async (pokemon) => {
                    const typePromises = pokemon.types.map(t => PokemonService.getPokemonTypeById(parseInt(t.type.url.split('/').slice(-2, -1)[0])));
                    const types = await Promise.all(typePromises);

                    const damageRelations = types.reduce((acc, type) => {
                        acc.doubleDamageFrom = [...new Set([...acc.doubleDamageFrom, ...type.damage_relations.double_damage_from.map(t => t.name)])];
                        acc.halfDamageFrom = [...new Set([...acc.halfDamageFrom, ...type.damage_relations.half_damage_from.map(t => t.name)])];
                        acc.noDamageFrom = [...new Set([...acc.noDamageFrom, ...type.damage_relations.no_damage_from.map(t => t.name)])];
                        return acc;
                    }, { doubleDamageFrom: [] as string[], halfDamageFrom: [] as string[], noDamageFrom: [] as string[] });

                    return { ...pokemon, damageRelations };
                }));

                // Save the Pokemon with damage relations to localStorage
                LocalStorageService.savePokemonParty(trainerId, pokemonWithDamage);
                setRandomPokemon(pokemonWithDamage);
            }
        };

        fetchTrainerAndPokemon();
    }, [trainerId]);

    if (!trainer || randomPokemon.length === 0) {
        return <div>Loading...</div>;
    }
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{trainer.name}'s Party</h2>
            <div className="grid grid-cols-3 gap-4">
                {randomPokemon.map((pokemon, index) => (
                    <div key={index} className="border p-2 rounded">
                        <img src={pokemon.sprites.front_default || ""} alt={pokemon.name} className="mx-auto" />
                        <p className="text-center capitalize font-bold">{pokemon.name}</p>
                        <p className="text-center text-sm">Type: {pokemon.types.map(t => t.type.name).join(', ')}</p>
                        {index === 0 && <p className="text-center text-xs text-blue-600">Trainer's Pokémon</p>}
                        <div className="mt-2 text-xs">
                            <p className="font-semibold">Damage Relations:</p>
                            <p className="text-red-500">
                                Weak against: {pokemon.damageRelations?.doubleDamageFrom.join(', ')}
                            </p>
                            <p className="text-green-500">
                                Resistant to: {pokemon.damageRelations?.halfDamageFrom.join(', ')}
                            </p>
                            <p className="text-blue-500">
                                Immune to: {pokemon.damageRelations?.noDamageFrom.join(', ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}