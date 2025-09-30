// Импортируем селекторы
import { SELECTORS } from '../../config/selectors.js';

// Импортируем список шаблонов сопроводительных писем
import { TEMPLATES } from '../../data/data.js';

// Импортируем AI сервис
import { aiService } from '../ai/aiService.js';

// Импортируем функцию для программного изменения "value" у "input"
import { triggerInputChange } from '../../utils/triggerInputChange.js';

// Функция для добавления готового письма в поле ввода
export async function insertCoverLetter(coverLetter, vacancyName) {
  // Ищем поле ввода для сопроводительного письма
  const coverLetterInput =
    document.querySelector(SELECTORS.coverLetterInput) ||
    document.querySelector(SELECTORS.coverLetterInputPopup);

  // Если поле не найдено, прекращаем выполнение
  if (!coverLetterInput) return;

  let messageValue;

  try {
    // Если AI включен и настроен, генерируем письмо с помощью AI
    if (aiService.isConfigured()) {
      console.log('Генерируем сопроводительное письмо с помощью AI...');
      messageValue = await aiService.generateCoverLetter(vacancyName);
    } else {
      // Иначе используем готовый шаблон
      messageValue = TEMPLATES[coverLetter].replace('{#vacancyName}', vacancyName);
    }
  } catch (error) {
    console.warn('Ошибка генерации AI письма, используем шаблон:', error);
    // В случае ошибки AI, используем обычный шаблон
    messageValue = TEMPLATES[coverLetter].replace('{#vacancyName}', vacancyName);
  }

  // Добавляем в поле готовое письмо через сеттер
  triggerInputChange(coverLetterInput, messageValue);
}
