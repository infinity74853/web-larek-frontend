import { Api, ApiListResponse } from './base/Api';
import { Product, IOrderData } from '../types';

export class LarekAPI extends Api {
    constructor(baseUrl: string, protected cdnUrl: string) {
        super(baseUrl);
    }

    async getProducts(): Promise<Product[]> {
        const response = await this.get('/product') as ApiListResponse<Product>;
        return response.items.map(item => ({
            ...item,
            image: item.image ? this.cdnUrl + item.image.replace(".svg", ".png") : undefined
        }));
    }

    async createOrder(order: IOrderData): Promise<{ id: string }> {
        return this.post('/order', order) as Promise<{ id: string }>;
    }
}