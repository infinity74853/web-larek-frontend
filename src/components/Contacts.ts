import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IContactsForm } from "../types";

export class Contacts extends Component<HTMLFormElement> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);
        
        this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
        this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
        this._submitButton = container.querySelector('button[type="submit"]');

        this.container.addEventListener('input', () => this.updateForm());
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.events.on('contacts:open', () => this.updateForm());
    }

    private updateForm() {
        this._submitButton.disabled = !this.isValid;
    }

    private get isValid(): boolean {
        return this.isEmailValid && this.isPhoneValid;
    }

    private get isEmailValid(): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._emailInput.value);
    }

    private get isPhoneValid(): boolean {
        return this._phoneInput.value.length >= 10;
    }

    private handleSubmit() {
        console.log('[Contacts] Submit attempt', this.isValid);
        if (this.isValid) {
            this.events.emit('contacts:submit', {
                email: this._emailInput.value,
                phone: this._phoneInput.value
            });
            // Добавим переход к подтверждению
            this.events.emit('order:complete'); // <-- Добавить эту строку
        }
    }
}