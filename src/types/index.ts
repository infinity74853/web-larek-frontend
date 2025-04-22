export interface Product {
    id: string;
    title: string;
    price: number | null;
    description?: string;
    image?: string;
    category?: Category;
}

export interface OrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface OrderData extends OrderForm {
    items: string[];
    total: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export const categories = ['софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка'] as const;
export type Category = typeof categories[number];