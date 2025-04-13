import { EventEmitter } from "../base/events";

export class Modal {
  protected modalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected overlay: HTMLElement;

  constructor(modalId: string, protected events: EventEmitter) {
    //находим элементы
    this.modalElement = document.getElementById(modalId);
    this.closeButton = this.modalElement.querySelector('.modal__close') as HTMLButtonElement;
    this.overlay = this.modalElement.querySelector('.modal__overlay') as HTMLElement;

    //вешаем обработчики
    this.closeButton.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
  }

  open() {
    this.modalElement.classList.add('modal_active');
    document.addEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalElement.classList.remove('modal_active');
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
    this.events.emit('modal:close');
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  setContent(content: HTMLElement) {
    const container = this.modalElement.querySelector('.modal__content');
    container.innerHTML = '';
    container.append(content);
  }
}