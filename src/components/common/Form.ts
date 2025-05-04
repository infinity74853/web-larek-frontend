import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { settings } from "../../utils/constants";

export abstract class FormComponent<T> extends Component<T> {
    protected _submitButton?: HTMLButtonElement;
    protected _errorContainer?: HTMLElement;

    constructor(
        protected container: HTMLFormElement,
        protected events: IEvents,
        protected formName: string
    ) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorContainer = ensureElement<HTMLElement>('.form__errors', container);
    }

    // Общий метод для отображения ошибок
    protected showErrors(errors: string[]): void {
        this._errorContainer.textContent = errors.join('; ');
        this._errorContainer.style.display = errors.length ? 'block' : 'none';
        this.setDisabled(this._submitButton, errors.length > 0);
    }

    // Валидация адреса
    protected validateAddress(address: string): boolean {
        return address.length >= settings.validation.minAddressLength;
    }

    // Валидация email
    protected validateEmail(email: string): boolean {
        return settings.validation.emailPattern.test(email);
    }

    // Валидация телефона
    protected validatePhone(phone: string): boolean {
        return settings.validation.phonePattern.test(phone);
    }
}