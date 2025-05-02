import { Category } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  defaultImage: '/images/placeholder.svg',
  productImageSize: '300x300'
};

export const categoryClasses: Record<Category, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'дополнительное': 'additional',
  'кнопка': 'button',
  'другое': 'other'
};