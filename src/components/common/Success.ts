import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<{ total: number }> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        // Исправляем селектор на актуальный
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}