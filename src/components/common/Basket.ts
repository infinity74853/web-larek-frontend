import { Component } from "../base/Component";
import { createElement, formatNumber } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = this.ensureElementSafe('.basket__list');
        this._total = this.ensureElementSafe('.basket__total');
        this._button = this.ensureElementSafe('.basket__action');
        this._counter = this.ensureCounterElement();

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    private ensureElementSafe(selector: string): HTMLElement {
        const element = this.container.querySelector(selector);
        return element as HTMLElement || document.createElement('div');
    }

    private ensureCounterElement(): HTMLElement {
        let counter = document.querySelector('.header__basket-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'header__basket-counter';
            counter.textContent = '0';
            document.body.prepend(counter);
        }
        return counter as HTMLElement;
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement('p', {
                textContent: 'Корзина пуста',
                className: 'basket__empty'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
        if (this._counter) {
            this._counter.textContent = total > 0 ? '1' : '0';
        }
    }
}