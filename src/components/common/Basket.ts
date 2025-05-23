import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';

export class Basket extends Component<HTMLElement> {
	protected _title: HTMLElement;
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._title = ensureElement<HTMLElement>('.basket__title', this.container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this.initialize();
	}

	private initialize() {
		this._button.addEventListener('click', () => {
			this.events.emit('order:start');
		});
	}

	public updateBasket(items: HTMLElement[], total: number) {
		this._list.innerHTML = '';
		items.forEach((item) => this._list.appendChild(item));
		this.setTotal(total);
		this.toggleButton(items.length === 0);
	}

	private setTotal(value: number) {
		this.setText(this._total, `${value} ${settings.labels.currency}`);
	}

	private toggleButton(disabled: boolean) {
		this.setDisabled(this._button, disabled);
	}
}
