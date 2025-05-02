import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { Order } from "./components/Order";
import { LarekAPI } from "./components/LarekAPI";
import { AppData } from "./components/AppData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { Product } from "./types";
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
const modal = new Modal(ensureElement('#modal-container'), events);
const appData = new AppData(cardPreviewTemplate, events);
const page = new Page(appData, events, cardCatalogTemplate, ensureElement('#app-container'));
const basket = new Basket(cloneTemplate(basketTemplate), events, appData, cardBasketTemplate);
const basketCounter = ensureElement('.header__basket-counter');
const order = new Order(cloneTemplate(orderTemplate), events, appData, api, contactsTemplate, successTemplate);
const appContainer = ensureElement('#app-container');


// Подписка на изменение корзины
events.on('cart:changed', () => {
    basketCounter.textContent = String(appData.cart.length);
});

events.on('product:add', (product: Product) => {
    appData.addToCart(product);
    modal.close();
});

events.on('preview:open', (product: Product) => {
    const previewCard = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            appData.addToCart(product);
            modal.close();
        }
    });
    previewCard.render(product);
    modal.open(previewCard.containerElement);
});

// Инициализация корзины
const basketButton = ensureElement('.header__basket');
basketButton.addEventListener('click', () => events.emit('basket:open'));

// Клик по корзине
events.on('basket:open', () => {
    modal.open(basket.render());
});

// Загрузка данных
api.getProducts()
    .then(products => appData.setCatalog(products))
    .catch(console.error);
