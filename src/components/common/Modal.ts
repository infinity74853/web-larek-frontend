import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal {
    protected _modal: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(modalId: string, protected events: EventEmitter) {
        this._modal = ensureElement<HTMLElement>(`#${modalId}`);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this._modal);
        this._content = ensureElement<HTMLElement>('.modal__content', this._modal);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this._modal.addEventListener('click', this.handleOverlayClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.close();
    };

    private handleOverlayClick = (e: MouseEvent) => {
        if (e.target === this._modal) this.close();
    };

    open(): void {
        this._modal.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this._modal.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this._content.innerHTML = '';
        this._content.append(content);
    }
}