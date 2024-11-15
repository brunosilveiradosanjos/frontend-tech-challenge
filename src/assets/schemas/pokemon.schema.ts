import { z } from 'zod';

const StatSchema = z.object({
    base_stat: z.number(),
    effort: z.number(),
    stat: z.object({
        name: z.string(),
        url: z.string().url(),
    }),
});

const TypeSchema = z.object({
    slot: z.number(),
    type: z.object({
        name: z.string(),
        url: z.string().url(),
    }),
});

const AbilitySchema = z.object({
    ability: z.object({
        name: z.string(),
        url: z.string().url(),
    }),
    is_hidden: z.boolean(),
    slot: z.number(),
});

const MoveSchema = z.object({
    move: z.object({
        name: z.string(),
        url: z.string().url(),
    }),
    version_group_details: z.array(
        z.object({
            level_learned_at: z.number(),
            move_learn_method: z.object({
                name: z.string(),
                url: z.string().url(),
            }),
            version_group: z.object({
                name: z.string(),
                url: z.string().url(),
            }),
        })
    ),
});

export const PokemonSchema = z.object({
    id: z.number(),
    name: z.string(),
    base_experience: z.number(),
    height: z.number(),
    is_default: z.boolean(),
    order: z.number(),
    weight: z.number(),
    abilities: z.array(AbilitySchema),
    forms: z.array(z.object({ name: z.string(), url: z.string().url() })),
    game_indices: z.array(
        z.object({
            game_index: z.number(),
            version: z.object({
                name: z.string(),
                url: z.string().url(),
            }),
        })
    ),
    held_items: z.array(z.unknown()), // You can expand this if needed
    location_area_encounters: z.string().url(),
    moves: z.array(MoveSchema),
    species: z.object({
        name: z.string(),
        url: z.string().url(),
    }),
    sprites: z.object({
        back_default: z.string().url().nullable(),
        back_female: z.string().url().nullable(),
        back_shiny: z.string().url().nullable(),
        back_shiny_female: z.string().url().nullable(),
        front_default: z.string().url().nullable(),
        front_female: z.string().url().nullable(),
        front_shiny: z.string().url().nullable(),
        front_shiny_female: z.string().url().nullable(),
        other: z.record(z.unknown()), // You can expand this if needed
        versions: z.record(z.unknown()), // You can expand this if needed
    }),
    stats: z.array(StatSchema),
    types: z.array(TypeSchema),
});