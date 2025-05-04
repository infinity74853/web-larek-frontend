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

### Установка и запуск

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

### Сборка

```
npm run build
```

или

```
yarn build

```

## 1. О проекте

Проект представляет собой приложение интернет-магазин для продажи цифровых товаров,
реализованное на TypeScript с использованием ООП-подхода и архитектуры MVP.

### Бизнес логика

Главная страница:

- просмотр каталога товаров;
- фильтрация по категориям;
- модальное окно с описанием товара и кнопкой добавления в корзину;

Корзина:

- удаление товаров;
- изменение количества;
- расчёт итоговой суммы;
- кнопка для перехода к оформлению;

оформление заказа:

- выбор способа оплаты;
- ввод адреса доставки;
- валидация форм ввода;
- переход к вводу контактных данных;

подтверждение заказа:

- валидация ввода контактных данных;
- успешное оформление заказа;

### Общие требования

Модальные окна закрываются при клике вне модального окна, по клавише 'Esc' или по иконке «В корзину».
Кнопка перехода к следующему шагу доступна только если действия на текущей странице выполнены
(например, указан адрес доставки, способ оплаты, указание телефона и почты).

### Техническая реализация

- MVP для разделения ответственности
- EventEmitter для связывания компонентов

## 2. Архитектура проекта

В проекте используется архитектурный шаблон MVP (Model-View-Presenter).
Он разделяет приложение на три основных компонента:

- модель (Model) - представляет данные и бизнес-логику приложения;
- представление (View) - отображает данные пользователю и обрабатывает пользовательский ввод;
- презентер (Presenter) - управляет взаимодействием между моделью и представлением.

### Ключевые принципы

Изолированность: Каждый модуль работает независимо;
Единая ответственность: Четкое разделение на Model-View-Presenter;
Масштабируемость: Легко добавлять новые функции без изменения ядра;
Презентер отвечает за взаимодействие компонентов через брокер событий.

## 3. Базовый код

### class Api `(src/components/base/api.ts)`

Реализует при работе с API: отправку запросов, получение ответов, приведение полученных данных в массив.

Свойства:

- readonly baseUrl: string;  // базовый адрес сервера
- protected options: RequestInit;  // Настройки HTTP-запросов (заголовки, метод и т.д.)

Конструктор:

- constructor(baseUrl: string, options: RequestInit = {})  // Инициализирует базовый URL и настройки запросов

Методы:

- protected handleResponse(response: Response): Promise`<object>`  // Обработка ответа
- get(uri: string)  // Отправляет GET-запрос по адресу baseUrl + uri
- post(uri, data, method)  // Отправляет POST/PUT-запрос с телом data (сериализуемым в JSON);

### abstract class Component`<T>` `(src/components/base/Component.ts)`

Базовый абстрактный класс для создания UI-компонентов с общими методами работы с DOM.

Свойства:

- container: HTMLElement // Корневой DOM-элемент компонента.

Конструктор:

- constructor(container: HTMLElement) // Принимает корневой элемент компонента.

Методы:

- render(data?: Partial`<T>`): HTMLElement // Обновляет данные компонента и возвращает контейнер.
- setText(selector: string, value: string): void // Устанавливает текст для элемента внутри компонента.
- setImage(selector: string, src: string, alt?: string): void // Обновляет изображение.

```
interface IEvents {
    on`<T extends object>`(event: EventName, callback: (data: T) => void): void;
    emit`<T extends object>`(event: string, data?: T): void;
    trigger`<T extends object>`(event: string, context?: Partial`<T>`): (data: T) => void;
}
```

### class EventEmitter implements IEvents `(src/components/base/events.ts)`

Брокер событий, централизованная система событий (реализует паттерн "Наблюдатель").

Cвойства:

- _events: Map`<EventName, Set<Subscriber>>`  // Хранит подписки на события

Конструктор:

- constructor()  // Инициализирует карту _events

Методы:

- on`<T extends object>`(eventName: EventName, callback: (event: T))  // Установить обработчик на событие
- off(eventName: EventName, callback: Subscriber)  // Снять обработчик с события
- emit`<T extends object>`(eventName: string, data?: T)  // Инициировать событие с данными
- onAll(callback: (event: EmitterEvent) => void)  // Слушать все события
- offAll() // Сбросить все обработчики
- trigger`<T extends object>`(eventName: string, context?: Partial`<T>`)  // Сделать коллбек триггер, генерирующий событие при вызове

### abstract class Model`<T>` `(src/components/base/Model.ts)`

Базовый класс для моделей данных, обеспечивающий работу с состоянием приложения.

Свойства:

- protected events: EventEmitter  // Система событий для уведомлений об изменениях модели

Конструктор:

- constructor(data: Partial`<T>`, protected events: IEvents)  // Базовый конструктор для всех моделей

Методы:

- emitChanges(event: string, payload?: object)  // Генерирует событие event через events.emit()

## 4. Компоненты слоя MODEL

