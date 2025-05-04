import { Component } from "../base/Component";
import { AppData } from "../AppData";
import { Card } from "../Card";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Basket extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        private appData: AppData,
        private cardBasketTemplate: HTMLTemplateElement
    ) {
        super(container);
        this._title = this.container.querySelector('.basket__title');
        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        this.initialize();
        this.updateBasket();
    }

    private initialize() {
        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        
        this.events.on('cart:changed', () => this.updateBasket());
        this._button.addEventListener('click', () => {
            this.events.emit('order:start');            
        });
    }

    private updateBasket() {
        this._title.textContent = 'Корзина';
        this._list.innerHTML = '';
        this.appData.cart.forEach((item, index) => {
            const card = new Card(cloneTemplate(this.cardBasketTemplate), {
                onClick: () => this.appData.removeFromCart(item.id)
            });
            
            card.render({
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            });
            
            this._list.appendChild(card.getContainer());
        });
        
        this._total.textContent = `${this.appData.getCartTotal()} синапсов`;
        this.setDisabled(this._button, this.appData.cart.length === 0);
    }
}