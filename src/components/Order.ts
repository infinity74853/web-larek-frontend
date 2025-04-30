import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/Events";
import { IOrderForm } from "../types";

export class Order extends Component<IOrderForm> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
        this._paymentButtons = container.querySelectorAll('.button_alt');
        this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('name');
                this.togglePayment(payment);
                events.emit('order:payment', { payment });
            });
        });

        this._addressInput.addEventListener('input', () => {
            events.emit('order:address', { 
                address: this._addressInput.value 
            });
        });

        this._submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('order:submit');
        });
    }

    private togglePayment(payment: string | null) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle(
                'button_alt-active', 
                button.getAttribute('name') === payment
            );
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: string) {
        this.togglePayment(value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set valid(value: boolean) {
        this.setDisabled(this._submitButton, !value);
    }

    // Добавляем публичный метод для доступа к container
    get containerElement(): HTMLElement {
        return this.container;
    }
}