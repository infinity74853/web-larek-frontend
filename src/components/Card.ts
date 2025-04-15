import { Product } from '../types';
import { CDN_URL, settings } from '../utils/constants';

export class Card {
    private readonly product: Product;
    constructor(product: Product) {
        if (!product.id) {
            console.error('Product ID is required');
            throw new Error('Invalid product data: ID is required');
        }
        this.product = product;
    }
    
    render(): HTMLElement {
        try {
            const card = document.createElement('div');
            card.className = 'card';

            const content = document.createElement('div');
            content.className = 'card__content';

            //заголовок
            const title = document.createElement('h3');
            title.className = 'card__title';
            title.textContent = this.product.title || 'Без названия';
            content.appendChild(title);

            //цена
            content.appendChild(this.createPriceElement());

            //картинка
            if (this.product.image) {
                content.appendChild(this.createImageElement());
            } else {
                content.appendChild(this.createPlaceholderElement());
            }

            //кнопка
            const button = document.createElement('button');
            button.className = 'card_button';
            button.textContent = 'В корзину';
            content.appendChild(button);

            card.appendChild(content);
            return card;
        } catch (error) {
            console.error('Error rendering card:', error);
            return this.createErrorCard();
        }
    }        
        
    private createPriceElement(): HTMLElement {
        const priceElement = document.createElement('p');
        priceElement.className = 'card__price';

        if (this.product.price === null || this.product.price === undefined) {
            priceElement.textContent = 'Нет в наличии';
            priceElement.classList.add('card__price-missing');
        } else {
            priceElement.textContent = `${this.product.price.toLocaleString('ru-RU')} ₽`;
        }
        return priceElement;
    }

    private createImageElement(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'card__image-container';

        const img = document.createElement('img');
        img.className = 'card__image';
        img.src = this.product.image;
        img.alt = this.product.title || 'Изображение товара';
        img.loading = 'lazy';
        img.onerror = () => {
            img.src = `${CDN_URL}${settings.defaultImage}`;
            img.alt = 'Изображение недоступно';
            img.classList.add('card__image-error');
        };

        container.appendChild(img);
        return container;
    }

    private createPlaceholderElement(): HTMLElement {
        const placeholder = document.createElement('div');
        placeholder.className = 'card__image-placeholder';
        placeholder.textContent = 'Изображение отсутствует';
        return placeholder;
    }

    private createErrorCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card card_error';

        const errorContent = document.createElement('div');
        errorContent.className = 'card__error-content';

        const errorText = document.createElement('p');
        errorText.textContent = 'Ошибка загрузки товара';

        const errorId = document.createElement('small');
        errorId.textContent = `ID: ${this.product.id || 'неизвестен'}`;

        errorContent.appendChild(errorText);
        errorContent.appendChild(errorId);
        card.appendChild(errorContent);
        return card;
    }
}