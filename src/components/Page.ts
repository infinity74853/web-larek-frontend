import { Card } from './Card';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';
import { Product } from '../types';

export class Page {
	private basketCounter: HTMLElement;

	constructor(
		private events: IEvents,
		private cardCatalogTemplate: HTMLTemplateElement,
		private appContainer: HTMLElement
	) {
		this.basketCounter = ensureElement('.header__basket-counter');

		// Инициализация обработчика корзины
        const basketButton = ensureElement('.header__basket');
        basketButton.addEventListener('click', () => 
            events.emit('basket:open')
        );		
	}
    
	public renderCatalog(products: Product[], cartIds: string[]) {
		this.appContainer.innerHTML = '';
		const fragment = document.createDocumentFragment();
	
		products.forEach((product) => {
			const card = new Card(cloneTemplate(this.cardCatalogTemplate), {
				onClick: () => this.events.emit('product:add', product),
				onPreview: () => this.events.emit('preview:open', product),
			});
	
			card.render({
				...product,
				inCart: cartIds.includes(product.id)
			});
	
			fragment.appendChild(card.getContainer());
		});
	
		this.appContainer.appendChild(fragment);
	}

    public updateBasketCounter(count: number) {
        this.basketCounter.textContent = String(count);
    }		
}