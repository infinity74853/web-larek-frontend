import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';

export class Page {
	private basketCounter: HTMLElement;

	constructor(events: IEvents, private appContainer: HTMLElement) {
		this.basketCounter = ensureElement('.header__basket-counter');

		// Инициализация обработчика корзины
		const basketButton = ensureElement('.header__basket');
		basketButton.addEventListener('click', () => events.emit('basket:open'));
	}

	public renderCatalog(cards: HTMLElement[]) {
		this.appContainer.innerHTML = '';
		this.appContainer.append(...cards);
	}

	public updateBasketCounter(count: number) {
		this.basketCounter.textContent = String(count);
	}
}
