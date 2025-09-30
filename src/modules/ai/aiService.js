// Сервис для работы с AI провайдерами
import { AI_CONFIG } from '../../config/aiConfig.js';

/**
 * Основной класс для работы с AI сервисами
 */
export class AIService {
  constructor() {
    this.config = AI_CONFIG;
  }

  /**
   * Проверяет, настроен ли AI сервис
   * @returns {boolean}
   */
  isConfigured() {
    if (!this.config.enabled) return false;
    
    const provider = this.config.providers[this.config.provider];
    return provider && provider.apiKey && provider.apiKey.trim() !== '';
  }

  /**
   * Генерирует сопроводительное письмо с помощью AI
   * @param {string} vacancyName - название вакансии
   * @returns {Promise<string>} - сгенерированное письмо
   */
  async generateCoverLetter(vacancyName) {
    if (!this.isConfigured()) {
      throw new Error('AI сервис не настроен. Проверьте конфигурацию.');
    }

    const provider = this.config.providers[this.config.provider];
    const prompt = this.config.systemPrompt.replace('{vacancyName}', vacancyName);

    try {
      let response;
      
      switch (this.config.provider) {
        case 'openai':
          response = await this._callOpenAI(prompt, provider);
          break;
        case 'yandex':
          response = await this._callYandexGPT(prompt, provider);
          break;
        case 'gigachat':
          response = await this._callGigaChat(prompt, provider);
          break;
        case 'gemini':
          response = await this._callGemini(prompt, provider);
          break;
        default:
          throw new Error(`Неподдерживаемый провайдер: ${this.config.provider}`);
      }

      return response;
    } catch (error) {
      console.error('Ошибка генерации сопроводительного письма:', error);
      throw error;
    }
  }

  /**
   * Вызов OpenAI API (ChatGPT)
   * @private
   */
  async _callOpenAI(prompt, provider) {
    const headers = {
      ...provider.headers,
      'Authorization': provider.headers.Authorization.replace('{API_KEY}', provider.apiKey)
    };

    const response = await fetch(provider.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.generation.maxTokens,
        temperature: this.config.generation.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * Вызов Yandex GPT API
   * @private
   */
  async _callYandexGPT(prompt, provider) {
    const headers = {
      ...provider.headers,
      'Authorization': provider.headers.Authorization.replace('{API_KEY}', provider.apiKey),
      'x-folder-id': provider.headers['x-folder-id'].replace('{FOLDER_ID}', provider.folderId)
    };

    const response = await fetch(provider.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        modelUri: `gpt://${provider.folderId}/${provider.model}`,
        completionOptions: {
          stream: false,
          temperature: this.config.generation.temperature,
          maxTokens: this.config.generation.maxTokens
        },
        messages: [{ role: 'user', text: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Yandex GPT API ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.result.alternatives[0].message.text.trim();
  }

  /**
   * Вызов GigaChat API
   * @private
   */
  async _callGigaChat(prompt, provider) {
    const headers = {
      ...provider.headers,
      'Authorization': provider.headers.Authorization.replace('{API_KEY}', provider.apiKey)
    };

    const response = await fetch(provider.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.generation.maxTokens,
        temperature: this.config.generation.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`GigaChat API ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * Вызов Google Gemini API
   * @private
   */
  async _callGemini(prompt, provider) {
    const apiUrlWithKey = `${provider.apiUrl}?key=${provider.apiKey}`;

    const response = await fetch(apiUrlWithKey, {
      method: 'POST',
      headers: provider.headers,
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: this.config.generation.temperature,
          maxOutputTokens: this.config.generation.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  /**
   * Получает список доступных провайдеров
   * @returns {Array} массив объектов с информацией о провайдерах
   */
  getAvailableProviders() {
    return Object.keys(this.config.providers).map(key => ({
      id: key,
      name: this.config.providers[key].name,
      configured: this.config.providers[key].apiKey && this.config.providers[key].apiKey.trim() !== ''
    }));
  }

  /**
   * Устанавливает активного провайдера
   * @param {string} providerId - ID провайдера
   */
  setProvider(providerId) {
    if (this.config.providers[providerId]) {
      this.config.provider = providerId;
    } else {
      throw new Error(`Провайдер ${providerId} не найден`);
    }
  }

  /**
   * Включает/выключает AI генерацию
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
  }
}

// Экспортируем singleton экземпляр
export const aiService = new AIService();