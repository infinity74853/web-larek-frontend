import { AppData } from './AppData';
import { Card } from './Card';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

export class Page {
	private cards: Map<string, Card>;
	private basketCounter: HTMLElement;

	constructor(
		private appData: AppData,
		private events: IEvents,
		private cardCatalogTemplate: HTMLTemplateElement,
		private appContainer: HTMLElement
	) {
		this.cards = new Map<string, Card>();
		this.basketCounter = ensureElement('.header__basket-counter');

		// Инициализация обработчика корзины
        const basketButton = ensureElement('.header__basket');
        basketButton.addEventListener('click', () => 
            events.emit('basket:open')
        );

		this.events.on('catalog:changed', () => this.renderCatalog());
		this.events.on('card:update', (data: { id: string }) => {
			const card = this.cards.get(data.id);
			card.inCart = this.appData.isInCart(data.id);
		});
		this.events.on('cart:changed', () => this.updateBasketCounter());
	}

	private updateBasketCounter() {
        this.basketCounter.textContent = String(this.appData.cart.length);
    }

	public renderCatalog() {
		this.cards.clear();
		this.appContainer.innerHTML = '';
		const fragment = document.createDocumentFragment();

		this.appData.products.forEach((product) => {
			const card = new Card(cloneTemplate(this.cardCatalogTemplate), {
				onClick: () => this.events.emit('product:add', product),
				onPreview: () => this.events.emit('preview:open', product),
			});

			// Состояние кнопки
			card.inCart = this.appData.isInCart(product.id);

			// Свойства карточки
			card.id = product.id;
			card.title = product.title;
			card.price = product.price;
			card.category = product.category;
			card.image = product.image;
			card.description = product.description;

			this.cards.set(product.id, card);

			fragment.appendChild(card.getContainer());
		});

		this.appContainer.appendChild(fragment);
	}

	public getCard(id: string): Card | undefined {
		return this.cards.get(id);
	}
}
