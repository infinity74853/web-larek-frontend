# Проектная работа "web-larek-frontend"

## Используемый стек

HTML, SCSS, TypeScript в ООП-стиле. Webpack.

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build

```

## О проекте

Проект представляет собой приложение интернет-магазин для продажи цифровых товаров,
реализованное на TypeScript с использованием ООП-подхода и архитектуры MVP.


### Приложение включает в себя

- получение с сервера данных списка о продукции;
- просмотр каталога товаров;
- многоэтапное оформление заказа;
- управление корзиной;
- отправка данных о заказе на сервер;


### Бизнес логика

- добавление и удаление товара в корзину;
- выборр способа оплаты;
- ввод данных;
- валидация форм заказа;
- рассчёт общей стоимости;
- история заказов;
- покупка бесценных товаров;
- обработка ошибок API;


### Техническая реализация

- событийно-ориентированная архитектура;
- адаптивный UI;


## Архитектура проекта

В проекте используется архитектурный шаблон MVP (Model-View-Presenter).
Он разделяет приложение на три основных компонента:

- модель (Model) - представляет данные и бизнес-логику приложения;
- представление (View) - тображает данные пользователю и обрабатывает пользовательский ввод;
- презентер (Presenter) - правляет взаимодействием между моделью и представлением.


### Ключевые принципы

Изолированность: Каждый модуль работает независимо;
Единая ответственность: Четкое разделение на Model-View-Presenter;
Масштабируемость: Легко добавлять новые функции без изменения ядра;


## Базовые классы

### Класс Api (src/components/base/api.ts)

Реализует при работе с API: отправку запросов, получение ответов, приведение полученных данных в массив, формирование ссылок через CDN, защиту от битых ссылок;

поля:

- private readonly baseUrl - базовый адрес сервера;
- private readonly cdnUrl - ссылка на коллекцию товаров;

конструктор:

- constructor(baseUrl: string = API_URL, cdnUrl: string = CDN_URL) - инициализирует клиент API устанавливая ссылки на сервер и коллекцию товара;

методы:

- async getProducts(): Promise<Product[]> - запрашивает список товаров и возвращает обработанные данные;
- private processProducts(items: any[]): Product[] - Преобразует сырые данные API в массив объектов;
- private processImageUrl(imageUrl?: string): string - Обрабатывает URL изображения, добавляя при необходимости cdnUrl;


### Класс EventEmitter (src/components/base/events.ts)

Брокер событий, централизованная система событий (реализует паттерн "Наблюдатель").

поля:

- _events - хранит подписки на события;

конструктор:

- constructor() - инициализирует карту _events;

методы:

- on - подписка на событие;
- off - отписывает от события;
- emit - инициирует событие;
- onAll - подписывает на все события;
- offAll - сбрасывает все подписки;
- trigger - возвращает функцию, которая при вызове инициирует событие;


### Класс Component (src/components/base/Component.ts)

Базовый класс для всех UI-компонентов, реализующий общую логику работы с DOM.

поля:

- protected container(): HTMLElement - контейнер компонента;
- protected events: Record<string, (e: Event) => void> - хранилище обработчиков событий;

конструктор:

- constructor(tagName: string = 'div', className: string = '') - создает DOM-элемент;

методы:

- render(): HTMLElement - возвращает сконструированный DOM-элемент;
- protected setEvent(event: string, callback: (e: Event) => void): void - устанавливает обработчик события;
- protected removeEvent(event: string): void - удаляет обработчик события;


### Класс Model (src/components/base/Model.ts)

Базовый класс для моделей данных, обеспечивающий работу с состоянием приложения.

поля:

- protected events: EventEmitter - экземпляр EventEmitter для работы с событиями;
- protected state: IAppState - текущее состояние приложения;

методы:

- protected setState(newState: Partial<IAppState>): void - обновляет состояние;
- getState(): IAppState - возвращает текущее состояние;
- on(event: string, callback: (data: any) => void): void - подписка на события;
- off(event: string, callback: (data: any) => void): void - отписка от событий;


### Класс LarekAPI (src/components/LarekAPI.ts)

Расширяет базовый ApiClient, реализует специфичные для приложения API-запросы.

поля:

-  - ;
-  - ;

методы:

- async getProductList(): Promise<IProduct[]> - получает список товаров;
- async orderProducts(order: IOrder): Promise<IOrderResult> - отправляет заказ на сервер;


### Модели данных

Интерфейс Product (src/types/index.ts)

interface Product {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: Category;
}

Интерфейс IOrderForm (src/types/index.ts)

interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

Интерфейс IOrderData extends IOrderForm (src/types/index.ts)

interface IOrderData extends IOrderForm {
  id: string[];
  total: number;
}

Интерфейс ICartItem extends Product (src/types/index.ts)

interface ICartItem extends Product {
  quantity: number;
}

Интерфейс ICard (src/types/index.ts)

interface ICard {
  id: string;
  title: string;
  price: number | null;
  category?: Category;
  description?: string;
  image?: string;
  index?: number;
}

Интерфейс IOrderResult (src/types/index.ts)

interface IOrderResult {
  id: string;
  total: number;
}

Интерфейс IFormErrors (src/types/index.ts)

interface IFormErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

Интерфейс IModalData (src/types/index.ts)

interface IModalData {
  content: HTMLElement;
}

### UI-компоненты

Компонент	    Ответственность	               События

ProductCard	  Отображение карточки товара	   addToCart, preview;
Basket	      Управление корзиной	           checkout, removeItem;
OrderForm	    Многошаговая форма заказа	     submit, validate;
Modal	        Управление модальными окнами	 open, close;

Пример ProductCard:

class ProductCard extends Component {
  constructor(product: IProduct) {
    super();
    this.render = () => `
      <div class="card">
        <span class="card__category">${product.category}</span>
        <h3 class="card__title">${product.title}</h3>
        <div class="card__price">${product.price ?? 'Бесценно'}</div>
      </div>
    `;
  }
}

### Класс Page (src/components/Page.ts)

Управляет отображением страницы и основными DOM-элементами.

поля:

- protected basket: Basket - экземпляр корзины;
- protected modal: Modal - экземпляр модального окна

методы:

- render(): HTMLElement - рендерит основную страницу;
- setCatalog(items: IProduct[]): void - отображает каталог товаров;
- setCounter(count: number): void - обновляет счетчик товаров в корзине;

### Класс Basket (src/components/common/Basket.ts)

Управляет корзиной товаров.

поля:

- protected items: IProduct[] - товары в корзине;
- protected total: number - общая стоимость

методы:

- add(item: IProduct): void - добавляет товар в корзину;
- remove(id: string): void - удаляет товар из корзины;
- clear(): void - очищает корзину;
- getTotal(): number - возвращает общую стоимость;


### Класс Form (src/components/common/Form.ts)

Базовый класс для форм ввода данных.

поля:

- protected valid: boolean - флаг валидности формы;
- protected errors: IFormErrors - ошибки валидации;

методы:

- validate(): boolean - проверяет валидность формы;
- clear(): void - очищает форму;
- setErrors(errors: IFormErrors): void - устанавливает ошибки;

### Класс Modal (src/components/common/Modal.ts)

Управляет модальными окнами.

методы:

- open(content: HTMLElement): void - открывает модальное окно;
- close(): void - закрывает модальное окно;
- private handleClose(e: Event): void - обработчик закрытия;


## Взаимодействие компонентов

Пользователь взаимодействует с View;
View генерирует события через EventEmitter;
Presenter обрабатывает события и обновляет Model;
Model уведомляет об изменениях через EventEmitter;

### Инициализация приложения:

AppData - загружает товары через LarekAPI;
Page - отображает каталог товаров;
Basket - инициализируется пустой корзиной;

### Добавление товара в корзину:

ProductCard генерирует событие 'card:select';
AppData обновляет состояние корзины;
Page обновляет счетчик товаров;

### Оформление заказа:

Basket генерирует событие 'order:open';
OrderForm отображает форму ввода данных;
При успешном заполнении отправляет данные через LarekAPI;


## Типы данных

Тип FormField (src/types/index.ts)

type FormField = {
  name: string;
  value: string;
  valid: boolean;
  errors: string[];
}

Тип ApiListResponse (src/types/index.ts)

type ApiListResponse<Type> = {
  total: number;
  items: Type[];
}

Тип PaymentMethod (src/types/index.ts)

type PaymentMethod = 'online' | 'offline' | null;
Дополнительные утилиты (src/utils/utils.ts)

Функции:

- ensureElement<T>(element: T | null): T - проверяет что элемент существует;
- cloneTemplate<T>(template: HTMLTemplateElement): T - клонирует шаблон;
- formatNumber(value: number): string - форматирует число (цена);
- validateEmail(email: string): boolean - проверяет email;
- validatePhone(phone: string): boolean - проверяет телефон

### Основные интерфейсы

Состояние приложения:
interface IAppState {
  products: IProduct[];
  basket: IProduct[];
  order: IOrder;
  loading: boolean;
  error: string | null;
}

События:
type AppEvents = {
  'basket:changed': IProduct[];
  'order:submitted': IOrder;
  'modal:opened': { type: string };
}

### API Endpoints

Метод	  Эндпоинт	 Описание

GET	    /products	 Получение списка товаров;
POST	  /orders	   Создание заказа;

Пример запроса:

class ApiClient {
  async getProducts(): Promise<IProduct[]> {
    const response = await fetch('/products');
    return this.handleResponse(response);
  }
}


## Функциональные требования

Главная страница:

- просмотр каталога товаров;
- фильтрация по категориям;
- поиск по названию;
- модальное окно с описанием товара;

Корзина:

- добавление/удаление товаров;
- изменение количества;
- расчёт итоговой суммы;

Оформление заказа:

- ввод адреса доставки;
- выботр способа оплаты;
- подтверждение заказа;
- товар с ценой 'null' ("Бесценно");
- валидация форм ввода;

### Общие требования:

Модальные окна закрываются при клике вне модального окна, по клавише 'Esc' или по иконке «В корзину».
Кнопка перехода к следующему шагу доступна только если действия на текущей странице выполнены (например, указание телефона и почты).