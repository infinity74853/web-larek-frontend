import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { settings } from "../utils/constants";
import { ensureElement } from "../utils/utils";

export class Contacts extends Component<HTMLFormElement> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;
    private _initialState = true;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);

        this._errorContainer = ensureElement<HTMLElement>('.contacts-errors', container);
        this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);

        // Обработчики событий
        this._emailInput.addEventListener('input', () => {
            this._initialState = false;
            this.updateErrors();
            this.updateForm();
        });

        this._phoneInput.addEventListener('input', () => {
            this._initialState = false;
            this.updateErrors();
            this.updateForm();
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });

        this.events.on('contacts:open', () => {
            this._initialState = true;
            this.updateErrors();
        });
    }

    private updateErrors() {
        const errors: string[] = [];
        
        // Валидация email
        if (this._initialState && !this._emailInput.value) {
            errors.push(settings.errorMessages.contacts.emailRequired);
        } else if (!this.isEmailValid) {
            errors.push(this._emailInput.value 
                ? settings.errorMessages.contacts.emailInvalid
                : settings.errorMessages.contacts.emailRequired);
        }
        
        // Валидация телефона
        if (this._initialState && !this._phoneInput.value) {
            errors.push(settings.errorMessages.contacts.phoneRequired);
        } else if (!this.isPhoneValid) {
            errors.push(this._phoneInput.value 
                ? settings.errorMessages.contacts.phoneInvalid
                : settings.errorMessages.contacts.phoneRequired);
        }

        this._errorContainer.textContent = errors.join('; ');
        this._errorContainer.style.display = errors.length ? 'block' : 'none';
    }

    private updateForm() {
        this.setDisabled(this._submitButton, !this.isValid);
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