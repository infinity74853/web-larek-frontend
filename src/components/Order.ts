import { FormComponent } from './common/Form';
import { IEvents } from './base/Events';
import { AppData } from './AppData';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';

export class Order extends FormComponent<HTMLFormElement> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(
		container: HTMLFormElement,
		protected events: IEvents,
		protected appData: AppData
	) {
		super(container, events, 'order');
		this._paymentButtons = Array.from(
			container.querySelectorAll('button[name]')
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			container
		);
		this.initEventListeners();
	}

	resetPayment() {
		this._paymentButtons.forEach((b) =>
			b.classList.remove(settings.classes.button.active)
		);
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	private initEventListeners(): void {
		this._paymentButtons.forEach((button) =>
			button.addEventListener('click', (e) => this.handlePaymentChange(e))
		);
		this._addressInput.addEventListener('input', () => this.updateForm());
		this.container.addEventListener('submit', (e) => this.handleSubmit(e));
	}

	private handlePaymentChange(e: Event): void {
		const button = e.target as HTMLButtonElement;
		this._paymentButtons.forEach((b) =>
			b.classList.remove(settings.classes.button.active)
		);
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
		return (
			this._paymentButtons.find((b) =>
				b.classList.contains(settings.classes.button.active)
			)?.name || null
		);
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		this.appData.updateOrderField('payment', this.selectedPayment);
		this.appData.updateOrderField('address', this._addressInput.value.trim());
		this.events.emit('order:submit', {
			payment: this.selectedPayment,
			address: this._addressInput.value.trim(),
		});
	}
}
