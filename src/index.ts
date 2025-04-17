import "./scss/styles.scss";
import { EventEmitter } from "./components/base/events";
import { Modal } from "./components/common/Modal";
import { api } from "./api/client";
import { Card } from "./components/Card";
import { Product } from "./types";

const events = new EventEmitter();

const appContainer = document.getElementById('app-container') || createAppContainer();

function createAppContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'app-container';
    document.body.appendChild(container);
    return container;
}

//загрузка и отображение товаров
async function loadProducts() {
    try {
        showLoader();
        const products = await api.getProducts();
        renderProducts(products);
    } catch (error) {
        showError("Не удалось загрузить товары");
        console.error("Ошибка загрузки:", error);
    }
}

function renderProducts(products: Product[]) {
    appContainer.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    products.forEach(product => {
        const card = new Card(product, {
            onClick: () => handleAddToCart(product)
        });
        fragment.appendChild(card.render());
    });
    
    appContainer.appendChild(fragment);
}

function handleAddToCart(product: Product) {
    console.log("Добавляем в корзину:", product);
    events.emit('cart:add', product);
}

function showLoader() {
    appContainer.innerHTML = '<div class="loader">Загрузка...</div>';
}

function showError(message: string) {
    appContainer.innerHTML = `<div class="error">${message}</div>`;
}

//запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

//подписка на событие
events.on('cart:add', (product: Product) => {
    console.log('Событие: добавление в корзину', product);
});