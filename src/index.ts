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
import { settings, API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate, ensureAllElements } from './utils/utils';
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
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const appData = new AppData(events);
const page = new Page(events, ensureElement('#app-container'));
const basket = new Basket(cloneTemplate(basketTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
events.emit('cart:changed');

const orderComponent = new Order(cloneTemplate(orderTemplate), events, appData);
const contactsComponent = new Contacts(cloneTemplate(contactsTemplate), events);

// Подписки на события
events.on('catalog:changed', () => {
	const cards = appData.products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:add', product),
			onPreview: () => events.emit('preview:open', product),
		});

		card.render({
			...product,
			inCart: appData.isInCart(product.id),
		});

		return card.getContainer();
	});

	page.renderCatalog(cards);
});

// Обработчик изменений поля email
events.on('contacts:email:change', (event: { value: string }) => {
	appData.updateOrderField('email', event.value);
});

// Обработчик изменений поля телефон
events.on('contacts:phone:change', (event: { value: string }) => {
	appData.updateOrderField('phone', event.value);
});

events.on('cart:changed', () => {
	// Обновляем счетчик
	page.updateBasketCounter(appData.cart.length);

	// Обновляем корзину
	const basketItems = appData.cart.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () =>
				events.emit('basket:remove', { productId: item.productId }),
		});

		card.render({
			id: item.productId,
			title: item.title,
			price: item.price,
			index: index + 1,
		});

		return card.getContainer();
	});

	basket.updateBasket(basketItems, appData.getCartTotal());

	// Обновляем каталог
	events.emit('catalog:changed');
});

events.on('product:add', (product: Product) => {
	appData.addToCart(product);
	events.emit('card:update', {
		id: product.id,
		inCart: true,
	});
});

events.on('card:update', (data: { id: string; inCart: boolean }) => {
	const buttons = ensureAllElements<HTMLButtonElement>(
		`[data-id="${data.id}"] .card__button`
	);

	buttons.forEach((button) => {
		button.disabled = data.inCart;
		button.textContent = data.inCart
			? settings.labels.inCart
			: settings.labels.addToCart;
	});
});

events.on('preview:open', (product: Product) => {
	const previewCard = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('product:add', product),
	});

	previewCard.render({
		...product,
		inCart: appData.isInCart(product.id),
	});

	modal.setContent(previewCard.getContainer());
	modal.open();
});

// Клик по корзине
events.on('basket:open', () => {
	events.emit('cart:changed');
	modal.setContent(basket.render());
	modal.open();
});

// Обработчик удаления из корзины
events.on('basket:remove', (event: { productId: string }) => {
	appData.removeFromCart(event.productId);
});

// Оформление заказа
events.on('order:start', () => {
	appData.initOrder();
	orderComponent.reset();

	modal.setContent(orderComponent.getContainer());
	modal.open();
});

events.on('order:submit', (data: IOrderForm) => {
	appData.updateOrderField('payment', data.payment);
	appData.updateOrderField('address', data.address);
	events.emit('contacts:open');
});

events.on('contacts:open', () => {
	modal.setContent(contactsComponent.getContainer());
	modal.open();
});

// Обработчик отправки контактов
events.on('contacts:submit', async (data: IContactsForm) => {
	try {
		contactsComponent.isLoading = true;
		appData.updateOrderField('email', data.email);
		appData.updateOrderField('phone', data.phone);

		const result = await appData.sendOrder(api);
		if (!result?.id) {
			throw new Error('Заказ не был создан');
		}

		modal.close();

		const successComponent = new Success(cloneTemplate(successTemplate), {
			onClick: () => modal.close(),
		});
		successComponent.render({ total: result.total });

		modal.setContent(successComponent.getContainer());
		modal.open();

		appData.clearOrder();
		appData.clearCart();
		orderComponent.reset();
		contactsComponent.reset();
	} catch (error) {
		console.error('Ошибка:', error);
	} finally {
		contactsComponent.isLoading = false;
	}
});

events.on('modal:close', () => {
	events.emit('cart:changed');
});

api.getProducts().then((products) => {
	appData.setCatalog(products);
});
