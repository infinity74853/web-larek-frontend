import { API_URL } from '../utils/constants';
import { Product } from '../types';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/product`);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    return response.json();
  }

  // Добавь другие методы (заказ, корзина и т.д.)
}

// Экспортируем готовый экземпляр
export const api = new ApiClient();