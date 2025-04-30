import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { AppData } from "./AppData";
import { LarekAPI } from "./LarekAPI";
import { cloneTemplate } from "../utils/utils";
import { IOrderData } from "../types";

export class Order extends Component<HTMLElement> {
    protected _form: HTMLFormElement;
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        private appData: AppData,
        private api: LarekAPI,
        private contactsTemplate: HTMLTemplateElement,
        private successTemplate: HTMLTemplateElement
    ) {
        super(container);

        this._form = this.container.querySelector('form[name="order"]');
        this._paymentButtons = this.container.querySelectorAll('.button_alt');
        this._addressInput = this.container.querySelector('input[name="address"]');

        if (!this._form) {
            console.error('Form structure:', this.container.innerHTML);
            throw new Error('Форма заказа не найдена. Проверьте структуру шаблона');
        }

        // Инициализация обработчиков событий
        this.initializeHandlers();
    }

    private initializeHandlers() {
        this._paymentButtons.forEach(button => 
            button.addEventListener('click', () => this.selectPayment(button))
        );
        
        this._form.addEventListener('input', () => this.validateForm());
        this._form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.events.on('order:open', () => this.openOrderForm());
        this.events.on('order:submit', () => this.openContactsForm());
        this.events.on('contacts:submit', () => this.submitOrder());
    }

    // Добавляем отсутствующий метод validateForm
    private validateForm() {
        const isValid = this._addressInput.value.trim().length > 0 
            && this.appData.order?.payment !== '';
        this.events.emit('order:valid', { valid: isValid });
    }

    // Остальные методы остаются без изменений
    private selectPayment(button: HTMLButtonElement) {
        this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.appData.updateOrder({ payment: button.name });
    }

    private handleSubmit(e: Event) {
        e.preventDefault();
        this.events.emit('order:submit');
    }

    private openOrderForm() {
        this.appData.initOrder();
        this.events.emit('modal:open', this.container);
        this.validateForm(); // Вызываем валидацию при открытии формы
    }

    private openContactsForm() {
        const contacts = cloneTemplate(this.contactsTemplate);
        const form = contacts.querySelector('form');
        const emailInput = contacts.querySelector('#email') as HTMLInputElement;
        const phoneInput = contacts.querySelector('#phone') as HTMLInputElement;
        const submitButton = contacts.querySelector('button[type="submit"]') as HTMLButtonElement;

        form.addEventListener('input', () => {
            this.appData.updateOrder({
                email: emailInput.value,
                phone: phoneInput.value
            });
            submitButton.disabled = !(emailInput.validity.valid && phoneInput.validity.valid);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });

        this.events.emit('modal:open', contacts);
    }

    private async submitOrder() {
        try {
            const result = await this.api.createOrder(this.appData.order);
            if (result.id) {
                this.showSuccess();
                this.appData.clearCart();
            }
        } catch (error) {
            console.error('Order error:', error);
            this.events.emit('order:error', error);
        }
    }

    private showSuccess() {
        const success = cloneTemplate(this.successTemplate);
        const description = success.querySelector('.order-success__description');
        description.textContent = `Списано ${this.appData.order.total} синапсов`;
        
        success.querySelector('.order-success__close').addEventListener('click', () => {
            this.events.emit('modal:close');
        });
        
        this.events.emit('modal:open', success);
    }
}