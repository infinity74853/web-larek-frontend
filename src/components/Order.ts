import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";

export class Order extends Component<HTMLFormElement> {
    private _title: HTMLElement;
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _paymentError: HTMLElement;
    protected _addressError: HTMLElement;
    protected _submitError: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);
        
        // Инициализация элементов
        this._title = ensureElement<HTMLElement>('.modal__title', container);
        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._paymentError = ensureElement<HTMLElement>('.payment-error', container);
        this._addressError = ensureElement<HTMLElement>('.address-error', container);
        this._submitError = ensureElement<HTMLElement>('.submit-error', container);

        this._title.textContent = 'Способ оплаты';

        // Обработчики событий
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handlePaymentChange(e);
                this.clearPaymentError();
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.validateAddress();
            this.updateForm();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    private handlePaymentChange(e: Event) {
        const button = e.target as HTMLButtonElement;
        this._paymentButtons.forEach(b => 
            b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');
    }

    private validateAddress() {
        const isValid = this._addressInput.value.trim().length >= 6;
        this.toggleError(
            this._addressError, 
            !isValid, 
            'Адрес должен содержать не менее 6 символов'
        );
    }

    private clearPaymentError() {
        this.toggleError(this._paymentError, false);
    }

    private toggleError(element: HTMLElement, show: boolean, message?: string) {
        element.textContent = message || '';
        element.style.display = show ? 'block' : 'none';
        if (element === this._addressError) {
            this._addressInput.classList.toggle('form__input_invalid', show);
        }
    }

    private updateForm() {
        const isValid = this.isValid;
        this._submitButton.disabled = !isValid;
        this._submitError.textContent = isValid ? '' : 'Заполните все обязательные поля';
        this._submitError.style.display = isValid ? 'none' : 'block';
    }

    private get isValid(): boolean {
        return !!this.selectedPayment && this._addressInput.value.trim().length >= 6;
    }

    private get selectedPayment(): string | null {
        const activeButton = this._paymentButtons.find(b => 
            b.classList.contains('button_alt-active')
        );
        return activeButton?.name || null;
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.validateAddress();
    }

    resetPayment() {
        this._paymentButtons.forEach(b => 
            b.classList.remove('button_alt-active')
        );
        this.toggleError(this._paymentError, false);
    }

    private handleSubmit() {
        if (this.isValid) {
            this.events.emit('order:submit', {
                payment: this.selectedPayment,
                address: this._addressInput.value.trim()
            } as IOrderForm);
        }
    }
}