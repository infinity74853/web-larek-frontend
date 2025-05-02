import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IOrderForm } from "../types";
export class Order extends Component<HTMLFormElement> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);

        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = container.querySelector('[name="address"]') as HTMLInputElement;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

        // Добавляем обработчики
        this._paymentButtons.forEach(button => 
            button.addEventListener('click', (e) => this.handlePaymentChange(e))
        );
        
        // Важно: обработчик должен быть на форме, а не на кнопке
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this._addressInput.addEventListener('input', () => this.updateForm());
    }

    private handlePaymentChange(e: Event) {
        const button = e.target as HTMLButtonElement;
        this._paymentButtons.forEach(b =>b.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.updateForm();
    }

    private updateForm() {
        this._submitButton.disabled = !this.isValid;
    }

    private get isValid(): boolean {
        const isPaymentSelected = !!this.selectedPayment;
        const isAddressValid = this._addressInput.value.trim().length >= 6;
        console.log(`Validation: payment=${isPaymentSelected}, address=${isAddressValid}`);
        return isPaymentSelected && isAddressValid;
    }

    private get selectedPayment(): string | null {
        const activeButton = this._paymentButtons.find(b => 
            b.classList.contains('button_alt-active')
        );
        return activeButton?.name || null;
    }

    // Добавим метод для установки адреса
    set address(value: string) {
        this._addressInput.value = value;
    }

    // Добавим метод для сброса состояния платежных кнопок
    resetPayment() {
        this._paymentButtons.forEach(b => 
            b.classList.remove('button_alt-active')
        );
    }

    private handleSubmit() {
        console.log('Submit handled', this.isValid, this.selectedPayment, this._addressInput.value);
        if (this.isValid) {
            this.events.emit('order:submit', {
                payment: this.selectedPayment,
                address: this._addressInput.value
            } as IOrderForm);
        }
    }
}