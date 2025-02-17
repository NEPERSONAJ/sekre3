require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const token = process.env.REACT_APP_TG_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;
const requiredChannels = [
    process.env.REQUIRED_CHANNEL_1 || '@chatgptiru',
    process.env.REQUIRED_CHANNEL_2 || '@GPTinsider'
];

const bot = new TelegramBot(token, { polling: true });
const app = express();

// Логирование ошибок сервера
app.on('error', (error) => {
    console.error('Server error:', error);
});

app.use(express.json());
app.use(cors());

// Расширенное логирование запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    if (req.method === 'POST') {
        console.log('Body:', req.body);
    }
    next();
});

// Логирование путей
console.log('Current directory:', __dirname);
console.log('Build path:', path.join(__dirname, 'build'));
console.log('Index path:', path.join(__dirname, 'build', 'index.html'));

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'build')));

const emojis = {
    wave: '👋',
    sparkles: '✨',
    robot: '🤖',
    palette: '🎨',
    magic: '🪄',
    star: '⭐️',
    rocket: '🚀',
    lock: '🔒',
    unlock: '🔓',
    check: '✅',
    warning: '⚠️',
    idea: '💡',
    brain: '🧠',
    art: '🎭',
    image: '🖼️',
    chat: '💭'
};

// Создаем клавиатуру с кнопками подписки и проверки
const getSubscriptionKeyboard = () => {
    return {
        inline_keyboard: [
            ...requiredChannels.map(channel => [{
                text: `${emojis.star} Подписаться на ${channel}`,
                url: `https://t.me/${channel.slice(1)}`
            }]),
            [{ text: `${emojis.check} Проверить подписку`, callback_data: 'check_subscription' }]
        ]
    };
};

// Проверка подписки на каналы
async function checkSubscription(chatId, userId) {
    try {
        console.log(`Checking subscription for user ${userId}`);
        for (const channel of requiredChannels) {
            try {
                console.log(`Checking channel ${channel}`);
                const member = await bot.getChatMember(channel, userId);
                console.log(`Status for ${channel}:`, member.status);
                if (!['creator', 'administrator', 'member'].includes(member.status)) {
                    console.log(`User ${userId} is not subscribed to ${channel}`);
                    return false;
                }
                console.log(`User ${userId} is subscribed to ${channel}`);
            } catch (error) {
                console.error(`Error checking channel ${channel}:`, error.message);
                return false;
            }
        }
        console.log(`All subscriptions confirmed for user ${userId}`);
        return true;
    } catch (error) {
        console.error(`General error checking subscription:`, error.message);
        return false;
    }
}

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    
    console.log(`/start command received from user ${userId}`);
    
    const welcomeMessage = `
${emojis.wave} Привет, ${firstName}!

${emojis.sparkles} Добро пожаловать в ChatGPTi - ваш персональный AI-ассистент!

${emojis.brain} С помощью нашего бота вы сможете:
• ${emojis.chat} Общаться с продвинутым искусственным интеллектом
• ${emojis.idea} Получать помощь в решении задач
• ${emojis.palette} Создавать уникальные изображения
• ${emojis.art} Генерировать арты в различных стилях
• ${emojis.magic} Превращать ваши идеи в визуальные шедевры

${emojis.robot} Используйте силу искусственного интеллекта для решения ваших задач!

${emojis.lock} Для доступа к возможностям ChatGPTi, подпишитесь на наши каналы:`;

    const subscriptionMessage = `\n${emojis.rocket} После подписки вы получите доступ ко всем функциям ChatGPTi`;
    
    const isSubscribed = await checkSubscription(chatId, userId);
    
    if (isSubscribed) {
        console.log(`User ${userId} is already subscribed`);
        bot.sendMessage(chatId, 
            `${welcomeMessage}\n\n${emojis.unlock} Отлично! У вас есть полный доступ к ChatGPTi!\n\n${emojis.sparkles} Нажмите кнопку ниже, чтобы начать:`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{
                    text: `${emojis.palette} Открыть ChatGPTi`,
                    callback_data: 'open_app'
                }]]
            }
        });
    } else {
        console.log(`User ${userId} needs to subscribe`);
        const channelLinks = requiredChannels.map(channel => 
            `• <a href="https://t.me/${channel.slice(1)}">${channel}</a>`
        ).join('\n');
        
        bot.sendMessage(chatId, 
            `${welcomeMessage}\n\n${channelLinks}${subscriptionMessage}`, 
            { 
                parse_mode: 'HTML',
                reply_markup: getSubscriptionKeyboard(),
                disable_web_page_preview: true
            }
        );
    }
});

