export interface Product {
	id: string;
	title: string;
	price: number | null;
	description?: string;
	image?: string;
	category?: Category;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}
export interface IContactsForm {
	email: string;
	phone: string;
}
export interface IOrderData extends IOrderForm {
	items: string[];
	total: number;
}
export interface ICartItem {
	productId: string;

	price: number;
	title: string;
}
export interface ICard {
	id?: string;
	title?: string;
	price?: number;
	category?: string;
	image?: string;
	description?: string;
	index?: number;
	inCart?: boolean;
}

export type Category =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';

export interface IOrderResult {
	id: string;
	total: number;
}
export interface FormErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
	[key: string]: string;
}
