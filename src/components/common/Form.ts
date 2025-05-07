import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class FormComponent<T> extends Component<T> {
	protected _submitButton?: HTMLButtonElement;
	protected _errorContainer?: HTMLElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents,
		protected formName: string
	) {
		super(container);

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this._errorContainer = ensureElement<HTMLElement>(
			'.form__errors',
			container
		);
	}

	// Mетод для отображения ошибок
	protected showErrors(errors: string[]): void {
		this._errorContainer.textContent = errors.join('; ');
		this._errorContainer.style.display = errors.length ? 'block' : 'none';
		this.setDisabled(this._submitButton, errors.length > 0);
	}	
}
