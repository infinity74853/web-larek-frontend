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

- protected constructor(protected readonly container: HTMLElement) {} // Принимает корневой элемент компонента.

Методы:

- getContainer(): HTMLElement // Возвращает корневой DOM-элемент компонента
- render(data?: Partial<T>): HTMLElement // Обновляет данные компонента и возвращает DOM-элемент

Управление классами:

- addClass(className: string): this // Добавляет CSS-класс к контейнеру
- removeClass(className: string): this // Удаляет CSS-класс у контейнера
- toggleClass(className: string, force?: boolean): this // Переключает CSS-класс

Вспомогательные методы:

- setText(element: HTMLElement, value: unknown): void // Устанавливает текстовое содержимое элемента
- setDisabled(element: HTMLElement, state: boolean): void // Управляет атрибутом disabled элемента
- setHidden(element: HTMLElement): void // Скрывает элемент через display: none
- setVisible(element: HTMLElement): void // Показывает элемент через display: unset
- setImage(element: HTMLImageElement, src: string, alt?: string): void // Устанавливает src и alt для изображения

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

- private _products: Product[] // Каталог товаров
- private _cart: ICartItem[] // Товары в корзине
- private _order: IOrderData | null // Данные текущего заказа
- private _formErrors: FormErrors // Ошибки валидации форм

Конструктор:

- constructor(events: IEvents) // Принимает шину событий для уведомлений

Методы:

  `Управление данными:`

- setCatalog(products: Product[]) // Обновляет каталог и триггерит событие catalog:changed
- initOrder() // Инициализирует заказ с текущей корзиной
- clearCart() // Полностью очищает корзину
- clearOrder() // Сбрасывает все поля заказа через updateOrderField

  `работа с корзиной:`

- addToCart(product: Product)  // Добавляет товар в корзину
- removeFromCart(id: string, event?: Event)  // Удаляет товар из корзины
- isInCart(id) // Проверяет наличие товара в корзине
- getCartTotal() // Суммирует стоимость корзины

  `Валидация:`

validateForm() // Проверяет корректность:

- - Адрес (мин. длина)

- - Email (регулярка)

- - Телефон (регулярка)

- - Способ оплаты

- - Триггерит событие formErrors:change

  `Геттеры:`

- products/cart/order/formErrors // Получение текущих данных

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

- protected _title: HTMLElement // Заголовок корзины
- protected _list: HTMLElement // Контейнер для списка товаров
- protected _total: HTMLElement // Элемент с общей суммой
- protected _button: HTMLButtonElement // Кнопка оформления заказа
- protected events: IEvents // Система событий

Конструктор:

- constructor(container: HTMLElement, protected events: EventEmitter)

Методы:

- private initialize(): void // Настраивает обработчик клика на кнопке (эмитит событие order:start)
- updateBasket(items: HTMLElement[], total: number)  // Метод для обновления корзины
- private setTotal(value: number): void // Форматирует и устанавливает общую сумму (с валютой)
- private toggleButton(disabled: boolean): void // Блокирует/разблокирует кнопку оформления

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

- protected _closeButton: HTMLButtonElement // Кнопка закрытия модалки
- protected _content: HTMLElement // Контейнер для контента
- private _handleKeyDown: (event: KeyboardEvent) => void // Обработчик клавиши Escape
- protected events: IEvents // Шина событий

Конструктор:

- constructor(container: HTMLElement)  // Rорневой DOM-элемент модального окна

Методы:

- set content(value: HTMLElement): void // Сеттер для полной замены содержимого
- open(content?: HTMLElement): void // Открывает модалку
- close(): void // Закрывает модалку
- private isActive(): boolean // Проверяет активность модалки

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

- protected _close: HTMLElement // Кнопка закрытия уведомления
- private _descriptionElement: HTMLElement // Поле для отображения суммы списания
- actions: ISuccessActions // Колбэк для обработки закрытия

Конструктор:

- constructor(container: HTMLElement, actions: ISuccessActions)  // Отображения сообщений об успешном выполнении операций

Методы:

