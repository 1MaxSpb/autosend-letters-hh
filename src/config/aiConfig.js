// Конфигурация для AI-сервисов генерации сопроводительных писем
export const AI_CONFIG = {
  // Настройки по умолчанию
  enabled: false, // включить/выключить AI генерацию
  provider: 'openai', // выбранный провайдер по умолчанию
  
  // Доступные провайдеры AI
  providers: {
    openai: {
      name: 'ChatGPT',
      apiUrl: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      apiKey: '', // нужно заполнить пользователем
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {API_KEY}'
      }
    },
    
    yandex: {
      name: 'Yandex GPT',
      apiUrl: 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      model: 'yandexgpt-lite',
      apiKey: '', // нужно заполнить пользователем
      folderId: '', // нужно заполнить пользователем
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Api-Key {API_KEY}',
        'x-folder-id': '{FOLDER_ID}'
      }
    },
    
    gigachat: {
      name: 'GigaChat',
      apiUrl: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions', 
      model: 'GigaChat',
      apiKey: '', // нужно заполнить пользователем
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {API_KEY}'
      }
    },
    
    gemini: {
      name: 'Google Gemini',
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      model: 'gemini-pro',
      apiKey: '', // нужно заполнить пользователем
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },

  // Системный промпт для генерации сопроводительных писем
  systemPrompt: `Ты - эксперт по составлению сопроводительных писем для соискателей работы в IT-сфере. 
Твоя задача - создать персонализированное сопроводительное письмо на основе названия вакансии.

Требования к письму:
1. Объем: 3-5 предложений
2. Тон: профессиональный, но дружелюбный
3. Структура: приветствие, интерес к вакансии, краткое описание релевантного опыта, призыв к действию
4. Избегай шаблонных фраз и клише
5. Используй русский язык
6. Не используй специфичные технические детали, которых нет в названии вакансии

Название вакансии: {vacancyName}

Создай сопроводительное письмо:`,

  // Настройки генерации
  generation: {
    maxTokens: 200,
    temperature: 0.7,
    timeout: 10000 // 10 секунд
  }
};