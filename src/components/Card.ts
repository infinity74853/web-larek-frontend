import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICard, Category } from '../types';
import { settings, categoryClasses } from '../utils/constants';

interface ICardActions {
	onClick?: (event: MouseEvent) => void;
	onPreview?: () => void;
}
export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement; 
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index: HTMLElement;
		
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		
		this._category = container.querySelector<HTMLElement>('.card__category');
		this._button = container.querySelector<HTMLButtonElement>('.card__button, .basket__item-delete');
		this._image = container.querySelector<HTMLImageElement>('.card__image');
		this._description = container.querySelector<HTMLElement>('.card__description');
		this._index = container.querySelector<HTMLElement>('.basket__item-index');

		if (actions?.onClick) {
			this._button?.addEventListener('click', (e) => {
				e.preventDefault();
				if (!this._button?.disabled) {
					actions.onClick(e);
				}
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

	private updateButtonState(inCart: boolean, price: number | null) {
        if (!this._button) return;
    
        const isBasketButton = this._button.classList.contains('basket__item-delete');
        
        if (isBasketButton) {
            this.setText(this._button, settings.labels.deleteFromCart);
            this.setDisabled(this._button, false);
        } else {
            const disabled = inCart || price === null;
            this.setDisabled(this._button, disabled);
            this.setText(this._button, 
                inCart ? settings.labels.inCart :
                price === null ? settings.labels.notForSale :
                settings.labels.addToCart
            );
        }
    }

	render(data: ICard & { inCart?: boolean; price?: number | null }) {
        super.render(data);
        
        // Обновление кнопки
        this.updateButtonState(
            data.inCart || false,
            data.price ?? null
        );

        return this.container;
    }

	set id(value: string) {
		this.container.dataset.id = value;
	}
	
	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number | null) {
        this.setText(
            this._price,
            value ? `${value} ${settings.labels.currency}` : settings.labels.priceless
        );
    }

	set category(value: Category | undefined) {
		if (this._category && value) {
			this.setText(this._category, value);
			const classKey = categoryClasses[value];
			if (classKey) {
				this._category.className = `${settings.classes.card.category} ${settings.classes.card.categoryPrefix}${classKey}`;
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}

	set image(value: string | undefined) {
		this.setImage(this._image, value || '', this._title.textContent || '');
	}
}
