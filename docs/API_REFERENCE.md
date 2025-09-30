# 🔧 API Reference для разработчиков

Техническая документация для разработчиков, желающих понять внутреннее устройство AutoSend Letters HeadHunter или внести свой вклад в проект.

## 📁 Структура проекта

```
autosend-letters-hh/
├── src/
│   ├── config/           # Конфигурационные файлы
│   │   ├── constants.js  # Основные константы приложения
│   │   ├── selectors.js  # CSS селекторы для HeadHunter
│   │   ├── jobUrls.js    # URL-адреса для различных сайтов
│   │   └── aiConfig.js   # Конфигурация AI провайдеров
│   ├── data/
│   │   └── data.js       # Шаблоны сопроводительных писем
│   ├── modules/
│   │   ├── ai/           # AI сервисы
│   │   ├── interface/    # UI компоненты
│   │   ├── popup/        # Модули для работы с попапами
│   │   ├── process/      # Обработка вакансий
│   │   └── submit/       # Отправка откликов
│   ├── utils/            # Утилиты и помощники
│   ├── globals/          # Глобальные переменные
│   └── main.js           # Точка входа
├── docs/                 # Документация
├── dist/                 # Собранные файлы
└── webpack.config.js     # Конфигурация сборки
```

## 🧩 Основные модули

### AIService (`src/modules/ai/aiService.js`)

Основной класс для работы с AI провайдерами.

#### Методы

##### `isConfigured(): boolean`
Проверяет, настроен ли AI сервис для работы.

```javascript
if (aiService.isConfigured()) {
  // AI готов к работе
}
```

##### `generateCoverLetter(vacancyName: string): Promise<string>`
Генерирует сопроводительное письмо с помощью AI.

```javascript
try {
  const letter = await aiService.generateCoverLetter("Frontend Developer");
  console.log(letter);
} catch (error) {
  console.error("Ошибка генерации:", error);
}
```

##### `getAvailableProviders(): Array<ProviderInfo>`
Возвращает список доступных AI провайдеров.

```javascript
const providers = aiService.getAvailableProviders();
// [{ id: 'openai', name: 'ChatGPT', configured: true }, ...]
```

##### `setProvider(providerId: string): void`
Устанавливает активного AI провайдера.

```javascript
aiService.setProvider('yandex');
```

##### `setEnabled(enabled: boolean): void`
Включает/выключает AI генерацию.

```javascript
aiService.setEnabled(true);
```

#### Приватные методы API

- `_callOpenAI(prompt, provider)` - Обращение к OpenAI API
- `_callYandexGPT(prompt, provider)` - Обращение к Yandex GPT
- `_callGigaChat(prompt, provider)` - Обращение к GigaChat
- `_callGemini(prompt, provider)` - Обращение к Google Gemini

### Cover Letter Insertion (`src/modules/popup/insertCoverLetter.js`)

Модуль для вставки сопроводительных писем в форму HeadHunter.

##### `insertCoverLetter(coverLetter: string, vacancyName: string): Promise<void>`
Вставляет сопроводительное письмо в поле ввода. Если AI настроен, генерирует письмо автоматически.

```javascript
await insertCoverLetter('coverLetter_1', 'React Developer');
```

### Configuration Modal (`src/modules/interface/configModal.js`)

Модуль для создания интерфейса настроек.

##### `createConfigModal(): void`
Создает и отображает модальное окно настроек.

```javascript
createConfigModal();
```

## ⚙️ Конфигурация

### Constants (`src/config/constants.js`)

```javascript
export const CONSTANTS = {
  resume: '[data-qa="magritte-select-option-YOUR_RESUME_ID"]',
  coverLetter: 'coverLetter_1',
  delayMs: 1500,
};
```

### AI Configuration (`src/config/aiConfig.js`)

```javascript
export const AI_CONFIG = {
  enabled: false,
  provider: 'openai',
  providers: {
    openai: {
      name: 'ChatGPT',
      apiUrl: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      apiKey: '',
      headers: { /* ... */ }
    },
    // другие провайдеры...
  },
  systemPrompt: '...', // Промпт для генерации писем
  generation: {
    maxTokens: 200,
    temperature: 0.7,
    timeout: 10000
  }
};
```

### Selectors (`src/config/selectors.js`)

CSS селекторы для элементов интерфейса HeadHunter:

```javascript
export const SELECTORS = {
  // Основные элементы
  vacancyTitle: "[data-qa='serp-item__title']",
  respondBtn: '[data-qa="vacancy-serp__vacancy_response"]',
  
  // Попап отклика
  addCoverLetter: '[data-qa="vacancy-response-letter-toggle-text"]',
  coverLetterInput: '#cover-letter textarea',
  sendBtn: '[data-qa="vacancy-response-letter-submit"]',
  
  // И другие...
};
```

