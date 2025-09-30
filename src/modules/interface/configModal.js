// Модуль для создания модального окна настроек
import { CONSTANTS } from '../../config/constants.js';
import { AI_CONFIG } from '../../config/aiConfig.js';
import { aiService } from '../ai/aiService.js';
import { TEMPLATES } from '../../data/data.js';

/**
 * Создает модальное окно с настройками
 */
export function createConfigModal() {
  // Проверяем, что модальное окно еще не создано
  if (document.getElementById('autosend-config-modal')) {
    document.getElementById('autosend-config-modal').style.display = 'block';
    return;
  }

  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.id = 'autosend-config-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Создаем контейнер содержимого
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
      <h2 style="margin: 0; color: #333; font-size: 24px;">⚙️ Настройки AutoSend</h2>
      <button id="close-config" style="
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 5px;
        border-radius: 5px;
      ">✕</button>
    </div>

    <!-- Основные настройки -->
    <div style="margin-bottom: 25px;">
      <h3 style="color: #333; margin-bottom: 15px;">📝 Основные настройки</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">ID резюме:</label>
        <input type="text" id="resume-id" placeholder="Введите ваш ID резюме" style="
          width: 100%;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        ">
        <small style="color: #666; font-size: 12px;">Найдите на странице резюме в URL или в инспекторе элементов</small>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Задержка (мс):</label>
        <input type="number" id="delay-ms" min="500" max="10000" step="100" style="
          width: 100%;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        ">
        <small style="color: #666; font-size: 12px;">Время ожидания между действиями (рекомендуется 1500-3000мс)</small>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Шаблон письма:</label>
        <select id="cover-letter-template" style="
          width: 100%;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        ">
          ${Object.keys(TEMPLATES).map(key => 
            `<option value="${key}">${key}</option>`
          ).join('')}
        </select>
      </div>
    </div>

    <!-- AI настройки -->
    <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <h3 style="color: #333; margin-bottom: 15px;">🤖 AI Генерация писем</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="ai-enabled" style="margin-right: 10px; transform: scale(1.2);">
          <span style="font-weight: 600; color: #555;">Включить AI генерацию сопроводительных писем</span>
        </label>
      </div>

      <div id="ai-settings" style="display: none;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Провайдер AI:</label>
          <select id="ai-provider" style="
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          ">
            <option value="openai">ChatGPT (OpenAI)</option>
            <option value="yandex">Yandex GPT</option>
            <option value="gigachat">GigaChat (Сбер)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">API ключ:</label>
          <input type="password" id="ai-api-key" placeholder="Введите API ключ" style="
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          ">
        </div>

        <div id="yandex-folder" style="display: none; margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Folder ID (для Yandex):</label>
          <input type="text" id="yandex-folder-id" placeholder="Введите Folder ID" style="
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          ">
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #1976d2;">📖 Инструкции по получению API ключей:</h4>
          <div id="api-instructions" style="font-size: 13px; color: #555; line-height: 1.5;">
            <!-- Инструкции будут добавлены динамически -->
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки -->
    <div style="display: flex; gap: 15px; justify-content: flex-end; margin-top: 25px;">
      <button id="save-config" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      ">💾 Сохранить настройки</button>
      <button id="cancel-config" style="
        background: #f44336;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      ">❌ Отмена</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Загружаем текущие настройки
  loadCurrentSettings();

  // Добавляем обработчики событий
  addEventListeners();

  // Обновляем инструкции для выбранного провайдера
  updateApiInstructions();
}

/**
 * Загружает текущие настройки в форму
 */
