import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { settings } from "../utils/constants";
import { AppData } from "./AppData";

export class Order extends Component<HTMLFormElement> {
    private _title: HTMLElement;
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents,
        protected appData: AppData
    ) {
        super(container);
        
        // Инициализация элементов
        this._title = ensureElement<HTMLElement>('.order__title', container);
        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorContainer = ensureElement<HTMLElement>('.order-errors', container);

        this.events.on('order:change', () => {
            this.updateForm();
        });
        

        this._title.textContent = 'Способ оплаты';

        // Обработчики событий
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handlePaymentChange(e);
                this.updateErrors();
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.updateErrors();
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
            b.classList.remove(settings.classes.button.active)
        );
        button.classList.add(settings.classes.button.active);
        this.updateErrors();
    }

    private updateErrors() {
        const errors: string[] = [];
        
        // Валидация адреса
        if (!this._addressInput.value.trim()) {
            errors.push(settings.errorMessages.order.addressRequired);
        } else if (!this.isAddressValid()) {
            errors.push(settings.errorMessages.order.addressInvalid);
        }
        
        // Валидация способа оплаты
        if (!this.selectedPayment) {
            errors.push(settings.errorMessages.order.payment);
        }

        this._errorContainer.textContent = errors.join('; ');
        this._errorContainer.style.display = errors.length ? 'block' : 'none';
    }

    private isAddressValid(): boolean {
        return this._addressInput.value.trim().length >= 6;
    }

    private updateForm() {
        this.setDisabled(this._submitButton, !this.isValid);
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
    }

    resetPayment() {
        this._paymentButtons.forEach(b => 
            b.classList.remove('button_alt-active')
        );        
    }

    private handleSubmit() {
        // Сохраняем данные в модель перед валидацией
        this.appData.updateOrderField('payment', this.selectedPayment);
        this.appData.updateOrderField('address', this._addressInput.value.trim());

        if (this.appData.validateOrder()) {
            this.events.emit('order:submit', {
                payment: this.selectedPayment,
                address: this._addressInput.value.trim()
            });
        }
    }
}