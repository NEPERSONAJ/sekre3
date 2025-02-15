export interface User {
  id: number;
  username?: string;
  isSubscribed: boolean;
  subscriptionEndDate?: Date;
  dailyImageLimit: number;
  dailyTextLimit: number;
  usedImageToday: number;
  usedTextToday: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // в месяцах
  features: string[];
  imageLimit: number; // -1 для безлимита
  textLimit: number; // -1 для безлимита
}

export interface ImageGenerationResponse {
  url: string;
  status: 'success' | 'error';
  error?: string;
}

export interface TextGenerationResponse {
  text: string;
  status: 'success' | 'error';
  error?: string;
}
