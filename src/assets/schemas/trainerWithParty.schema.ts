import { z } from 'zod';
import { TrainerResponseSchema } from './trainer.schema';
import { PokemonSchema } from './pokemon.schema';


// Define the Trainer and Pokemon types based on your schemas
export type Trainer = z.infer<typeof TrainerResponseSchema>['results'][number];
export type Pokemon = z.infer<typeof PokemonSchema>;

export type PokemonWithDamage = Pokemon & {
    damageRelations?: {
        doubleDamageFrom: string[];
        halfDamageFrom: string[];
        noDamageFrom: string[];
    };
};

// Define the TrainerWithParty type
export type TrainerWithParty = Trainer & { party: PokemonWithDamage[] };