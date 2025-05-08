import { FormComponent } from './common/Form';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { FormErrors } from '../types';

export class Contacts extends FormComponent<HTMLFormElement> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events, 'contacts');

		this._emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			container
		);

		this.events.on('formErrors:change', (errors: FormErrors) => {
			const errorMessages = [];
			if (errors.email) errorMessages.push(errors.email);
			if (errors.phone) errorMessages.push(errors.phone);
			this.showErrors(errorMessages);
		});

		this.initEventListeners();
	}

	private initEventListeners(): void {
		this._emailInput.addEventListener('input', () => {
			this.events.emit('contacts:email:change', {
				value: this._emailInput.value,
			});
		});

		this._phoneInput.addEventListener('input', () => {
			this.events.emit('contacts:phone:change', {
				value: this._phoneInput.value,
			});
		});

		this.container.addEventListener('submit', (e) => this.handleSubmit(e));
	}

	private handleSubmit(e: Event) {
		e.preventDefault();
		if (this.isValid) {
			this.events.emit('contacts:submit', {
				email: this._emailInput.value.trim(),
				phone: this._phoneInput.value.trim(),
			});
			this.events.emit('order:complete');
		}
	}

	private get isValid(): boolean {
		return this._submitButton.disabled === false;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	reset() {
		(this.container as HTMLFormElement).reset();
		this.showErrors([]);
	}
}
