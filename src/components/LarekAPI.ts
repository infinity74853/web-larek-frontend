import { Api, ApiListResponse } from './base/Api';
import { Product, IOrderData, IOrderResult } from '../types';

export class LarekAPI extends Api {
	constructor(baseUrl: string, protected cdnUrl: string) {
		super(baseUrl);
	}

	async getProducts(): Promise<Product[]> {
		const response = (await this.get('/product')) as ApiListResponse<Product>;
		return response.items.map((item) => ({
			...item,
			image: item.image
				? this.cdnUrl + item.image.replace('.svg', '.png')
				: undefined,
		}));
	}

	async createOrder(order: IOrderData): Promise<IOrderResult> {
		const response = await fetch(`${this.baseUrl}/order`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(order),
		});

		// Проверка HTTP статуса
		if (!response.ok) {
			throw new Error(`Ошибка сервера: ${response.status}`);
		}

		const data = await response.json();

		// Строгая проверка структуры ответа
		if (!data?.id || typeof data.total !== 'number') {
			throw new Error('Некорректные данные заказа');
		}

		return data;
	}
}
