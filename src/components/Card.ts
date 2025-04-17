import { Product } from "../types";
import { CDN_URL } from "../utils/constants";

interface CardOptions {
    onClick?: (product: Product) => void;
}
export class Card {
    private product: Product;
    private options: CardOptions;

    constructor(product: Product, options: CardOptions = {}) {
        if (!product.id) throw new Error("Product ID is required");
        this.product = product;
        this.options = options;
    }

    render(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card__content">
                <h3 class="card__title">${this.escapeHtml(this.product.title) || 'Без названия'}</h3>
                <p class="card__price">${this.formatPrice()}</p>
                <div class="card__image-container"></div>
                <button class="card__button">В корзину</button>
            </div>
        `;

        this.setupImage(card);
        
        //обработчики событий
        this.setupEventListeners(card);

        return card;
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
            img.alt = 'Изображение недоступно';
        };

        imgContainer.appendChild(img);
    }

    private setupEventListeners(card: HTMLElement) {
        const button = card.querySelector('.card__button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.options.onClick?.(this.product);
            });
        }

        card.addEventListener('click', () => {
            //логика при клике на карточку
        });
    }

    private getImageUrl(): string {
        if (!this.product.image) {
            return `${CDN_URL}/images/placeholder.svg`;
        }

        if (this.product.image.startsWith('http')) {
            return this.product.image;
        }

        return `${CDN_URL}/${this.product.image.replace(/^\*\//, '')}`;
    }

    private formatPrice(): string {
        if (this.product.price === null || this.product.price === undefined) {
            return 'Нет в наличии';
        }
        return `${this.product.price.toLocaleString('ru-RU')} синапсов`;
    }

    private escapeHtml(unsafe: string): string {
        return unsafe.replace(/[&<"'>]/g, (match) => {
            switch (match) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#039;';
                default: return match;
            }
        });
    }
}