import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { Success } from './Success';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class Modal extends Component<HTMLElement> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	private _handleKeyDown: (event: KeyboardEvent) => void;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') this.close();
		};

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (e) => e.stopPropagation());
	}

	setContent(content: HTMLElement): void {
		this._content.replaceChildren(content);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this._handleKeyDown);
	}

	close() {
		this.container.classList.remove('modal_active');
		document.body.classList.remove('no-scroll');
		document.removeEventListener('keydown', this._handleKeyDown);
		this.events.emit('modal:close');
	}

	showSuccess(total: number) {
		const successTemplate = ensureElement<HTMLTemplateElement>('#success');
		const success = new Success(cloneTemplate(successTemplate), {
			onClick: () => this.close(),
		});
		success.total = total;
		this.setContent(success.getContainer());
		this.open();
	}
}
