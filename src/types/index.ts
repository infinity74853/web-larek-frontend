 export interface Product {
    id: string;
    title: string;
    price: number | null;
    description?: string;
    image?: string;
    category?: string; 
}

export const categories = ['софт-скил', 'хард-скил', 'другое', 'дополнительное', 'кнопка'] as const;
export type Category = typeof categories[number];