- set total(value: number) // Сеттер для обновления текста с суммой списания
- getContainer(): HTMLElement // Переопределение метода базового класса (возвращает контейнер)

```
interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onPreview?: () => void;
}
```

### class Card extends Component`<ICard>` `(src/components/Card.ts)`

Компонент карточки товара (каталог/превью/корзина).

Свойства:

- protected _title: HTMLElement // Заголовок товара
- protected _image: HTMLImageElement // Изображение товара
- protected _price: HTMLElement // Цена
- protected _description?: HTMLElement // Описание (опционально)
- protected _category?: HTMLElement // Категория (опционально)
- protected _button?: HTMLButtonElement // Кнопка действий (добавить/удалить)
- protected _index: HTMLElement // Нумерация в корзине

Конструктор:

- constructor(container: HTMLElement, actions?: ICardActions) // Принимает контейнер и обработчики событий.

Методы:

- render(data: ICard & { inCart?: boolean }) // Рендер с учётом статуса в корзине
- updateButtonState(inCart: boolean, price: number | null) // Обновляет состояние кнопки
- id(value: string) // Устанавливает data-id контейнера
- title/description/price/category/image // Управляют содержимым соответствующих элементов
- index(value: number) // Номер позиции в корзине

### class Order extends Component`<IOrderForm>` `(src/components/Order.ts)`

Управляет формой заказа, генерирует события, интегрируется с системой событий

Свойства:

- protected _paymentCard: HTMLButtonElement // Кнопка "Онлайн" (картой)
- protected _paymentCash: HTMLButtonElement // Кнопка "При получении" (наличными)
- protected _addressInput: HTMLInputElement // Поле ввода адреса
- protected events: IEvents // Шина событий
- protected appData: AppData // Модель данных приложения

Конструктор:

- constructor(container: HTMLFormElement, events: IEvents, appData: AppData)  // Инициализирует форму заказа

Методы:

- resetPayment(): void // Сбрасывает визуальное состояние кнопок оплаты
- reset(): void // Полный сброс формы (платежи + адрес + ошибки)
- address(value: string) // Устанавливает значение поля адреса
- validateAddress(value: string): boolean // Проверяет минимальную длину адреса
- handlePaymentChange(method): void // Обрабатывает выбор способа оплаты
- updateForm(): void // Проверяет валидность и показывает ошибки
- handleSubmit(e): void // Отправляет данные формы

### Contacts (src/components/Contacts.ts)

Форма ввода контактных данных (email, телефон).

Свойства:

- protected _emailInput: HTMLInputElement // Поле ввода email
- protected _phoneInput: HTMLInputElement // Поле ввода телефона
- protected events: IEvents // Шина событий

Конструктор:

- constructor(container: HTMLFormElement, events: IEvents)

Методы:

- reset(): void // Сбрасывает форму и очищает ошибки
- set email(value: string) // Устанавливает email
- set phone(value: string) // Устанавливает телефон
- handleSubmit(e): void // Отправляет данные при валидной форме
- initEventListeners(): void // Настраивает обработчики изменений

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

- private basketCounter: HTMLElement // Элемент счетчика товаров в корзине
- private appContainer: HTMLElement // Корневой контейнер приложения

Конструктор:

- constructor(events: IEvents, appContainer: HTMLElement)  // Инициализирует элементы DOM

Методы:

- renderCatalog(cards: HTMLElement[]): void // Полная перерисовка каталога
- updateBasketCounter(count: number): void // Обновляет числовое значение счетчика корзины


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
| `contacts:submit` - тправка контактных данных                     |
| `order:complete` - Успешное завершение заказа                     |
| `modal:open / modal:close` - Открытие/закрытие модальных окон     |

| События MODEL                                                     |
| ------------------------------------------------------------------|
| `catalog:changed` - обновление списка товаров в каталоге          |  
| `cart:changed` - изменилось содержимое корзины                    |
| `order:change` - обновление данных заказа                         |
| `formErrors:change` - изменение ошибок валидации форм             |
| `order:штше` - инициализация нового заказа                        |

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
