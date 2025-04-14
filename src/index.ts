import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { api } from './api/client';
import { Card } from './components/Card';

const events = new EventEmitter();
const modal = new Modal('modal-container', events);

async function initApp() {
  try {
      const products = await api.getProducts();
      console.log('Products from API:', products);
      
      if (!products || products.length === 0) {
          throw new Error('No products received from API');
      }

      const card = new Card(products[0]);
      document.body.appendChild(card.render());
  } catch (error) {
      console.error('Initialization error:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
