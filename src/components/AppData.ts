import {
	Product,
	ICartItem,
	IOrderData,
	FormErrors,
	IOrderResult,
} from '../types';
import { IEvents } from './base/Events';
import { settings } from '../utils/constants';
import { LarekAPI } from './LarekAPI';

export class AppData {
	private _products: Product[] = [];
	private _cart: ICartItem[] = [];
	private _order: IOrderData | null = null;
	private _formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	setCatalog(products: Product[]): void {
		this._products = products;
		this.events.emit('catalog:changed', this._products);
	}

	getCartIds(): string[] {
		return this._cart.map((item) => item.productId);
	}

	// Обновление полей заказа
	updateOrderField<K extends keyof IOrderData>(field: K, value: IOrderData[K]) {
		if (!this._order) this.initOrder();
		this._order[field] = value;
		this.validateForm();
		this.events.emit('order:change', this._order);
	}

	async sendOrder(api: LarekAPI): Promise<IOrderResult> {
		if (!this._order)
			throw new Error(settings.errorMessages.order.notInitialized);

		const orderData: IOrderData = {
			...this._order,
			items: this._cart.map((item) => item.productId),
			total: this.getCartTotal(),
		};

		return api.createOrder(orderData).then((result: IOrderResult) => {
			this.clearCart();
			return result;
		});
	}

	// Инициализация заказа
	initOrder(): void {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: this._cart.map((item) => item.productId),
			total: this.getCartTotal(),
		};
		this.events.emit('order:init', this._order);
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

	addToCart(product: Product): void {
		if (!this.isInCart(product.id)) {
			this._cart.push({
				productId: product.id,
				price: product.price || 0,
				title: product.title,
			});
			this.events.emit('cart:changed', this._cart);
			this.events.emit('card:update', {
				id: product.id,
				inCart: true,
			});
		}
	}

	getCartTotal(): number {
		return this._cart.reduce((sum, item) => sum + item.price, 0);
	}

	removeFromCart(productId: string): void {
		this._cart = this._cart.filter((item) => item.productId !== productId);
		this.events.emit('cart:changed', this._cart);
		this.events.emit('card:update', {
			id: productId,
			inCart: this.isInCart(productId),
		});
	}

	clearCart(): void {
		this._cart = [];
		this.events.emit('cart:changed', this._cart);
	}

	isInCart(productId: string): boolean {
		return this._cart.some((item) => item.productId === productId);
	}

	// Методы валидации
	private validateForm(): void {
		const errors: FormErrors = {};
		const order = this._order;

		if (!order) return;

		// Валидация адреса
		if (
			!order.address ||
			order.address.length < settings.validation.minAddressLength
		) {
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

	clearOrder() {
		this.updateOrderField('items', []);
		this.updateOrderField('payment', '');
		this.updateOrderField('address', '');
		this.updateOrderField('email', '');
		this.updateOrderField('phone', '');
	}
}
