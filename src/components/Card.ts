import { Product } from '../types';

export class Card {
  constructor(private product: Product) {}
  
  render(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${this.product.title}</h3>
      <p>Цена: ${this.product.price} ₽</p>
    `;
    return card;
  }
}