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

## 1. О проекте

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
- выбор способа оплаты;
- ввод данных;
- валидация форм заказа;
- расчёт общей стоимости;

### Техническая реализация

- MVP для разделения ответственности
- EventEmitter для связывания компонентов

## 2. Архитектура проекта

В проекте используется архитектурный шаблон MVP (Model-View-Presenter).
Он разделяет приложение на три основных компонента:

- модель (Model) - представляет данные и бизнес-логику приложения;
- представление (View) - тображает данные пользователю и обрабатывает пользовательский ввод;
- презентер (Presenter) - правляет взаимодействием между моделью и представлением.

### Ключевые принципы

Изолированность: Каждый модуль работает независимо;
Единая ответственность: Четкое разделение на Model-View-Presenter;
Масштабируемость: Легко добавлять новые функции без изменения ядра;

## 3. Базовый код

### class Api (src/components/base/api.ts)

Реализует при работе с API: отправку запросов, получение ответов, приведение полученных данных в массив.

Свойства:

- readonly baseUrl: string; // базовый адрес сервера
- protected options: RequestInit; // Настройки HTTP-запросов (заголовки, метод и т.д.)

Конструктор:

- constructor(baseUrl: string, options: RequestInit = {}) // Инициализирует базовый URL и настройки запросов

Методы:

- protected handleResponse(response: Response): Promise<object> // Обработка ответа 
- get(uri: string) // Отправляет GET-запрос по адресу baseUrl + uri
- post(uri, data, method) // Отправляет POST/PUT-запрос с телом data (сериализуемым в JSON);

### abstract class Component<T> (src/components/base/Component.ts)

Базовый абстрактный класс для всех UI-компонентов, реализующий общую логику работы с DOM.

Свойства:

- protected readonly container: HTMLElement // Корневой DOM-элемент

Конструктор:

- protected constructor(protected readonly container: HTMLElement)

Методы:

toggleClass(element: HTMLElement, className: string, force?: boolean) // Переключить класс
protected setText(element: HTMLElement, value: unknown) // Установить текстовое содержимое
setDisabled(element: HTMLElement, state: boolean) // Сменить статус блокировки
protected setHidden(element: HTMLElement) // Скрыть
protected setVisible(element: HTMLElement) // Показать
protected setImage(element: HTMLImageElement, src: string, alt?: string) // Установить изображение с альтернативным текстом
render(data?: Partial<T>): HTMLElement // Вернуть корневой DOM-элемент

### class EventEmitter implements IEvents (src/components/base/events.ts)

Брокер событий, централизованная система событий (реализует паттерн "Наблюдатель").

Cвойства:

- _events: Map<EventName, Set<Subscriber>> // хранит подписки на события

Конструктор:

- constructor() // инициализирует карту _events

Методы:

