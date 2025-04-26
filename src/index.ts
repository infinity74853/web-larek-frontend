import "./scss/styles.scss";

import { EventEmitter } from "./components/base/events";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { Order } from "./components/Order";
import { LarekAPI } from "./components/LarekAPI";
import { Card } from "./components/Card";
import { AppData } from "./components/AppData";
import { Product, ICartItem, IOrderData, ICard } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Инициализация API
const api = new LarekAPI(API_URL, CDN_URL);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация компонентов
const events = new EventEmitter();
const modal = new Modal(ensureElement('#modal-container'));
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const appData = new AppData(cardPreviewTemplate, events);

// DOM элементы
const appContainer = ensureElement('#app-container');
const basketCounter = ensureElement('.header__basket-counter');
const basketButton = ensureElement('.header__basket');

// Состояние приложения
const state = {
    products: [] as Product[],
    cart: {
        items: [] as ICartItem[],
        get total(): number {
            return this.items.reduce((sum: number, item: ICartItem) => 
                sum + (item.price || 0) * item.quantity, 0);
        }
    },
    order: {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }
};

// Рендер товаров
function renderProducts(products: Product[]) {
    appContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => addToCart(product),
            onPreview: () => showPreview(product)
        });
        card.render({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            category: product.category,
            description: product.description
        });
        fragment.appendChild(card.getContainer());
    });

    appContainer.appendChild(fragment);
}

// Работа с корзиной
function addToCart(product: Product) {
    const existing = state.cart.items.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        state.cart.items.push({ ...product, quantity: 1 });
    }
    updateCart();
    showNotification(`${product.title} добавлен в корзину`);
}

function updateCart() {
    const items = state.cart.items.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromCart(item.id);
            }
        });
        card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        } as ICard);
        return card.getContainer();
    });
    
    basket.items = items;
    basket.total = state.cart.total;
    basketCounter.textContent = state.cart.items.length.toString();
}

function removeFromCart(id: string) {
    state.cart.items = state.cart.items.filter(item => item.id !== id);
    updateCart();
}

function showPreview(product: Product) {
    const preview = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            addToCart(product);
            modal.close();
        }
    });
    
    preview.render({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        category: product.category,
        description: product.description
    });
    
    modal.content = preview.getContainer();
    modal.open();
}

// Модальные окна
function showNotification(message: string) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    modal.content = notification;
    setTimeout(() => modal.close(), 2000);
}

// Оформление заказа
function initOrder() {
    modal.content = order.getContainer();
}

function initContacts() {
    const contacts = cloneTemplate(contactsTemplate);
    const form = contacts.querySelector('form')!;
    const submit = contacts.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    form.addEventListener('input', () => {
        const formData = new FormData(form);
        state.order = {
            ...state.order,
            ...Object.fromEntries(formData.entries())
        } as typeof state.order;
        submit.disabled = !(state.order.email && state.order.phone);
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const result = await api.createOrder({
                ...state.order,
                items: state.cart.items.map(item => item.id),
                total: state.cart.total
            } as IOrderData);
            
            if (result.id) {
                showSuccess();
            }
        } catch (error) {
            console.error('Ошибка оформления:', error);
        }
    });
    
    modal.content = contacts;
}

function showSuccess() {
    const success = cloneTemplate(successTemplate);
    const description = success.querySelector('.order-success__description');
    
    if (description) {
        description.textContent = `Списано ${state.cart.total} синапсов`;
    }
    
    const closeButton = success.querySelector('.order-success__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            state.cart.items = [];
            updateCart();
            modal.close();
        });
    }
    
    modal.content = success;
}

// Обработчики событий
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

events.on('order:open', initOrder);
events.on('order:submit', initContacts);
events.on('basket:open', () => {
    modal.content = basket.getContainer();
    modal.open();
});

// Загрузка данных
document.addEventListener('DOMContentLoaded', async () => {
    try {
        state.products = await api.getProducts();
        renderProducts(state.products);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
});