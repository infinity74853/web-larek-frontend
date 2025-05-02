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
        
        // Добавьте проверку на существование элементов
        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = container.querySelector('[name="address"]') as HTMLInputElement;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (!this._addressInput || !this._submitButton) {
            throw new Error('Required form elements not found');
        }
    }

    private handlePaymentChange(e: Event) {
        const button = e.target as HTMLButtonElement;
        this._paymentButtons.forEach(b => 
            b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');
        this.updateForm();
    }

    private updateForm() {
        this._submitButton.disabled = !this.isValid;
    }

    private get isValid(): boolean {
        return !!this.selectedPayment && this._addressInput.value.length > 5;
    }

    private get selectedPayment(): string | null {
        const activeButton = this._paymentButtons.find(b => 
            b.classList.contains('button_alt-active')
        );
        return activeButton?.name || null;
    }

    private handleSubmit() {
        if (this.isValid) {
            this.events.emit('order:submit', {
                payment: this.selectedPayment,
                address: this._addressInput.value
            } as IOrderForm);
        }
    }
}