- on<T extends object>(eventName: EventName, callback: (event: T) // подписка на событие
- off(eventName: EventName, callback: Subscriber) // отписывает от события
- emit<T extends object>(eventName: string, data?: T) // инициирует событие
- onAll(callback: (event: EmitterEvent) => void) // подписывает на все события
- offAll() // сбрасывает все подписки;
- trigger<T extends object>(eventName: string, context?: Partial<T>) // возвращает функцию, которая при вызове инициирует событие

### abstract class Model<T> (src/components/base/Model.ts)

Базовый класс для моделей данных, обеспечивающий работу с состоянием приложения.

свойства:

- protected events: EventEmitter // Система событий для уведомлений об изменениях модели

конструктор:

- constructor(data: Partial<T>, protected events: IEvents) // базовый конструктор для всех моделей

методы:

- emitChanges(event: string, payload?: object) // генерирует событие event через events.emit()

## 4. Компоненты слоя View

### Класс AppData (src/components/AppData.ts)

Хранение текущего состояния (товары, корзина, заказ).

свойства:

- private _products: ;
- private _cart: ;
- private _order: ;
- private _preview: ;

методы:

- loadProducts() - загрузка товаров с сервера;
- updateBasket() - обновление состояния корзины;
- submitOrder() - оформление заказа;

### Класс Card (src/components/Card.ts)

Управляет отображением товара, обрабатывает взаимодействия, интегрируется с API.

свойства:

- _title - Заголовок карточки;
- _image - Изображение товара;
- _price - Цена товара;
- _category - Категория товара;
- _button - Кнопка действия;
- _index - Индекс товара в корзине;

конструктор:

- constructor(container: HTMLElement, actions?: ICardActions) - Инициализирует DOM-элементы карточки;

геттер:

- get containerElement() - Возвращает корневой DOM-элемент карточки;

сеттеры:

- set id(value) - Устанавливает data-id для контейнера;
- set title(value) - Обновляет текст в _title;
- set price(value) - Форматирует цену (например, "100 синапсов");
- set category(value) - Устанавливает текст и CSS-класс для категории (например, card__category_soft);
- set image(value) - Меняет src и alt у изображения;
- set index(value) - Обновляет индекс товара в корзине;

### Класс LarekAPI (src/components/LarekAPI.ts)

Расширяет базовый ApiClient, формирование ссылок через CDN.

конструктор:

- constructor(baseUrl: string, protected cdnUrl: string);

методы:

- async getProductList(): Promise<IProduct[]> - получает список товаров;
- async orderProducts(order: IOrder): Promise<IOrderResult> - отправляет заказ на сервер;

### Класс Order (src/components/Order.ts)

Управляет формой заказа, генерирует события, интегрируется с системой событий.

конструктор:

- constructor(container: HTMLElement, events: IEvents) - Инициализирует форму заказа и настраивает обработчик отправки.

свойства:

- _button - Кнопка отправки формы (например, «Оформить заказ»);
- _errors - Контейнер для отображения ошибок валидации;
- events - Объект для работы с событиями (например, EventEmitter);

геттер:

- get containerElement() - возвращает корневой DOM-элемент формы;

сеттеры:

- set valid(value) - блокирует/разблокирует кнопку (!value → кнопка неактивна);
- set address(value) - устанавливает значение поля «Адрес» в форме;
- set errors(value) - отображает текст ошибок в контейнере _errors;

### Класс Page (src/components/Page.ts)

Управляет отображением страницы и основными DOM-элементами.

свойства:

- protected basket: Basket - экземпляр корзины;
- protected modal: Modal - экземпляр модального окна;

методы:

- render(): HTMLElement - рендерит основную страницу;
- setCatalog(items: IProduct[]): void - отображает каталог товаров;
- setCounter(count: number): void - обновляет счетчик товаров в корзине;

### Класс Basket (src/components/common/Basket.ts)

Управляет корзиной товаров.

свойства:

- protected items: IProduct[] - товары в корзине;
- protected total: number - общая стоимость

методы:

- add(item: IProduct): void - добавляет товар в корзину;
- remove(id: string): void - удаляет товар из корзины;
- clear(): void - очищает корзину;
- getTotal(): number - возвращает общую стоимость;

### Класс Form (src/components/common/Form.ts)

Базовый класс для форм ввода данных.

свойства:

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

### Класс Success (src/components/common/Modal.ts)

Реализует окно с подтверждением заказа.

свойства:

- _close - элемент кнопки закрытия окна;
- _total - элемент с суммой заказа;

сеттер:

- total - меняет содержимое элемента с суммой заказа;

### Интерфейсы (src/types/index.ts)

- interface Product;
- interface IOrderForm;
- interface IOrderData extends IOrderForm;
- interface ICartItem extends Product;
- interface ICard;
- interface IOrderResult;
- interface IFormErrors;
- interface IModalData;

## Поток данных

### Инициализация

- Page -> (запрос) -> LarekAPI -> (ответ) -> AppData;
- AppData обновляет состояние -> Page отображает товары;

### Добавление в корзину

- ProductCard (click) -> EventEmitter -> AppData;
- AppData обновляет cart -> Basket (через EventEmitter);

### Оформление заказа

- OrderForm (submit) -> EventEmitter -> AppData;
- AppData -> LarekAPI -> Success/Error;

## Взаимодействие компонентов

Пользователь взаимодействует с View;
View генерирует события через EventEmitter;
Presenter обрабатывает события и обновляет Model;
Model уведомляет об изменениях через EventEmitter;

### Инициализация приложения

AppData - загружает товары через LarekAPI;
Page - отображает каталог товаров;
Basket - инициализируется пустой корзиной;

### Добавление товара в корзину

ProductCard генерирует событие 'card:select';
AppData обновляет состояние корзины;
Page обновляет счетчик товаров;

### Оформление заказa

Basket генерирует событие 'order:open';
OrderForm отображает форму ввода данных;
При успешном заполнении отправляет данные через LarekAPI;

## API взаимодействие с сервером

| Метод    | Эндпоинт         | Описание                                                      |
|----------|------------------|---------------------------------------------------------------|
| `GET`    | `/products`      | Получает список всех товаров. Возвращает `Product[]`.         |
| `GET`    | `/product/{id}`  | Получение детальной информации о конкретном товаре `Product`. |
| `POST`   | `/orders`        | Создает новый заказ. Требует все поля из `IOrderData`.        |

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
- выбор способа оплаты;
- подтверждение заказа;
- товар с ценой 'null' ("Бесценно");
- валидация форм ввода;

### Общие требования

Модальные окна закрываются при клике вне модального окна, по клавише 'Esc' или по иконке «В корзину».
Кнопка перехода к следующему шагу доступна только если действия на текущей странице выполнены (например, указание телефона и почты).
