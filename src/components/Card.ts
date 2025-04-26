import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { ICard, Category, categoryClasses } from "../types";

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
    protected _index?: HTMLElement;
    protected _description?: HTMLElement;
    protected _deleteButton?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        this._index = container.querySelector('.basket__item-index');
        this._description = container.querySelector('.card__description');
        this._deleteButton = container.querySelector('.basket__item-delete');
        
        if (actions?.onClick && this._button) {
            this._button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Предотвращаем всплытие
                actions.onClick!(e);
            });
        }

        if (actions?.onPreview) {
            container.addEventListener('click', (e) => {
                if (!(e.target as Element).closest('.card__button') && 
                    !(e.target as Element).closest('.basket__item-delete')) {
                    e.preventDefault();
                    actions.onPreview!();
                }
            });
        }

        if (this._button && this._price.textContent === 'Бесценно' 
            && !this._button.classList.contains('basket__item-delete')) {
            this._button.disabled = true;
            this._button.textContent = 'Не продается';
            this._button.classList.add('disabled');
        }

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();  // Важно: останавливаем всплытие
                actions?.onClick?.(e);  // Вызываем обработчик
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        
        if (this._button && !this._button.classList.contains('basket__item-delete')) {
            const isDisabled = value === null;
            this._button.disabled = isDisabled;
            this._button.textContent = isDisabled ? 'Не продается' : 'В корзину'; // Изменено здесь
            this._button.classList.toggle('disabled', isDisabled);
        }
    }

    set category(value: Category | undefined) {
        if (this._category) {
            this.setText(this._category, value || '');
            if (value) {
                this._category.className = 'card__category';
                this._category.classList.add(`card__category_${categoryClasses[value]}`);
            }
        }
    }

    set image(value: string | undefined) {
        if (this._image) {
            this._image.src = value || '';
            this._image.alt = this._title.textContent || '';
        }
    }

    set index(value: number | undefined) {
        if (this._index) {
            this.setText(this._index, value?.toString() || '');
        }
    }

    // Добавляем публичный геттер для container
    get containerElement(): HTMLElement {
        return this.container;
    }

    set description(value: string | undefined) {
        if (this._description) {
            this.setText(this._description, value || '');
        }
    }
}