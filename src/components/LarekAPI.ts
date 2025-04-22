import { Api, ApiListResponse } from './base/api';
import { Product } from '../types';

export class LarekAPI extends Api {
    private readonly cdnUrl: string;

    constructor(baseUrl: string, cdnUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }

    async getProducts(): Promise<Product[]> {
        const data = await this.get('/product') as ApiListResponse<any>;
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
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('*/')) return `${this.cdnUrl}/${imageUrl.substring(1)}`;
        return `${this.cdnUrl}/${imageUrl}`;
    }
}
