import { Product, Category } from "../types";
import { CDN_URL } from "../utils/constants";

interface CardOptions {
    onClick: (product: Product) => void;
}

export class Card {
    private static categoryStyles: Record<Category, { class: string }> = {
        'софт-скил': { class: 'card__category_soft' },
        'хард-скил': { class: 'card__category_hard' },
        'другое': { class: 'card__category_other' },
        'дополнительное': { class: 'card__category_additional' },
        'кнопка': { class: 'card__category_button' }
    };

    constructor(
        private product: Product,
        private options: CardOptions
    ) {}

    render(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card__content">
                ${this.renderCategory()}
                <h3 class="card__title">${this.product.title}</h3>
                <div class="card__image-container"></div>
                <p class="card__price">${this.formatPrice()}</p>
            </div>
        `;

        this.setupImage(card);
        this.setupClickHandler(card);
        
        return card;
    }

    private renderCategory(): string {
        const style = this.product.category in Card.categoryStyles 
            ? Card.categoryStyles[this.product.category as Category] 
            : { class: '' };
            
        return `
            <span class="card__category ${style.class}">
                ${this.product.category}
            </span>
        `;
    }

    private setupImage(container: HTMLElement) {
        const imgContainer = container.querySelector('.card__image-container');
        if (!imgContainer) return;

        const img = document.createElement('img');
        img.className = 'card__image';
        img.loading = 'lazy';
        img.alt = this.product.title || 'Изображение товара';
        img.src = this.getImageUrl();

        img.onerror = () => {
            img.src = `${CDN_URL}/images/placeholder.svg`;
            img.classList.add('card__image-error');
        };

        imgContainer.appendChild(img);
    }

    private setupClickHandler(card: HTMLElement) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            this.options.onClick(this.product);
        });
    }

    private getImageUrl(): string {
        if (!this.product.image) {
            return `${CDN_URL}/images/placeholder.svg`;
        }
        return this.product.image.startsWith('http')
            ? this.product.image
            : `${CDN_URL}/${this.product.image.replace(/^\*\//, '')}`;
    }

    private formatPrice(): string {
        return this.product.price !== null
            ? `${this.product.price.toLocaleString('ru-RU')} синапсов`
            : 'Бесценно';
    }
}