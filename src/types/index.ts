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

export interface IOrderData extends IOrderForm {
    items: string[];
    total: number;
}

export interface ICartItem extends Product {
    quantity: number;
}

export interface ICard {
    id: string;
    title: string;
    price: number | null;
    category?: Category;
    description?: string;
    image?: string;
    index?: number;
}

export const categories = ['софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка'] as const;
export type Category = typeof categories[number];