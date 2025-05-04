import { FormComponent } from "./common/Form";
import { IEvents } from "./base/Events";
import { settings } from "../utils/constants";
import { ensureElement } from "../utils/utils";

export class Contacts extends FormComponent<HTMLFormElement> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    
    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container, events, 'contacts');

        this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);        
        this.initEventListeners();        
    }

    private initEventListeners(): void {
        this._emailInput.addEventListener('input', () => this.updateForm());
        this._phoneInput.addEventListener('input', () => this.updateForm());
        this.container.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Метод валидации
    private updateForm(): void {
        const errors: string[] = [];        
        
        if (!this.validateEmail(this._emailInput.value)) {
            errors.push(settings.errorMessages.contacts.emailInvalid);
        }
        
        if (!this.validatePhone(this._phoneInput.value)) {
            errors.push(settings.errorMessages.contacts.phoneInvalid);
        }
        
        this.showErrors(errors);
        this.setDisabled(this._submitButton, errors.length > 0);
    }

    private handleSubmit(e: Event) {
        e.preventDefault();
        if (this.isValid) {
            this.events.emit('contacts:submit', {
                email: this._emailInput.value.trim(),
                phone: this._phoneInput.value.trim()
            });
            this.events.emit('order:complete');
        }
    }

    private get isValid(): boolean {
        return this.validateEmail(this._emailInput.value) && 
               this.validatePhone(this._phoneInput.value);
    }    
}