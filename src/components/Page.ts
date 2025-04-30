import { AppData } from "./AppData";
import { Card } from "./Card";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/Events";
import { Product } from "../types";

export class Page {
    constructor(
        private appData: AppData,
        private events: IEvents,
        private cardCatalogTemplate: HTMLTemplateElement,
        private appContainer: HTMLElement
    ) {        
        // Подписываемся на событие изменения каталога
        this.events.on('catalog:changed', () => this.renderCatalog());
    }

    // Делаем метод публичным для обработки событий
    public renderCatalog() {
        this.appContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
    
        this.appData.products.forEach(product => {
            const card = new Card(cloneTemplate(this.cardCatalogTemplate), {
                onClick: () => this.events.emit('product:add', product),
                onPreview: () => this.events.emit('preview:open', product)
            });
            
            card.render({
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
                category: product.category
            });
            
            fragment.appendChild(card.getContainer());
        });
    
        this.appContainer.appendChild(fragment);
    }
}