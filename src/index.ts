import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { Order } from "./components/Order";
import { LarekAPI } from "./components/LarekAPI";
import { AppData } from "./components/AppData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { Product, IOrderForm, IContactsForm } from "./types";
import { Contacts } from "./components/Contacts";
import { API_URL, CDN_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { Success } from './components/common/Success';

// Инициализация API
const api = new LarekAPI(API_URL, CDN_URL);

api.getProducts()
    .then((products) => { // products уже массив
        appData.setCatalog(products);
    });

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
const modal = new Modal(document.querySelector('#modal-container'), events, document.querySelector('#success') as HTMLTemplateElement);
const appData = new AppData(cardPreviewTemplate, events);
const page = new Page(appData, events, cardCatalogTemplate, ensureElement('#app-container'));
const basket = new Basket(cloneTemplate(basketTemplate), events, appData, cardBasketTemplate);
const basketCounter = ensureElement('.header__basket-counter');
const appContainer = ensureElement('#app-container');
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const orderComponent = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = cloneTemplate(contactsTemplate) as HTMLFormElement;
const contactsComponent = new Contacts(contactsForm, events);

events.on('modal:set-data', (product: Product) => {
    modal.setProductData(product);
});

// Подписка на изменение корзины
events.on('cart:changed', () => {
    basketCounter.textContent = String(appData.cart.length);
});

// В методе добавления в корзину
events.on('product:add', (product: Product) => {
    appData.addToCart(product);
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

// Обработчик удаления из корзины
events.on('basket:remove', (event: { id: string }) => {
    appData.removeFromCart(event.id);
});

// Обработчик изменения количества
events.on('basket:update', (event: { id: string; quantity: number }) => {
    appData.updateCartItem(event.id, event.quantity);
});

// Добавляем обработчики
events.on('order:start', () => {
    appData.initOrder();
    orderComponent.resetPayment();
    orderComponent.address = '';
    
    const modalContent = document.querySelector('#modal-container .modal__content');
    if (modalContent) {
        modalContent.innerHTML = '';
        modalContent.appendChild(orderComponent.getContainer()); // Используем метод
        events.emit('modal:open');
    }
});

events.on('order:submit', (data: IOrderForm) => {
    console.log('Order form submitted:', data);
    appData.updateOrder(data);
    events.emit('contacts:open');
});

events.on('contacts:submit', (data: IContactsForm) => {
    appData.updateOrder(data);
    events.emit('order:complete');
});

events.on('contacts:open', () => {
    const modalContent = document.querySelector('#modal-container .modal__content');
    if (modalContent && contactsComponent) {
        modalContent.innerHTML = '';
        modalContent.appendChild(contactsComponent.getContainer());
        events.emit('modal:open');
    }
});

events.on('order:complete', () => {
    // Очищаем корзину ПЕРЕД показом успешного сообщения
    appData.clearCart();
    
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    const successComponent = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            events.emit('modal:close');
            events.emit('cart:changed'); // Обновляем корзину
        }
    });

    const modalContent = document.querySelector('#modal-container .modal__content');
    if (modalContent) {
        modalContent.innerHTML = '';
        modalContent.appendChild(successComponent.getContainer());
        events.emit('modal:open');
    }
});

// Добавить обработчик закрытия модалки
events.on('modal:close', () => {
    events.emit('cart:changed');
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('modal_active');
    }
    document.body.classList.remove('no-scroll');
});
