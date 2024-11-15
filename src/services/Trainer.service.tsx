import axios from 'axios';
import { TrainerResponseSchema } from '../assets/schemas/trainer.schema';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

interface FetchTrainersParams {
    query?: string;
    page?: number;
}

export const fetchTrainers = async (fetchParams: FetchTrainersParams) => {
    try {
        const params = new URLSearchParams({
            status: 'alive',
            page: fetchParams?.page ? fetchParams?.page?.toString() : '1',
        });

        if (fetchParams?.query) {
            params.append('name', fetchParams.query);
        }

        const url = `${BASE_URL}?${params.toString()}`;
        const response = await axios.get(url);

        // Validate the response data using the Zod schema
        const validatedData = TrainerResponseSchema.parse(response.data);

        return validatedData;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios errors
            console.error('Axios error:', error.message);
            throw new Error(`API request failed: ${error.message}`);
        } else if (error instanceof Error) {
            // Handle Zod validation errors
            console.error('Validation error.message:', error.message);
            console.error('Validation error:', error);
            throw new Error(`Data validation failed: ${error.message}`);
        } else {
            // Handle other types of errors
            console.error('Unknown error:', error);
            throw new Error('An unknown error occurred');
        }
    }
};