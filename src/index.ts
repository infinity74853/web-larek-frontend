import "./scss/styles.scss";
import { EventEmitter } from "./components/base/events";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { LarekAPI } from "./components/LarekAPI";
import { Card } from "./components/Card";
import { Product } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { ensureElement } from "./utils/utils";

// Инициализация API
export const api = new LarekAPI(API_URL, CDN_URL);

// Инициализация событий
const events = new EventEmitter();

// Инициализация модального окна
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Инициализация корзины
const basketContainer = ensureElement<HTMLElement>('.basket');
const basket = new Basket(basketContainer, events);

// Главный контейнер приложения
const appContainer = ensureElement<HTMLElement>('#app-container');

// Состояние приложения
const state = {
    products: [] as Product[],
    cart: {
        items: [] as Array<Product & { quantity: number }>,
        get total() {
            return this.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        }
    }
};

// Рендер карточек товаров
function renderProducts(products: Product[]) {
    appContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    products.forEach(product => {
        const card = new Card(product, {
            onClick: () => addToCart(product),
            onPreview: () => showPreview(product)
        });
        fragment.appendChild(card.render());
    });
    
    appContainer.appendChild(fragment);
}

// Добавление в корзину
function addToCart(product: Product) {
    const existingItem = state.cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.items.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    events.emit('modal:open', {
        content: createNotification(`${product.title} добавлен в корзину`)
    });
}

// Обновление корзины
function updateCart() {
    basket.items = state.cart.items.map(item => {
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="basket__item">
                <span>${item.title}</span>
                <span>${item.quantity} × ${item.price} ₽</span>
            </div>
        `;
        return element.firstChild as HTMLElement;
    });
    basket.total = state.cart.total;
}

// Превью товара
function showPreview(product: Product) {
    const content = document.createElement('div');
    content.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="max-width: 100%">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Цена: ${product.price} ₽</p>
    `;
    events.emit('modal:open', { content });
}

// Вспомогательная функция для уведомлений
function createNotification(message: string): HTMLElement {
    const element = document.createElement('div');
    element.textContent = message;
    return element;
}

// Загрузка товаров
async function loadProducts() {
    try {
        appContainer.innerHTML = '<div class="loader">Загрузка...</div>';
        state.products = await api.getProducts();
        renderProducts(state.products);
    } catch (error) {
        appContainer.innerHTML = '<div class="error">Ошибка загрузки товаров</div>';
        console.error(error);
    }
}

// Обработчики событий
events.on('modal:open', (data: { content: HTMLElement }) => {
    modal.content = data.content;
    modal.open();
});

events.on('modal:close', () => {
    modal.close();
});

events.on('order:open', () => {
    const content = document.createElement('div');
    content.innerHTML = `
        <h2>Оформление заказа</h2>
        <p>Общая сумма: ${state.cart.total} ₽</p>
    `;
    events.emit('modal:open', { content });
});

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Кнопка корзины в шапке
    const cartButton = ensureElement<HTMLButtonElement>('.header__basket');
    cartButton.addEventListener('click', () => {
        events.emit('modal:open', {
            content: basket.container
        });
    });
});