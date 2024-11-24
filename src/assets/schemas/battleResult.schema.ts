export type BattleResult = {
    winner: string;
    scores: {
        trainer1: { name: string; score: number };
        trainer2: { name: string; score: number };
    };
    pokemonResults: {
        trainer1: { name: string; score: number }[];
        trainer2: { name: string; score: number }[];
    };
};