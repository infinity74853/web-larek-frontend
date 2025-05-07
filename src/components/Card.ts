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
	protected _priceElement: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._priceElement = ensureElement<HTMLElement>('.card__price', container);

		this._category = container.querySelector('.card__category');
		this._button = container.querySelector<HTMLButtonElement>(
			'.card__button, .basket__item-delete'
		);

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
            this._button.textContent = settings.labels.deleteFromCart;
            this.setDisabled(this._button, false);
        } else {
            const disabled = inCart || price === null;
            this.setDisabled(this._button, disabled);
            this._button.textContent = inCart
                ? settings.labels.inCart
                : price === null
                ? settings.labels.notForSale
                : settings.labels.addToCart;
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
	
	set index(value: number) {
		this.setText('.basket__item-index', String(value));
	}

	set title(value: string) {
		this.setText('.card__title', value);
	}

	set description(value: string) {
		this.setText('.card__description', value);
	}

	set price(value: number | null) {
        this.setText(
            '.card__price',
            value ? `${value} ${settings.labels.currency}` : settings.labels.priceless
        );
    }

	set category(value: Category | undefined) {
		if (this._category && value) {
			this.setText('.card__category', value);
			const classKey = categoryClasses[value];
			if (classKey) {
				this._category.className = `${settings.classes.card.category} ${settings.classes.card.categoryPrefix}${classKey}`;
			}
		}
	}

	set image(value: string | undefined) {
		this.setImage('.card__image', value || '', this._title.textContent || '');
	}
}