## 🔄 Жизненный цикл отклика

1. **Инициализация** (`main.js`)
   - Загрузка модулей
   - Добавление UI элементов

2. **Обработка клика** по кнопке отклика
   - `submitSingleVacancy()` или `submitCoverLetterPopup()`

3. **Выбор резюме** (`selectResume()`)
   - Открытие выпадающего списка
   - Выбор нужного резюме

4. **Генерация письма** (`insertCoverLetter()`)
   - Попытка AI генерации (если включено)
   - Fallback на шаблон при ошибке

5. **Отправка отклика**
   - Вставка письма в форму
   - Нажатие кнопки отправки

## 🛠️ Добавление нового AI провайдера

### Шаг 1: Добавить конфигурацию

В `src/config/aiConfig.js`:

```javascript
providers: {
  // существующие...
  
  newProvider: {
    name: 'New AI Provider',
    apiUrl: 'https://api.newprovider.com/v1/chat',
    model: 'new-model',
    apiKey: '',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {API_KEY}'
    }
  }
}
```

### Шаг 2: Добавить метод в AIService

В `src/modules/ai/aiService.js`:

```javascript
// В методе generateCoverLetter добавить case:
case 'newProvider':
  response = await this._callNewProvider(prompt, provider);
  break;

// Добавить приватный метод:
async _callNewProvider(prompt, provider) {
  const headers = {
    ...provider.headers,
    'Authorization': provider.headers.Authorization.replace('{API_KEY}', provider.apiKey)
  };

  const response = await fetch(provider.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      // Формат запроса для нового провайдера
    })
  });

  if (!response.ok) {
    throw new Error(`New Provider API ошибка: ${response.status}`);
  }

  const data = await response.json();
  return data.result.text; // Извлечение текста ответа
}
```

### Шаг 3: Обновить UI

В `src/modules/interface/configModal.js` добавить option в select:

```javascript
<option value="newProvider">New AI Provider</option>
```

И инструкции по получению API ключа.

## 🧪 Тестирование

### Локальное тестирование

1. **Сборка в dev режиме**:
   ```bash
   npm run build -- --mode development
   ```

2. **Установка в браузер**:
   - Откройте `dist/script.js`
   - Скопируйте содержимое
   - Вставьте в консоль браузера на HeadHunter

3. **Мониторинг логов**:
   ```javascript
   // Включить подробные логи
   localStorage.setItem('autosend-debug', 'true');
   ```

### Тестирование AI интеграции

```javascript
// Тест базовой функциональности
import { aiService } from './src/modules/ai/aiService.js';

// Настройка тестового провайдера
aiService.config.enabled = true;
aiService.config.provider = 'openai';
aiService.config.providers.openai.apiKey = 'test-key';

// Тест генерации
aiService.generateCoverLetter('Test Vacancy')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## 📦 Создание билда

### Development билд
```bash
npm run build -- --mode development
```

### Production билд
```bash
npm run build
```

### Webpack конфигурация

```javascript
// webpack.config.js
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

## 🔧 Утилиты

### `delay(ms)` - Функция задержки
```javascript
import { delay } from './utils/delay.js';
await delay(2000); // Пауза 2 секунды
```

### `triggerInputChange(element, value)` - Программное изменение input
```javascript
import { triggerInputChange } from './utils/triggerInputChange.js';
triggerInputChange(inputElement, 'new value');
```

## 🐛 Отладка

### Включение debug режима
```javascript
localStorage.setItem('autosend-debug', 'true');
```

### Основные точки отладки
- Консоль браузера (F12)
- Network tab для API запросов
- Логи в методах AI сервиса

### Типичные проблемы

1. **CORS ошибки** - некоторые API могут блокировать браузерные запросы
2. **Rate limiting** - превышение лимитов запросов к AI
3. **Изменения в HeadHunter** - обновление селекторов

## 🤝 Вклад в проект

1. **Fork репозитория**
2. **Создайте feature branch**
3. **Добавьте тесты** для новой функциональности
4. **Обновите документацию**
5. **Создайте Pull Request**

### Код-стайл

- ES6+ синтаксис
- Async/await для асинхронного кода
- JSDoc комментарии для публичных методов
- Camel case для переменных и функций
- Pascal case для классов

## 📄 Лицензия

Проект распространяется под лицензией ISC. Подробности в файле `package.json`.