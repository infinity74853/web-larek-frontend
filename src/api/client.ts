import { API_URL } from '../utils/constants';
import { Product } from '../types';

export class ApiClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.baseUrl}/product`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.items || !Array.isArray(data.items)) {
            throw new Error('Invalid products data format');
        }

        return data.items;
    }
}

// Создаем и экспортируем готовый экземпляр
export const api = new ApiClient();