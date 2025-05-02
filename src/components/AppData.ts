//import { EventEmitter } from "./base/Events";
import { Product, ICartItem, IOrderData } from "../types";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/Events";

export class AppData {
    private _products: Product[] = [];
    private _cart: ICartItem[] = [];
    private _order: IOrderData | null = null;
    private _previewTemplate: HTMLTemplateElement;
    
    constructor(
        previewTemplate: HTMLTemplateElement,
        protected events: IEvents
    ) {
        this._previewTemplate = previewTemplate;
        
        // Автоматическая подписка на события
        events.on('preview:open', (product: Product) => this.openProductPreview(product));
    }

    get order(): IOrderData | null {
        return this._order;
    }

    // Геттер для шаблона превью
    get previewTemplate(): HTMLTemplateElement {
        return this._previewTemplate;
    }

    // Основные геттеры
    get products(): Product[] {
        return this._products;
    }

    get cart(): ICartItem[] {
        return this._cart;
    }

    // Обновленный метод установки каталога
    setCatalog(products: Product[]): void {
        this._products = products;
        this.events.emit('catalog:changed', this._products); // Явная передача данных
    }

    // Метод открытия превью товара
    openProductPreview(product: Product) {
        this.events.emit('preview:changed', product);
        this.events.emit('modal:set-data', product);
    }

    // Методы работы с корзиной
    private generateUID(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addToCart(product: Product): void {
        this._cart.push({
            id: this.generateUID(),
            productId: product.id,
            quantity: 1,
            price: product.price || 0,
            title: product.title
        });
        this.events.emit('cart:changed', this._cart);
        this.events.emit('card:update', { id: product.id });
    }

    // Остальные методы
    removeFromCart(id: string): void {
        this._cart = this._cart.filter(item => item.id !== id);
        this.events.emit('cart:changed', this._cart);
    }

    isInCart(id: string): boolean {
        return this._cart.some(item => item.productId === id);
    }
    
    getCartTotal(): number {
        return this._cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    initOrder(): void {
        this._order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: this._cart.map(item => item.id),
            total: this.getCartTotal()
        };
        this.events.emit('order:init', this._order);
    }

    // Добавим метод обновления количества
    updateCartItem(id: string, quantity: number): void {
        const item = this._cart.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.events.emit('cart:changed', this._cart);
        }
    }

    clearCart(): void {
        this._cart = [];
        this.events.emit('cart:changed', this._cart);
    }

    updateOrder(data: Partial<IOrderData>): void {
        if (this._order) {
            this._order = { ...this._order, ...data };
            this.events.emit('order:changed', this._order);
        }
    }
}