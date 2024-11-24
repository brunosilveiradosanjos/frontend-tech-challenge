import { z } from 'zod';

const NamedAPIResourceSchema = z.object({
    name: z.string(),
    url: z.string().url(),
});

const GenerationGameIndexSchema = z.object({
    game_index: z.number(),
    generation: NamedAPIResourceSchema,
});

const TypeRelationsSchema = z.object({
    no_damage_to: z.array(NamedAPIResourceSchema),
    half_damage_to: z.array(NamedAPIResourceSchema),
    double_damage_to: z.array(NamedAPIResourceSchema),
    no_damage_from: z.array(NamedAPIResourceSchema),
    half_damage_from: z.array(NamedAPIResourceSchema),
    double_damage_from: z.array(NamedAPIResourceSchema),
});

const TypePokemonSchema = z.object({
    slot: z.number(),
    pokemon: NamedAPIResourceSchema,
});

export const PokemonTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    damage_relations: TypeRelationsSchema,
    past_damage_relations: z.array(z.object({
        generation: NamedAPIResourceSchema,
        damage_relations: TypeRelationsSchema,
    })),
    game_indices: z.array(GenerationGameIndexSchema),
    generation: NamedAPIResourceSchema,
    move_damage_class: NamedAPIResourceSchema.nullable(),
    names: z.array(z.object({
        name: z.string(),
        language: NamedAPIResourceSchema,
    })),
    pokemon: z.array(TypePokemonSchema),
    moves: z.array(NamedAPIResourceSchema),
});

export const TypesResponseSchema = z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(NamedAPIResourceSchema),
});