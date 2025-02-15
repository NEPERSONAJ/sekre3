require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = process.env.REACT_APP_TG_BOT_TOKEN || '7833854716:AAHGj6j-cH9VcIzLostbHxibV_pjR2gogkE';
const webAppUrl = process.env.WEBAPP_URL || 'https://chatgpti.ru';

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать в ChatGPTi! Нажмите кнопку ниже, чтобы открыть приложение:', {
    reply_markup: {
      keyboard: [[{
        text: 'Открыть ChatGPTi',
        web_app: { url: webAppUrl }
      }]],
      resize_keyboard: true
    }
  });
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Запуск Express сервера
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server is running on port ${PORT}`);
  console.log(`Web App URL: ${webAppUrl}`);
  console.log('Bot is running...');
  console.log('=================================');
});
