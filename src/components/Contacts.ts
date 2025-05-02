import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IContactsForm } from "../types";
import { ensureElement } from "../utils/utils";

export class Contacts extends Component<HTMLFormElement> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _emailError: HTMLElement;
    protected _phoneError: HTMLElement;
    protected _submitError: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);

        this._submitError = ensureElement<HTMLElement>('.submit-error', container);
        this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._emailError = ensureElement<HTMLElement>('.email-error', container);
        this._phoneError = ensureElement<HTMLElement>('.phone-error', container);

        // Обработчики событий
        this._emailInput.addEventListener('input', () => {
            this.validateEmail();
            this.updateForm();
        });

        this._phoneInput.addEventListener('input', () => {
            this.validatePhone();
            this.updateForm();
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.events.on('contacts:open', () => this.updateForm());
    }

    private validateEmail() {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._emailInput.value);
        this.toggleError(
            this._emailError, 
            !isValid, 
            'Введите корректный email (например: user@domain.com)'
        );
    }

    private validatePhone() {
        const isValid = /^(\+7|8)\d{10}$/.test(this._phoneInput.value);
        this.toggleError(
            this._phoneError, 
            !isValid, 
            'Введите телефон в формате +7XXXXXXXXXX'
        );
    }

    private toggleError(element: HTMLElement, show: boolean, message?: string) {
        element.textContent = message || '';
        element.style.display = show ? 'block' : 'none';
        const input = element.previousElementSibling as HTMLInputElement;
        input?.classList.toggle('form__input_invalid', show);
    }

    private updateForm() {
        const isValid = this.isValid;
        this._submitButton.disabled = !isValid;
        this._submitError.textContent = isValid ? '' : 'Проверьте правильность ввода данных';
        this._submitError.style.display = isValid ? 'none' : 'block';
    }

    private get isValid(): boolean {
        return this.isEmailValid && this.isPhoneValid;
    }

    private get isEmailValid(): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._emailInput.value);
    }

    private get isPhoneValid(): boolean {
        return /^(\+7|8)\d{10}$/.test(this._phoneInput.value);
    }

    private handleSubmit() {
        if (this.isValid) {
            this.events.emit('contacts:submit', {
                email: this._emailInput.value.trim(),
                phone: this._phoneInput.value.trim()
            });
            this.events.emit('order:complete');
        }
    }
}