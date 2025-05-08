import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccessActions {
	onClick: () => void;
}
export class Success extends Component<{ total: number }> {
	protected _close: HTMLElement;
	private _descriptionElement: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._descriptionElement, `Списано ${value} синапсов`);
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}
