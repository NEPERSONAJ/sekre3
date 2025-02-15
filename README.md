# Telegram Web App с ИИ генерацией

Веб-приложение для Telegram с функциями генерации изображений и текста с помощью ИИ.

## Требования для установки

- Node.js (версия 16.x или выше)
- npm (версия 8.x или выше)
- Ubuntu 24.04 LTS (для production)

## Установка на Ubuntu 24.04

1. Обновите систему:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Установите Node.js и npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Установите Git:
```bash
sudo apt install git -y
```

4. Клонируйте репозиторий:
```bash
git clone [ваш-репозиторий]
cd tg-ai-webapp
```

5. Установите зависимости:
```bash
npm install
```

6. Создайте файл с переменными окружения:
```bash
cat > .env << EOL
REACT_APP_TG_BOT_TOKEN=7833854716:AAHGj6j-cH9VcIzLostbHxibV_pjR2gogkE
REACT_APP_ADMIN_ID=1728766965
REACT_APP_TYPEGPT_API_KEY=sk-K8UFZvz7K59xvk8EoUfF0fC9x8Op4QbTP1HFcDost0qMi1Y0
REACT_APP_API_URL=https://api.typegpt.net/v1
EOL
```

7. Соберите проект:
```bash
npm run build
```

8. Установите и настройте nginx:
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/tg-ai-webapp
```

9. Добавьте конфигурацию nginx:
```nginx
server {
    listen 80;
    server_name ваш-домен.com;
    root /var/www/tg-ai-webapp/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

10. Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/tg-ai-webapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. Установите SSL с помощью Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ваш-домен.com
```

## Разработка

1. Запуск в режиме разработки:
```bash
npm start
```

2. Сборка для production:
```bash
npm run build
```

## Функционал

- Генерация изображений с помощью модели flux
- Генерация текста с помощью модели gpt-4o
- Система подписок и ограничений
- Защита от флуда
- Анимации и современный UI

## Переменные окружения

- `REACT_APP_TG_BOT_TOKEN` - токен Telegram бота
- `REACT_APP_ADMIN_ID` - ID администратора
- `REACT_APP_TYPEGPT_API_KEY` - API ключ для TypeGPT
- `REACT_APP_API_URL` - базовый URL API

## Безопасность

- Все API ключи хранятся в переменных окружения
- Реализована защита от флуда
- Проверка подписок и ограничений
- SSL шифрование для production
