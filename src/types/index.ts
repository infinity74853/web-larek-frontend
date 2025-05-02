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
    id: string;
    productId: string;
    quantity: number;
    price: number;
    title: string;
}
export interface ICard {
    id?: string;
    title: string;
    price: number | null;
    category?: Category;
    description?: string;
    image?: string;
    index?: number;
    productId?: string;
}

export type Category = 
  'софт-скил' | 
  'хард-скил' | 
  'дополнительное' | 
  'кнопка' | 
  'другое';
