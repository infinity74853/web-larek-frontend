import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private _closeCallback: (e: KeyboardEvent) => void;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = this.container.querySelector('.modal__content') as HTMLElement;

        if (!this._closeButton) throw new Error('Close button not found');
        if (!this._content) throw new Error('Content container not found');

        this._closeCallback = (e: KeyboardEvent) => {
            if (e.key === 'Escape') this.close();
        };
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
        
        // Добавляем обработчик для кнопки "В корзину"
        const addButton = this._content.querySelector('.card__button');
        if (addButton) {
            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                const card = this._content.querySelector('.card');
                if (card) {
                    this.events.emit('card:add', { 
                        id: card.getAttribute('data-id'),
                        title: card.querySelector('.card__title')?.textContent,
                        price: card.querySelector('.card__price')?.textContent
                    });
                }
                this.close();
            });
        }
    }

    open() {
        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';
        
        // Показываем модальное окно
        this.container.classList.add('modal_active');
        
        // Прокручиваем к модальному окну
        this.container.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Добавляем обработчики событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
        this._content.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('keydown', this._closeCallback);
        
        this.events.emit('modal:open');
    }

    close() {
        // Восстанавливаем скролл страницы
        document.body.style.overflow = '';
        
        // Скрываем модальное окно
        this.container.classList.remove('modal_active');
        
        // Удаляем обработчики событий
        this._closeButton.removeEventListener('click', this.close.bind(this));
        this.container.removeEventListener('click', this.close.bind(this));
        document.removeEventListener('keydown', this._closeCallback);
        
        // Очищаем контент
        this._content.innerHTML = '';
        
        this.events.emit('modal:close');
    }
}