### class AppData extends EventEmitter `(src/components/AppData.ts)`

Хранение текущего состояния (товары, корзина, заказ).

Свойства:

- _products: Product[]  // Массив товаров в каталоге
- _cart: ICartItem[]  // Массив товаров в корзине
- _order: IOrderData | null  // Данные текущего заказа

Конструктор:

- constructor(previewTemplate: HTMLTemplateElement, protected events: IEvents)  // Хранит, изменяет и валидирует данные приложения

Методы:

  `работа с каталогом:`

- setCatalog(products: Product[]) // Устанавливает список товаров
- get products()  // Возвращает текущий список товаров

  `работа с корзиной:`

- addToCart(product: Product)  // Добавляет товар в корзину
- removeFromCart(id: string, event?: Event)  // Удаляет товар из корзины
- clearCart()  // Очищает корзину
- get cart()  // Возвращает текущее содержимое корзины
- getCartTotal()  // Вычисляет общую сумму корзины

  `работа с заказом:`

- initOrder()  // Инициализирует заказ на основе корзины
- updateOrder`(data: Partial<IOrderData>)`  // Обновляет данные заказа
- get order()  // Возвращает текущие данные заказа

  `работа с превью товара:`

- openProductPreview(product: Product)  // Открывает превью товара
- setPreview(product: Product)  // Устанавливает товар для превью
- get preview()  // Возвращает текущий товар для превью

## 5. Компоненты слоя VIEW

```
interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```

### class Basket extends Component`<IBasketView>` `(src/components/common/Basket.ts)`

Компонент корзины с товарами.

Свойства:

- _list: HTMLElement // Список товаров в корзине.
- _total: HTMLElement // Итоговая сумма.

Конструктор:

- constructor(container: HTMLElement, events: IEvents, appData: AppData, template: HTMLTemplateElement)

Методы:

- render(): HTMLElement // Отрисовывает корзину с актуальными данными.
- updateTotal(total: number): void // Обновляет итоговую сумму.

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

### class Form`<T>` extends Component`<IFormState>` `(src/components/common/Form.ts)`

Реализует универсальную логику работы с формами, поддерживая строгую типизацию полей через generic-параметр T

Свойства:

- protected _submit: HTMLButtonElement  // Кнопка отправки формы
- rotected _errors: HTMLElement  // Контейнер для вывода ошибок
- protected container: HTMLFormElement  // Корневой элемент формы
- protected events: IEvents  // Система событий (EventEmitter)

Конструктор:

- constructor(protected container: HTMLFormElement, protected events: IEvents)

Методы:

- protected onInputChange(field: keyof T, value: string)  // Эмитит событие изменения поля
- render(state: Partial`<T>` & IFormState)  // Обновляет состояние формы

Сеттер:

- set valid(value: boolean)  // Блокирует/разблокирует кнопку отправки
- set errors(value: string)  // Устанавливает ошибки

```
interface IModalData {
    content: HTMLElement;
}
```

### class Modal extends Component`<IModalData>` `(src/components/common/Modal.ts)`

Управляет модальными окнами.

Свойства:

- protected _closeButton: HTMLButtonElement  // Кнопка закрытия модального окна
- protected _content: HTMLElement  // Контейнер для содержимого модалки
- private _isOpened: boolean  // Флаг состояния (открыто/закрыто)

Конструктор:

- constructor(container: HTMLElement)  // Rорневой DOM-элемент модального окна

Методы:

- setProductData(product: Product): void  // Данные продукта
- open()  // Открывает модальное окно, если оно не открыто
- close()  // Закрывает модальное окно, если оно открыто

Сеттер:

- set content(value: HTMLElement)  // Обновляет содержимое модального окна

```
interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}
```

### class Success extends Component`<ISuccess>` `(src/components/common/Success.ts)`

Реализует окно с подтверждением заказа.

Свойства:

- protected _close: HTMLElement;  // Элемент кнопки закрытия окна

Конструктор:

- constructor(container: HTMLElement, actions: ISuccessActions)  // Отображения сообщений об успешном выполнении операций

```
interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onPreview?: () => void;
}
```

### class Card extends Component`<ICard>` `(src/components/Card.ts)`

Компонент карточки товара (каталог/превью/корзина).

Свойства:

- _title: HTMLElement // Заголовок товара.
- _price: HTMLElement // Цена товара.
- _button?: HTMLButtonElement // Кнопка "В корзину" или удаления.

Конструктор:

- constructor(container: HTMLElement, actions?: ICardActions) // Принимает контейнер и обработчики событий.

Методы:

- set price(value: number | null) // Обновляет цену и состояние кнопки.
- set inCart(value: boolean) // Меняет состояние кнопки при добавлении в корзину.

### class Order extends Component`<IOrderForm>` `(src/components/Order.ts)`

Управляет формой заказа, генерирует события, интегрируется с системой событий.

Конструктор:

- constructor(container: HTMLFormElement, protected events: EventEmitter)  // Инициализирует форму заказа и настраивает обработчик отправки

