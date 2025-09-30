// Импортируем функцию для предотвращающая перехода на другие страницы
// import { navigationGuard } from './utils/navigationGuard';

// Импортируем функцию для продолжения отправки откликов после обновления страницы
// import { resumeMultiSubmit } from './utils/resumeMultiSubmit';

// Импортируем функцию, которая добавляет кнопку "Отправить отклики"
import { addResponseBtn } from './modules/interface/addResponseBtn';

// Импортируем функцию, которая добавляет кнопку "Поддержать проект"
import { addSponsorBtn } from './modules/interface/addSponsorBtn';

// Импортируем функцию, которая добавляет кнопку "Настройки AutoSend"
import { addConfigBtn } from './modules/interface/addConfigBtn';

// Основная точка входа в приложение
(async function main() {
  // Запрещаем переход на другие страницы
  // navigationGuard();

  // Продолжаем отправку откликов после обновления страницы
  // await resumeMultiSubmit();

  // Добавляем кнопку "Настройки AutoSend"
  await addConfigBtn();

  // Добавляем кнопку "Отправить отклики"
  await addResponseBtn();

  // Добавляем кнопку "Поддержать проект"
  await addSponsorBtn();
})();
