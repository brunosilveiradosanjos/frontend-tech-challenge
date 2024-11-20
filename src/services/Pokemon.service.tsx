// Pokemon.service.tsx
import axios from 'axios';
import { z } from 'zod';
import { PokemonSchema } from '../assets/schemas/pokemon.schema';

export type Pokemon = z.infer<typeof PokemonSchema>;

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonService = {
    async getPokemonById(id: number): Promise<Pokemon> {
        try {
            const response = await axios.get(`${API_BASE_URL}/pokemon/${id}/`);
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
    }
};