function loadCurrentSettings() {
  // Загружаем основные настройки
  const resumeId = CONSTANTS.resume.match(/magritte-select-option-(.+?)"/)?.[1] || '';
  document.getElementById('resume-id').value = resumeId;
  document.getElementById('delay-ms').value = CONSTANTS.delayMs;
  document.getElementById('cover-letter-template').value = CONSTANTS.coverLetter;

  // Загружаем AI настройки
  document.getElementById('ai-enabled').checked = AI_CONFIG.enabled;
  document.getElementById('ai-provider').value = AI_CONFIG.provider;
  
  const currentProvider = AI_CONFIG.providers[AI_CONFIG.provider];
  document.getElementById('ai-api-key').value = currentProvider.apiKey || '';
  
  if (AI_CONFIG.provider === 'yandex') {
    document.getElementById('yandex-folder-id').value = currentProvider.folderId || '';
  }

  // Показываем/скрываем AI настройки
  toggleAISettings();
}

/**
 * Добавляет обработчики событий
 */
function addEventListeners() {
  // Закрытие модального окна
  document.getElementById('close-config').onclick = closeModal;
  document.getElementById('cancel-config').onclick = closeModal;
  
  // Клик по фону
  document.getElementById('autosend-config-modal').onclick = (e) => {
    if (e.target.id === 'autosend-config-modal') closeModal();
  };

  // Переключение AI настроек
  document.getElementById('ai-enabled').onchange = toggleAISettings;
  
  // Смена провайдера AI
  document.getElementById('ai-provider').onchange = () => {
    updateApiInstructions();
    toggleYandexFolder();
  };

  // Сохранение настроек
  document.getElementById('save-config').onclick = saveSettings;

  // Ховер эффекты для кнопок
  const buttons = ['save-config', 'cancel-config'];
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    btn.onmouseenter = () => btn.style.opacity = '0.9';
    btn.onmouseleave = () => btn.style.opacity = '1';
  });

  // Показать/скрыть поле Folder ID для Yandex
  toggleYandexFolder();
}

/**
 * Показывает/скрывает AI настройки
 */
function toggleAISettings() {
  const aiSettings = document.getElementById('ai-settings');
  const isEnabled = document.getElementById('ai-enabled').checked;
  aiSettings.style.display = isEnabled ? 'block' : 'none';
}

/**
 * Показывает/скрывает поле Folder ID для Yandex
 */
function toggleYandexFolder() {
  const yandexFolder = document.getElementById('yandex-folder');
  const isYandex = document.getElementById('ai-provider').value === 'yandex';
  yandexFolder.style.display = isYandex ? 'block' : 'none';
}

/**
 * Обновляет инструкции по получению API ключа
 */
function updateApiInstructions() {
  const provider = document.getElementById('ai-provider').value;
  const instructions = document.getElementById('api-instructions');
  
  const instructionsMap = {
    openai: `
      <strong>ChatGPT (OpenAI):</strong><br>
      1. Перейдите на <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com/api-keys</a><br>
      2. Создайте новый API ключ<br>
      3. Скопируйте и вставьте его в поле выше
    `,
    yandex: `
      <strong>Yandex GPT:</strong><br>
      1. Перейдите в <a href="https://console.cloud.yandex.ru/" target="_blank">Yandex Cloud Console</a><br>
      2. Создайте сервисный аккаунт и API ключ<br>
      3. Найдите Folder ID в настройках проекта<br>
      4. Заполните оба поля выше
    `,
    gigachat: `
      <strong>GigaChat (Сбер):</strong><br>
      1. Зарегистрируйтесь на <a href="https://developers.sber.ru/portal/products/gigachat" target="_blank">developers.sber.ru</a><br>
      2. Создайте приложение и получите токен авторизации<br>
      3. Вставьте токен в поле выше
    `,
    gemini: `
      <strong>Google Gemini:</strong><br>
      1. Перейдите в <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a><br>
      2. Создайте новый API ключ<br>
      3. Скопируйте и вставьте его в поле выше
    `
  };

  instructions.innerHTML = instructionsMap[provider] || '';
}

/**
 * Сохраняет настройки
 */
function saveSettings() {
  try {
    // Сохраняем основные настройки
    const resumeId = document.getElementById('resume-id').value.trim();
    const delayMs = parseInt(document.getElementById('delay-ms').value);
    const coverLetter = document.getElementById('cover-letter-template').value;

    if (resumeId) {
      CONSTANTS.resume = `[data-qa="magritte-select-option-${resumeId}"]`;
    }
    CONSTANTS.delayMs = delayMs;
    CONSTANTS.coverLetter = coverLetter;

    // Сохраняем AI настройки
    const aiEnabled = document.getElementById('ai-enabled').checked;
    const aiProvider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value.trim();
    
    AI_CONFIG.enabled = aiEnabled;
    AI_CONFIG.provider = aiProvider;
    AI_CONFIG.providers[aiProvider].apiKey = apiKey;

    // Для Yandex сохраняем Folder ID
    if (aiProvider === 'yandex') {
      const folderId = document.getElementById('yandex-folder-id').value.trim();
      AI_CONFIG.providers.yandex.folderId = folderId;
    }

    // Обновляем настройки в AI сервисе
    aiService.setEnabled(aiEnabled);
    aiService.setProvider(aiProvider);

    alert('✅ Настройки успешно сохранены!');
    closeModal();
  } catch (error) {
    alert('❌ Ошибка при сохранении настроек: ' + error.message);
  }
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
  const modal = document.getElementById('autosend-config-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}