import { Product } from '../types';

export class Card {
    constructor(private product: Product) {} // Убрали опциональность
    
    render(): HTMLElement {
        // Добавим проверку всех обязательных полей
        if (!this.product || !this.product.title || !this.product.price) {
            console.error('Invalid product data:', this.product);
            return this.createErrorCard();
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${this.product.title}</h3>
            <p>Цена: ${this.product.price} ₽</p>
            ${this.product.image ? `<img src="${this.product.image}" alt="${this.product.title}">` : ''}
        `;
        return card;
    }

    private createErrorCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card card_error';
        card.textContent = 'Ошибка загрузки данных товара';
        return card;
    }
}