import { API_URL, CDN_URL } from '../utils/constants';
import { Product } from '../types';

export class ApiClient {
    private readonly apiUrl: string;
    private readonly cdnUrl: string;

    constructor(apiUrl: string = API_URL, cdnUrl: string = CDN_URL) {
        this.apiUrl = apiUrl;
        this.cdnUrl = cdnUrl;
    }

    private processImageUrl(imageUrl: string | undefined): string {
        if (!imageUrl) {
            // Возвращаем URL для placeholder изображения из CDN
            return `${this.cdnUrl}/images/placeholder.svg`;
        }

        // Обрабатываем разные варианты некорректных путей
        let processedUrl = imageUrl;
        
        // Удаляем звездочку в начале пути, если есть
        if (processedUrl.startsWith('*/')) {
            processedUrl = processedUrl.substring(1);
        }
        
        // Добавляем слеш в начале, если отсутствует
        if (!processedUrl.startsWith('/')) {
            processedUrl = `/${processedUrl}`;
        }
        
        // Используем CDN URL для изображений
        return `${this.cdnUrl}${processedUrl}`;
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.apiUrl}/products`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.items || !Array.isArray(data.items)) {
            throw new Error('Invalid products data format');
        }

        // Обрабатываем изображения для каждого продукта
        return data.items.map(item => ({
            ...item,
            image: this.processImageUrl(item.image)
        }));
    }
}

// Создаем и экспортируем готовый экземпляр
export const api = new ApiClient();