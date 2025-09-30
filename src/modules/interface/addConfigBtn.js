// Импортируем селекторы
import { SELECTORS } from '../../config/selectors.js';

// Импортируем функцию для поиска элемента с указанным текстом
import { findElementByText } from './findElementByText.js';

// Импортируем модальное окно настроек
import { createConfigModal } from './configModal.js';

// Функция добавляет новую кнопку в навигации "Настройки AutoSend"
export async function addConfigBtn() {
  // Получаем список элементов навигации
  const navItems = document.querySelectorAll(SELECTORS.naviItems);

  // Проверяем, что есть элементы навигации
  if (navItems.length === 0) return;

  // Клонируем первый элемент навигации
  const clonedItem = navItems[0].cloneNode(true);

  // Находим текстовый элемент внутри склонированного элемента
  const textElement = findElementByText(clonedItem);

  // Меняем текст кнопки
  textElement.textContent = '⚙️ Настройки AutoSend';

  // Удаляем ссылку, чтобы не было перехода по умолчанию
  clonedItem.removeAttribute('href');

  // Меняем курсор на указатель (визуально как кнопка)
  clonedItem.style.cursor = 'pointer';

  // Добавляем стили для выделения кнопки
  clonedItem.style.backgroundColor = '#4CAF50';
  clonedItem.style.color = 'white';
  clonedItem.style.borderRadius = '4px';
  clonedItem.style.fontWeight = 'bold';

  // Добавляем обработчик для открытия настроек
  clonedItem.addEventListener('click', (e) => {
    e.preventDefault();
    createConfigModal();
  });

  // Добавляем ховер эффект
  clonedItem.addEventListener('mouseenter', () => {
    clonedItem.style.backgroundColor = '#45a049';
  });

  clonedItem.addEventListener('mouseleave', () => {
    clonedItem.style.backgroundColor = '#4CAF50';
  });

  // Вставляем склонированный элемент в начало навигации
  navItems[0].parentNode.insertBefore(clonedItem, navItems[0]);
}