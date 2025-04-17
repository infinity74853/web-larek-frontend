import { API_URL, CDN_URL } from '../utils/constants';
import { Product } from '../types';
export class ApiClient {
    private readonly baseUrl: string;
    private readonly cdnUrl: string;

    constructor(baseUrl: string = API_URL, cdnUrl: string = CDN_URL) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.cdnUrl = cdnUrl.replace(/\/$/, '');
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.baseUrl}/product`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.items || !Array.isArray(data.items)) {
            throw new Error("Invalid data format");
        }

        return this.processProducts(data.items);
    }

    private processProducts(items: any[]): Product[] {
        return items.map(item => ({
            id: item.id || '',
            title: item.title || 'Без названия',
            price: item.price ?? null,
            description: item.description || '',
            image: this.processImageUrl(item.image),
            category: item.category || ''
        }));
    }

    private processImageUrl(imageUrl?: string): string {
        if (!imageUrl) return `${this.cdnUrl}/images/placeholder.svg`;
        
        // Обработка разных форматов URL
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('*/')) return `${this.cdnUrl}/${imageUrl.substring(1)}`;
        
        return `${this.cdnUrl}/${imageUrl}`;
    }
}

export const api = new ApiClient();