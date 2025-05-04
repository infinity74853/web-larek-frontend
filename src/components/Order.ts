import { ensureElement } from '../utils/utils';
import { FormComponent } from './common/Form';
import { IEvents } from './base/Events';
import { AppData } from './AppData';
import { settings } from '../utils/constants';

export class Order extends FormComponent<HTMLFormElement> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(
		container: HTMLFormElement,
		protected events: IEvents,
		protected appData: AppData
	) {
		super(container, events, 'order');

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name="card"]',
			container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name="cash"]',
			container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			container
		);

		this.initEventListeners();
	}

	resetPayment() {
		this._paymentCard.classList.remove(settings.classes.button.active);
		this._paymentCash.classList.remove(settings.classes.button.active);
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	private initEventListeners(): void {
		this._paymentCard.addEventListener('click', () =>
			this.handlePaymentChange('card')
		);
		this._paymentCash.addEventListener('click', () =>
			this.handlePaymentChange('cash')
		);
		this._addressInput.addEventListener('input', () => this.updateForm());
		this.container.addEventListener('submit', (e) => this.handleSubmit(e));
	}

	private handlePaymentChange(method: 'card' | 'cash'): void {
		this.resetPayment();
		const button = method === 'card' ? this._paymentCard : this._paymentCash;
		button.classList.add(settings.classes.button.active);
		this.updateForm();
	}

	private updateForm(): void {
		const errors: string[] = [];
		if (!this.validateAddress(this._addressInput.value.trim())) {
			errors.push(settings.errorMessages.order.addressInvalid);
		}
		if (!this.selectedPayment) {
			errors.push(settings.errorMessages.order.payment);
		}
		this.showErrors(errors);
	}

	private get isValid(): boolean {
		return (
			!!this.selectedPayment &&
			this.validateAddress(this._addressInput.value.trim())
		);
	}

	private get selectedPayment(): string | null {
		return this._paymentCard.classList.contains(settings.classes.button.active)
			? 'card'
			: this._paymentCash.classList.contains(settings.classes.button.active)
			? 'cash'
			: null;
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		if (this.selectedPayment) {
			this.appData.updateOrderField('payment', this.selectedPayment);
			this.appData.updateOrderField('address', this._addressInput.value.trim());
			this.events.emit('order:submit', {
				payment: this.selectedPayment,
				address: this._addressInput.value.trim(),
			});
		}
	}

	// Валидация адреса доставки
	protected validateAddress(value: string): boolean {
		return value.length >= settings.validation.minAddressLength;
	}
}
