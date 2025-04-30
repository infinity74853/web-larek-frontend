import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<HTMLElement> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _isOpened = false;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        
        this._closeButton = this.container.querySelector('.modal__close');
        this._content = this.container.querySelector('.modal__content');
        
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (e: Event) => e.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(content?: HTMLElement) {
        if (content) {
            this.content = content;
        }
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    
    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    get isOpened(): boolean {
        return this._isOpened;
    }
}