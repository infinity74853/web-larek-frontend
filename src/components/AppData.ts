import { Product, ICartItem, IOrderData, FormErrors } from '../types';
import { IEvents } from './base/Events';
import { settings } from '../utils/constants';

export class AppData {
	private _products: Product[] = [];
	private _cart: ICartItem[] = [];
	private _order: IOrderData | null = null;
	private _formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	// Обновление полей заказа
	updateOrderField<K extends keyof IOrderData>(field: K, value: IOrderData[K]) {
        if (!this._order) this.initOrder();
        this._order[field] = value;
        this.validateForm();
        this.events.emit('order:change', this._order);
    }

	// Инициализация заказа
	initOrder(): void {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: this._cart.map((item) => item.id),
			total: this.getCartTotal(),
		};
		this.events.emit('order:init', this._order);
	}

	// Добавляем/изменяем методы валидации
    private validateForm(): void {
        const errors: FormErrors = {};
        const order = this._order;

        if (!order) return;

        // Валидация адреса
        if (!order.address || order.address.length < settings.validation.minAddressLength) {
			errors.address = settings.errorMessages.order.addressInvalid;
		}

        // Валидация email
        if (!order.email || !settings.validation.emailPattern.test(order.email)) {
			errors.email = settings.errorMessages.contacts.emailInvalid;
		}

        // Валидация телефона
        if (!order.phone || !settings.validation.phonePattern.test(order.phone)) {
			errors.phone = settings.errorMessages.contacts.phoneInvalid;
		}

        // Валидация способа оплаты
        if (!order.payment) {
			errors.payment = settings.errorMessages.order.payment;
		}

        this._formErrors = errors;
        this.events.emit('formErrors:change', this._formErrors);
    }

	get formErrors(): FormErrors {
        return this._formErrors;
    }

	get order(): IOrderData | null {
		return this._order;
	}

	get products(): Product[] {
		return this._products;
	}

	get cart(): ICartItem[] {
		return this._cart;
	}

	setCatalog(products: Product[]): void {
		this._products = products;
		this.events.emit('catalog:changed', this._products);
	}

	// Добавление в корзину
	addToCart(product: Product): void {
		if (!this.isInCart(product.id)) {
			this._cart.push({
				id: this.generateUID(),
				productId: product.id,
				quantity: 1,
				price: product.price || 0,
				title: product.title,
			});
			this.events.emit('cart:changed', this._cart);
			this.events.emit('card:update', { id: product.id, inCart: true });
		}
	}

	removeFromCart(id: string): void {
		const item = this._cart.find((item) => item.id === id);
		if (item) {
			this._cart = this._cart.filter((item) => item.id !== id);
			this.events.emit('cart:changed', this._cart);
			this.events.emit('card:update', {
				id: item.productId,
				inCart: this.isInCart(item.productId),
			});
		}
	}

	public getCartTotal(): number {
		return this._cart.reduce(
		  (sum, item) => sum + item.price * item.quantity, 
		  0
		);
	}

	clearCart(): void {
		this._cart = [];
		this.events.emit('cart:changed', this._cart);
	}

	private generateUID(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	isInCart(productId: string): boolean {
		return this._cart.some((item) => item.productId === productId);
	}

	updateCartItem(id: string, quantity: number): void {
		const item = this._cart.find((i) => i.id === id);
		if (item) {
			item.quantity = Math.max(1, quantity);
			this.events.emit('cart:changed', this._cart);
		}
	}
}
