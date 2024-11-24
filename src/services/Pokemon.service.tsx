// Pokemon.service.tsx
import axios from 'axios';
import { z } from 'zod';
import { PokemonSchema } from '../assets/schemas/pokemon.schema';
import { PokemonTypeSchema } from '../assets/schemas/pokemonType.schema';

export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonType = z.infer<typeof PokemonTypeSchema>;

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonService = {

    async getPokemonById(id: number): Promise<Pokemon> {
        try {
            const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);
            const validatedData = PokemonSchema.parse(response.data);
            return validatedData;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Data validation failed:", error.errors);
                throw new Error("Data validation failed");
            }
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch Pokemon: ${error.message}`);
            }
            throw new Error("An unknown error occurred");
        }
    },
    async getPokemonTypeById(id: number): Promise<PokemonType> {
        try {
            const response = await axios.get(`${API_BASE_URL}/type/${id}`);
            const validatedData = PokemonTypeSchema.parse(response.data);
            return validatedData;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Data validation failed:", error.errors);
                throw new Error("Data validation failed");
            }
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch Pokemon: ${error.message}`);
            }
            throw new Error("An unknown error occurred");
        }
    }
};