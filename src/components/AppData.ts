import { EventEmitter } from "./base/Events";
import { Product, ICartItem, IOrderData } from "../types";
import { Card } from "./Card";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/Events";

export class AppData extends EventEmitter {
    private _products: Product[] = [];
    private _cart: ICartItem[] = [];
    private _order: IOrderData | null = null;
    private _preview: Product | null = null;
    private _previewTemplate: HTMLTemplateElement;
    
    constructor(
        previewTemplate: HTMLTemplateElement,
        protected events: IEvents // Добавляем events в параметры
    ) {
        super();
        this._previewTemplate = previewTemplate;        
    }

    openProductPreview(product: Product) {
        const card = new Card(cloneTemplate(this._previewTemplate), {
            onClick: (e) => {
                e.stopPropagation(); // Важно!
                this.addToCart(product);
            }
        });
        
        // Чистая событийная модель
        this.events.emit('preview:open', {
            content: card.render({
                /* данные */
            })
        });
    }

    // Остальные методы без изменений
    get products(): Product[] {
        return this._products;
    }

    get cart(): ICartItem[] {
        return this._cart;
    }

    get order(): IOrderData | null {
        return this._order;
    }

    get preview(): Product | null {
        return this._preview;
    }

    setCatalog(products: Product[]): void {
        this._products = products;
        this.emit('catalog:changed', { products: this._products });
    }

    setPreview(product: Product): void {
        this._preview = product;
        this.emit('preview:changed', { product: this._preview });
    }

    addToCart(product: Product): void {
        const existing = this._cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this._cart.push({ ...product, quantity: 1 });
        }
        this.emit('cart:changed', { items: this._cart });
    }

    removeFromCart(id: string, event?: Event): void {
        if (event) {
            event.stopPropagation(); // Останавливаем всплытие
        }
        this._cart = this._cart.filter(item => item.id !== id);
        this.emit('cart:changed', { items: this._cart });
    }

    clearCart(): void {
        this._cart = [];
        this.emit('cart:changed', { items: this._cart });
    }

    getCartTotal(): number {
        return this._cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
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
        this.emit('order:init', { order: this._order });
    }

    updateOrder(data: Partial<IOrderData>): void {
        if (this._order) {
            this._order = { ...this._order, ...data };
            this.emit('order:changed', { order: this._order });
        }
    }
}