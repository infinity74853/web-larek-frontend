import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private _isOpened = false;

    constructor(container: HTMLElement) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());

        this._setupEventListeners();

        document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    private _setupEventListeners() {
        this._closeButton.addEventListener('click', () => this.close());
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });

        this._content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        if (this._isOpened) return;
        this._isOpened = true;
        document.body.classList.add('modal-open');
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    close() {
        if (!this._isOpened) return;
        this._isOpened = false;
        document.body.classList.remove('modal-open');
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this._handleKeyDown.bind(this));
    }

    // Новый метод для обработки нажатия клавиш
    private _handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}