// Обработка callback_query
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    
    console.log(`Callback query received: ${query.data} from user ${userId}`);

    if (query.data === 'check_subscription') {
        const isSubscribed = await checkSubscription(chatId, userId);
        
        if (isSubscribed) {
            console.log(`User ${userId} subscription confirmed`);
            await bot.deleteMessage(chatId, query.message.message_id);
            bot.sendMessage(chatId, `
${emojis.unlock} Доступ открыт! 

${emojis.sparkles} Спасибо за подписку! Теперь у вас есть доступ ко всем возможностям ChatGPTi.

${emojis.rocket} Нажмите кнопку ниже, чтобы начать:`, {
                reply_markup: {
                    inline_keyboard: [[{
                        text: `${emojis.palette} Открыть ChatGPTi`,
                        callback_data: 'open_app'
                    }]]
                }
            });
        } else {
            console.log(`User ${userId} subscription check failed`);
            await bot.answerCallbackQuery({
                callback_query_id: query.id,
                text: '❌ Вы подписаны не на все каналы. Проверьте подписку и попробуйте снова.',
                show_alert: true
            });
        }
    } else if (query.data === 'open_app') {
        const isSubscribed = await checkSubscription(chatId, userId);
        
        if (isSubscribed) {
            console.log(`Opening web app for user ${userId}`);
            await bot.editMessageText(`${emojis.sparkles} ChatGPTi готов к работе!`, {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: [[{
                        text: `${emojis.palette} Открыть ChatGPTi`,
                        web_app: { url: webAppUrl }
                    }]]
                }
            });
        } else {
            console.log(`Access denied for user ${userId}`);
            const channelLinks = requiredChannels.map(channel => 
                `<a href="https://t.me/${channel.slice(1)}">${channel}</a>`
            ).join(' и ');
            
            bot.editMessageText(
                `${emojis.warning} Доступ ограничен!\n\nДля использования бота необходимо подписаться на каналы:\n${channelLinks}\n\n❗️ Важно: для сохранения доступа нельзя отписываться от каналов`,
                {
                    chat_id: chatId,
                    message_id: query.message.message_id,
                    parse_mode: 'HTML',
                    reply_markup: getSubscriptionKeyboard(),
                    disable_web_page_preview: true
                }
            );
        }
    }
});

// Проверка здоровья сервера
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Обработка веб-хуков
app.post('/web-data', async (req, res) => {
    const { queryId } = req.body;
    console.log('Received web-data request:', req.body);
    
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешно',
            input_message_content: {
                message_text: `${emojis.sparkles} Операция успешно выполнена!`
            }
        });
        return res.status(200).json({});
    } catch (error) {
        console.error('Error handling web-data:', error);
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Произошла ошибка',
            input_message_content: {
                message_text: 'К сожалению, произошла ошибка. Попробуйте позже.'
            }
        });
        return res.status(500).json({});
    }
});

// Маршрут для всех остальных запросов
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'build', 'index.html');
    console.log('Serving index.html from:', indexPath);
    
    if (!fs.existsSync(indexPath)) {
        console.error('index.html not found at:', indexPath);
        return res.status(404).send('index.html not found');
    }
    
    res.sendFile(indexPath);
});

// Запуск веб-сервера
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`${emojis.rocket} Server started on PORT ${PORT}`);
    console.log(`${emojis.sparkles} ChatGPTi Bot is running...`);
});