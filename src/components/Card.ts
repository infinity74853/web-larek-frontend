import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { ICard, Category } from "../types";

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

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');
        this._index = container.querySelector('.basket__item-index');

        if (actions?.onPreview) {
            const previewButton = container.querySelector('.card__image') || 
                                 container.querySelector('.card__title');
            previewButton?.addEventListener('click', (e) => {
                e.preventDefault();
                actions.onPreview!();
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
    }

    set category(value: Category | undefined) {
        if (this._category) {
            this.setText(this._category, value || '');
            if (value) {
                const categoryClass = `card__category_${value.replace(' ', '-')}`;
                this._category.className = `card__category ${categoryClass}`;
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
}