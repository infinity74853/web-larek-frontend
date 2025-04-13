import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { api } from './api/client';
import { Card } from './components/Card';

const events = new EventEmitter();
const modal = new Modal('modal', events);

const testButton = document.createElement('button');
testButton.textContent = 'Открыть модалку';
document.body.append(testButton);

testButton.addEventListener('click', () => {
    modal.open();
});

//подписка на закрытие
events.on('modal:close', () => {
    console.log('Модалка закрыта через EventEmitter');
});

async function init() {
    const products = await api.getProducts();
    const card = new Card(products[0]);
    document.body.append(card.render());
  }

  init();