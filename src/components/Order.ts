import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IOrderForm } from "../types";

export class Order extends Component<IOrderForm> {
    protected _button: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._button = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this._button.addEventListener('click', () => {
            events.emit('order:submit', this.getValues());
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this._button, !value);
    }
    
    set address(value: string) {
        (this.container.querySelector('[name="address"]') as HTMLInputElement).value = value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    private getValues(): IOrderForm {
        const form = this.container.querySelector('form');
        return Object.fromEntries(new FormData(form!)) as unknown as IOrderForm;
    }

    // Добавляем публичный геттер для container
    get containerElement(): HTMLElement {
        return this.container;
    }
}