Свойства:

- _paymentButtons: HTMLButtonElement[] // Кнопки выбора способа оплаты.
- _addressInput: HTMLInputElement // Поле ввода адреса.

Метод:

- togglePayment(payment: string | null)  // Переключает активное состояние кнопок оплаты

Геттер:

- get containerElement()  // Возвращает корневой DOM-элемент формы

Сеттеры:

- set address(value: string)  // Устанавливает значение поля адреса
- set payment(value: string)  // Устанавливает активный способ оплаты
- resetPayment(): void // Сбрасывает выбор оплаты.
- updateForm(): void // Валидирует форму.
- set errors(value: string)  // Устанавливает текст ошибок
- set valid(value: boolean)  // Управляет состоянием кнопки отправки (активна/неактивна)

### Contacts (src/components/Contacts.ts)

Форма ввода контактных данных (email, телефон).

Свойства:

- _emailInput: HTMLInputElement
- _phoneInput: HTMLInputElement

Конструктор:

- onstructor(container: HTMLFormElement, events: IEvents)

Методы:

- validateEmail(): boolean  // Валидация адреса электронной почты
- validatePhone(): boolean  // Валидация номера телефона

```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

### class Page extends Component`<IPage>` `(src/components/Page.ts)`

Управляет отображением страницы и основными DOM-элементами.

Свойства:

- protected _counter: HTMLElement  // Элемент для отображения счетчика товаров в корзине
- protected _catalog: HTMLElement  // Контейнер для элементов каталога
- protected _wrapper: HTMLElement  // Обертка страницы
- protected _basket: HTMLElement  // Элемент корзины

Конструктор:

- constructor(appData: AppData, events: IEvents, template: HTMLTemplateElement, container: HTMLElement)  // Инициализирует элементы DOM

Методы:

- render(): void // Отрисовывает каталог товаров.

Сеттеры:

- set counter(value: number)  // Устанавливает значение счетчика корзины
- set catalog(items: HTMLElement[])  // Обновляет содержимое каталога

## 6. PRESENTER `(src/index.ts)`

Отвечает за взаимодействие компонентов через брокер событий EventEmitter.

### События

| События VIEW                                                      |
| ------------------------------------------------------------------|
| `preview:open` - пользователь открывает карточку товара           |
| `product:add` - пользователь добавляет товар в корзину            |
| `basket:open` - пользователь открывает корзину                    |
| `basket:remove` - пользователь удаляет товар из корзины           |
| `order:start` - пользователь начинает оформление заказа           |
| `contacts:open` - пользователь переходит к вводу контактных данных|
| `modal:open / modal:close` - Открытие/закрытие модальных окон     |

| События MODEL                                                     |
| ------------------------------------------------------------------|
| `cart:changed` - изменилось содержимое корзины                    |
| `order:submit` - пользователь подтвердил способ оплаты и адрес    |
| `contacts:submit` - пользователь подтвердил контактные данные     |
| `order:complete` - заказ успешно оформлен                         |

### Cхема взаимодействия

|Пользователь (VIEW)       |          Данные (MODEL)                       |
|--------------------------|-----------------------------------------------|
|Клик → `preview:open`     | → Модель получает данные товара               |
|Клик → `product:add`      | → Модель обновляет корзину → `cart:changed`   |
|Клик → `basket:remove`    | → Модель обновляет корзину → `cart:changed`   |
|Клик → `order:start`      | → Модель инициализирует заказ                 |
|Клик → `order:submit`     | → Модель сохраняет оплату и адрес             |
|Клик → `contacts:submit`  | → Модель сохраняет контакты → `order:complete`|

## 7. Сервисы

### class LarekAPI extends Api `(src/components/LarekAPI.ts)`

Наследуется от базового класса Api.

Конструктор:

- constructor(baseUrl: string, protected cdnUrl: string)  //Вызывает конструктор родительского класса Api с baseUrl

Методы:

- async getProductList(): Promise`<IProduct[]>`  // Получает список товаров
- async createOrder(order: IOrderData): Promise`<{ id: string }>`  // Отправляет заказ на сервер

## 8. API взаимодействие с сервером

| Метод    | Эндпоинт         | Описание                                                      |
|----------|------------------|---------------------------------------------------------------|
| `GET`    | `/products`      | Получает список всех товаров. Возвращает `Product[]`.         |
| `GET`    | `/product/{id}`  | Получение детальной информации о конкретном товаре `Product`. |
| `POST`   | `/order`         | Объект с данными заказа (способ оплаты, адрес, email,         |
|          |                  | телефон,список товаров, сумма). `IOrderData`.                 |

### Типы данных для взаимодействия с сервером

#### Данные Товара

- id: string;
- title: string;
- price: number | null;
- category?: Category;
- description?: string;
- image?: string;
- index?: number;

#### Данные для оформления заказа

- payment: string;
- address: string;
- email: string;
- phone: string;
