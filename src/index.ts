import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { LarekAPI } from './components/LarekAPI';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Product, IOrderForm, IContactsForm } from './types';
import { Contacts } from './components/Contacts';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Success } from './components/common/Success';

// Инициализация API
const api = new LarekAPI(API_URL, CDN_URL);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Инициализация компонентов
const events = new EventEmitter();
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'),	events,	ensureElement<HTMLTemplateElement>('#success'));
const appData = new AppData(events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
events.emit('cart:changed');

const page = new Page( appData,	events,	cardCatalogTemplate, ensureElement('#app-container'));

api.getProducts().then((products) => {	appData.setCatalog(products);});

const orderComponent = new Order(cloneTemplate(orderTemplate), events, appData);
const contactsComponent = new Contacts(cloneTemplate(contactsTemplate), events);

// Обработчик изменений поля email
events.on('contacts:email:change', (event: { value: string }) => {
    appData.updateOrderField('email', event.value);
});

// Обработчик изменений поля телефон
events.on('contacts:phone:change', (event: { value: string }) => {
    appData.updateOrderField('phone', event.value);
});

events.on('modal:set-data', (product: Product) => {
	modal.setProductData(product);
});

events.on('cart:changed', () => {
    const basketItems = appData.cart.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', { productId: item.productId })
        });
        
        card.render({
            id: item.productId,
            title: item.title,
            price: item.price,
            index: index + 1
        });
        
        return card.getContainer();
    });
    
    basket.updateBasket(basketItems, appData.getCartTotal());
});

events.on('product:add', (product: Product) => {
	appData.addToCart(product);
	events.emit('card:update', { 
        id: product.id, 
        inCart: true 
    });
});

events.on('card:update', (data: { id: string; inCart: boolean }) => {
    const card = page.getCard(data.id);
    if (card) {
        card.inCart = data.inCart;
    }
});

events.on('preview:open', (product: Product) => {
    const previewCard = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('product:add', product),
    });

    // Добавляем подписку на обновления состояния
    events.on('card:update', (data: { id: string; inCart: boolean }) => {
        if (data.id === product.id) {
            previewCard.updateCartState(data.inCart);
        }
    });

    previewCard.render(product);
    previewCard.inCart = appData.isInCart(product.id);
    modal.open(previewCard.getContainer());
});

// Клик по корзине
events.on('basket:open', () => {
	events.emit('cart:changed');
	modal.open(basket.render());
  });

// Обработчик удаления из корзины
events.on('basket:remove', (event: { productId: string }) => {
    appData.removeFromCart(event.productId);
});

// Оформление заказа
events.on('order:start', () => {
	appData.initOrder();
	orderComponent.resetPayment();
	orderComponent.address = '';

	const modalContent = ensureElement<HTMLElement>(
		'#modal-container .modal__content'
	);
	modalContent.innerHTML = '';
	modalContent.appendChild(orderComponent.getContainer());
	events.emit('modal:open');
});

events.on('order:submit', (data: IOrderForm) => {
	appData.updateOrderField('payment', data.payment);
	appData.updateOrderField('address', data.address);
	events.emit('contacts:open');
});

events.on('contacts:open', () => {
	const modalContent = ensureElement<HTMLElement>(
		'#modal-container .modal__content'
	);
	modalContent.innerHTML = '';
	modalContent.appendChild(contactsComponent.getContainer());
	events.emit('modal:open');
});

// Обработчик отправки контактов
events.on('contacts:submit', (data: IContactsForm) => {
	appData.updateOrderField('email', data.email);
	appData.updateOrderField('phone', data.phone);

	appData.clearCart();
	modal.renderSuccess(appData.order.total);
});

events.on('order:complete', () => {
	const successTemplate = ensureElement<HTMLTemplateElement>('#success');
	const successComponent = new Success(cloneTemplate(successTemplate), {
		onClick: () => events.emit('modal:close'),
	});

	successComponent.total = appData.order?.total || 0;

	const modalContent = ensureElement<HTMLElement>(
		'#modal-container .modal__content'
	);
	modalContent.innerHTML = '';
	modalContent.appendChild(successComponent.getContainer());
	events.emit('modal:open');

	appData.clearCart();
});

// Обработчик закрытия модалки
events.on('modal:close', () => {
	events.emit('cart:changed');
	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		modalContainer.classList.remove('modal_active');
	}
	document.body.classList.remove('no-scroll');
});
