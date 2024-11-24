import { useState, useEffect } from "react";
import { BattleResult } from "../../assets/schemas/battleResult.schema";
import { PokemonWithDamage, TrainerWithParty } from "../../assets/schemas/trainerWithParty.schema";
import { LocalStorageService } from "../../services/LocalStorage.service";

export function BattleAnalysis() {
    const [trainers, setTrainers] = useState<TrainerWithParty[]>([]);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

    // First useEffect to load trainers from localStorage
    useEffect(() => {
        const localStorageTrainers = LocalStorageService.getSelectedTrainers();
        setTrainers(localStorageTrainers);
    }, []); // Empty dependency array as we only want to load once

    // Second useEffect to simulate battle when trainers are loaded
    useEffect(() => {
        if (trainers.length === 2) {
            const result = simulateBattle(trainers[0].party, trainers[1].party);
            setBattleResult(result);
        }
    }, [trainers]); // Only re-run when trainers change

    const simulateBattle = (team1: PokemonWithDamage[], team2: PokemonWithDamage[]): BattleResult => {
        const pokemonResults1 = team1.map(pokemon => ({ name: pokemon.name, score: 0 }));
        const pokemonResults2 = team2.map(pokemon => ({ name: pokemon.name, score: 0 }));
        for (let i = 0; i < team1.length; i++) {
            const pokemon1 = team1[i];
            for (let j = 0; j < team2.length; j++) {
                const pokemon2 = team2[j];
                const pokemon1BattleScore = calculatePokemonBattleScore(pokemon1, pokemon2)
                const pokemon2BattleScore = calculatePokemonBattleScore(pokemon2, pokemon1)
                if (pokemon1BattleScore > pokemon2BattleScore) {
                    pokemonResults1[i].score++
                } else if (pokemon2BattleScore > pokemon1BattleScore) {
                    pokemonResults2[j].score++
                }
            }
        }

        const trainer1Score = pokemonResults1.map(p => p.score).reduce((prev, curr) => prev + curr)
        const trainer2Score = pokemonResults2.map(p => p.score).reduce((prev, curr) => prev + curr)

        // Determine overall winner
        let winner = "Draw";
        if (trainer1Score > trainer2Score) {
            winner = trainers[0].name;
        } else if (trainer2Score > trainer1Score) {
            winner = trainers[1].name;
        }

        return {
            winner,
            scores: {
                trainer1: { name: trainers[0].name, score: trainer1Score },
                trainer2: { name: trainers[1].name, score: trainer2Score },
            },
            pokemonResults: {
                trainer1: pokemonResults1,
                trainer2: pokemonResults2,
            },
        };
    };

    function calculatePokemonBattleScore(attacker: PokemonWithDamage, defender: PokemonWithDamage): number {
        let attackerScore = 0
        attacker.types.forEach((attackerType) => {
            defender.damageRelations?.doubleDamageFrom.forEach((defenderType) => {
                if (attackerType.type.name === defenderType) {
                    attackerScore++
                }
            })
        })
        return attackerScore
    }

    return (
        <div key="battleAnalysis" className="mb-4 p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Battle Analysis</h2>
            <div className="mt-4">
                {battleResult ? (
                    <>
                        <h3 className="text-lg font-bold mb-2">Battle Results</h3>
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <p className="text-lg font-semibold mb-2">
                                Winner: <span className="text-blue-600">{battleResult.winner}</span>
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="font-medium">{battleResult.scores.trainer1.name}</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {battleResult.scores.trainer1.score}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">{battleResult.scores.trainer2.name}</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {battleResult.scores.trainer2.score}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mt-6 mb-4">Individual Battles</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <h4 className="text-md font-bold mb-2">{battleResult.scores.trainer1.name}'s Pokemon</h4>
                                {battleResult.pokemonResults.trainer1.map((pokemon, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span>{pokemon.name}</span>
                                        <span className="font-medium">Score: {pokemon.score}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-md font-bold mb-2">{battleResult.scores.trainer2.name}'s Pokemon</h4>
                                {battleResult.pokemonResults.trainer2.map((pokemon, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span>{pokemon.name}</span>
                                        <span className="font-medium">Score: {pokemon.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Waiting for battle data...</p>
                )}
            </div>
        </div>
    );
}
