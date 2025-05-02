import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { ICard, Category } from "../types";
import { categoryClasses } from "../utils/constants";

interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onPreview?: () => void;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _inCart = false;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            this._button?.addEventListener('click', (e) => {
                e.preventDefault();
                actions.onClick(e);
            });
        }

        if (actions?.onPreview) {
            container.addEventListener('click', (e) => {
                if (e.target !== this._button) {
                    actions.onPreview();
                }
            });
        }
    }

    set inCart(value: boolean) {
        if (typeof value !== 'boolean') {
            console.error('[Card] Invalid inCart value:', value);
            this._inCart = false;
        } else {
            this._inCart = value;
        }
        this.updateButtonState();
    }

    private updateButtonState() {
        if (!this._button) {
            return;
        }
    
        this._button.disabled = this._inCart;
        this._button.textContent = this._inCart 
            ? 'Уже в корзине' 
            : (this._price === null ? 'Не продаётся' : 'Купить');        
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
    
    set uid(value: string) {
        this.container.dataset.uid = value;
    }

    set index(value: number) {
        this.setText('.basket__item-index', String(value)); // Селектор для номера в корзине
    }

    set title(value: string) {
        this.setText('.card__title', value); // Селектор вместо элемента
    }

    set description(value: string) {
        this.setText('.card__description', value); // Добавьте этот метод
      }

    set price(value: number | null) {
        this.setText('.card__price', value ? `${value} синапсов` : 'Бесценно');
        this.updateButtonState();
    
        if (this._button) {
        // Проверяем, не является ли кнопка элементом корзины
        const isBasketButton = this._button.classList.contains('basket__item-delete');
      
        if (!isBasketButton) {
            this._button.disabled = value === null;
            this._button.textContent = value === null ? 'Не продаётся' : 'Добавить в корзину';
            } else {
            // Для кнопок корзины оставляем иконку вместо текста
            this._button.textContent = '';
            }
        }
    }

    set category(value: Category | undefined) {
        if (this._category && value) {
            this.setText('.card__category', value);
            const classKey = categoryClasses[value];
            if (classKey) {
            this._category.className = `card__category card__category_${classKey}`;
            }
        }
    }

    set image(value: string | undefined) {
        if (this._image && value) {
            this._image.src = value;
            this._image.alt = this._title.textContent || '';
        }
    }

    set quantity(value: number) {
        this.setText('.basket__item-counter', `× ${value}`); // Селектор для количества
    }

    get containerElement(): HTMLElement {
        return this.container;
    }
}