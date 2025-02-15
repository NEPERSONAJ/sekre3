import axios from 'axios';
import { ImageGenerationResponse, TextGenerationResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_TYPEGPT_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Обработка превышения лимита запросов
      throw new Error('Превышен лимит запросов. Пожалуйста, подождите немного.');
    }
    throw error;
  }
);

export const generateImage = async (prompt: string): Promise<ImageGenerationResponse> => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'flux',
      messages: [{
        role: 'user',
        content: prompt
      }],
      image: true
    });
    
    // Проверяем наличие ID в ответе
    const imageId = response.data.id;
    if (!imageId || response.data.choices[0]?.finish_reason === 'error') {
      throw new Error(response.data.choices[0]?.message?.content || 'Ошибка генерации изображения');
    }

    const imageUrl = `https://cdn.snapzion.com/a1aa/image/${imageId}.jpeg`;
    
    return {
      url: imageUrl,
      status: 'success',
    };
  } catch (error: any) {
    return {
      url: '',
      status: 'error',
      error: error.message,
    };
  }
};

export const generateText = async (prompt: string): Promise<TextGenerationResponse> => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    return {
      text: response.data.choices[0].message.content,
      status: 'success',
    };
  } catch (error: any) {
    return {
      text: '',
      status: 'error',
      error: error.message,
    };
  }
};

// Telegram WebApp API
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void;
        MainButton: {
          text: string;
          show(): void;
          hide(): void;
          onClick(fn: () => void): void;
        };
        onEvent(eventType: string, eventHandler: () => void): void;
        sendData(data: string): void;
      };
    };
  }
}

export const initTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
  }
};

export const showMainButton = (text: string, onClick: () => void) => {
  if (window.Telegram?.WebApp?.MainButton) {
    window.Telegram.WebApp.MainButton.text = text;
    window.Telegram.WebApp.MainButton.onClick(onClick);
    window.Telegram.WebApp.MainButton.show();
  }
};

export const hideMainButton = () => {
  if (window.Telegram?.WebApp?.MainButton) {
    window.Telegram.WebApp.MainButton.hide();
  }
};
