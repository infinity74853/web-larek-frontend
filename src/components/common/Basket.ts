import { Component } from '../base/Component';
import { AppData } from '../AppData';
import { Card } from '../Card';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';

export class Basket extends Component<HTMLElement> {
	protected _title: HTMLElement;
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		private appData: AppData,
		private cardBasketTemplate: HTMLTemplateElement
	) {
		super(container);
		this._title = ensureElement<HTMLElement>('.basket__title', this.container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this.initialize();
		this.updateBasket();
	}

	private initialize() {
		this.events.on('cart:changed', () => this.updateBasket());
		this._button.addEventListener('click', () => {
			this.events.emit('order:start');
		});
	}

	private updateBasket() {
		this._title.textContent = settings.labels.cartList;
		this._list.innerHTML = '';
		this.appData.cart.forEach((item, index) => {
			const card = new Card(cloneTemplate(this.cardBasketTemplate), {
				onClick: () => this.appData.removeFromCart(item.id),
			});

			card.render({
				id: item.id,
				title: item.title,
				price: item.price,
				index: index + 1,
			});

			this._list.appendChild(card.getContainer());
		});

		this._total.textContent = `${this.appData.getCartTotal()} синапсов`;
		this.setDisabled(this._button, this.appData.cart.length === 0);
	}
}
