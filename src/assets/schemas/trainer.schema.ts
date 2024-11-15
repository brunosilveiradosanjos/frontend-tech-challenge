import { z } from 'zod';

const CharacterLocationSchema = z.object({
    name: z.string(),
    url: z.union([z.string().url(), z.literal("")]),
});

const CharacterSchema = z.object({
    id: z.number(),
    name: z.string(),
    status: z.enum(['Alive', 'Dead', 'unknown']),
    species: z.string(),
    type: z.string(),
    gender: z.enum(['Female', 'Male', 'Genderless', 'unknown']),
    origin: CharacterLocationSchema,
    location: CharacterLocationSchema,
    image: z.string().url().nullable(),
    episode: z.array(z.string().url().nullable(),),
    url: z.string().url().nullable(),
    created: z.string().datetime(),
});

const InfoSchema = z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().url().nullable(),
    prev: z.string().url().nullable(),
});

export const TrainerResponseSchema = z.object({
    info: InfoSchema,
    results: z.array(CharacterSchema),
});