import { Category } from '../types';

// Константы получения данных
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	// Изображения
	defaultImage: '/images/placeholder.svg',
	productImageSize: '300x300',

	// Валидация формы заказа
	validation: {
		minAddressLength: 6,
		phonePattern: /^(\+7|8)\d{10}$/,
		emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	},

	// CSS-классы
	classes: {
		// Карточки товаров
		card: {
			base: 'card',
			preview: 'card_preview',
			basketItem: 'card_basket-item',
			category: 'card__category',
			categoryPrefix: 'card__category_',
		},

		// Модальные окна
		modal: {
			active: 'modal_active',
			closeButton: 'modal__close',
			title: 'modal__title',
		},

		// Формы
		form: {
			inputInvalid: 'form__input_invalid',
		},

		// Кнопки
		button: {
			active: 'button_alt-active',
		},
	},

	// Сообщения об ошибках
	errorMessages: {
		order: {
			payment: 'Выберите способ оплаты',
			addressRequired: 'Укажите адрес',
			addressInvalid: 'Укажите настоящий адрес',
			notInitialized: 'Order not initialized',
		},

		contacts: {
			emailRequired: 'Необходимо указать email',
			emailInvalid: 'Некорректный email',
			phoneRequired: 'Необходимо указать телефон',
			phoneInvalid: 'Некорректный формат номера',
		},

		common: {
			requiredFields: 'Укажите настоящий адрес',
			serverError: 'Ошибка соединения с сервером',
			validationError: 'Необходимо указать телефон; Необходимо указать email',
		},
	},

	// Текстовые константы
	labels: {
		addToCart: 'Купить',
		inCart: 'Уже в корзине',
		total: 'Итого:',
		checkout: 'Оформить заказ',
		notForSale: 'Не продаётся',
		currency: 'синапсов',
		priceless: 'Бесценно',
		cartList: 'Корзина',
		deleteFromCart: '',
	},
};

export const categoryClasses: Record<Category, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	дополнительное: 'additional',
	кнопка: 'button',
	другое: 'other',
};
