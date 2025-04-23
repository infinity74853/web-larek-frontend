import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(
        container: HTMLElement, 
        protected events: IEvents  // Добавляем events в параметры
    ) {
        super(container);

        // Используем querySelector с явной проверкой
        const closeButton = container.querySelector('.modal__close');
        const content = container.querySelector('.modal__content');

        if (!closeButton) throw new Error('Close button not found');
        if (!content) throw new Error('Content container not found');

        this._closeButton = closeButton as HTMLButtonElement;
        this._content = content as HTMLElement;

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (e) => e.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');  // Теперь events доступен
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');  // Теперь events доступен
    }
}