import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { Product } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Modal extends Component<HTMLElement> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _isOpened = false;
	protected successTemplate: HTMLTemplateElement;
	private _handleKeyDown: (event: KeyboardEvent) => void;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		successTemplate: HTMLTemplateElement
	) {
		super(container);
		this.successTemplate = successTemplate;
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Инициализируем обработчик клавиатуры
		this._handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				this.close();
			}
		};

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (e: Event) => e.stopPropagation());
	}

	// Метод для установки данных продукта
	setProductData(product: Product): void {
		this.setText('.modal__title', product.title);
		this.setText('.modal__description', product.description || '');
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(content?: HTMLElement) {
		if (content) {
			this.content = content;
		}
		this.addClass('modal_active');
		document.addEventListener('keydown', this._handleKeyDown);
		this.events.emit('modal:open');
	}

	close() {
		this.removeClass('modal_active');
		document.removeEventListener('keydown', this._handleKeyDown);
		this.events.emit('modal:close');
	}

	get isOpened(): boolean {
		return this._isOpened;
	}

	renderSuccess(total: number) {
		const successTemplate = cloneTemplate(this.successTemplate);
		this.setText('.order-success__description', `Списано ${total} синапсов`);
		this.content = successTemplate;
		this.open();
	}
}
