import { AppData } from './AppData';
import { Card } from './Card';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/Events';

export class Page {
	private cards: Map<string, Card>;

	constructor(
		private appData: AppData,
		private events: IEvents,
		private cardCatalogTemplate: HTMLTemplateElement,
		private appContainer: HTMLElement
	) {
		this.cards = new Map<string, Card>();
		this.events.on('catalog:changed', () => this.renderCatalog());
		this.events.on('card:update', (data: { id: string }) => {
			const card = this.cards.get(data.id);
			card.inCart = this.appData.isInCart(data.id);
		});
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

			// Инициализируем состояние кнопки
			card.inCart = this.appData.isInCart(product.id);

			// Устанавливаем свойства карточки
			card.id = product.id;
			card.title = product.title;
			card.price = product.price;
			card.category = product.category;
			card.image = product.image;
			card.description = product.description;

			// Сохраняем карточку в хранилище
			this.cards.set(product.id, card);

			fragment.appendChild(card.getContainer());
		});

		this.appContainer.appendChild(fragment);
	}
}
