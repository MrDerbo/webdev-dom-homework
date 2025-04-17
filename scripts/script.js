const forButtonAddForm = document.getElementById('buttonAddForm');
const forNameInput = document.getElementById('nameInput');
const forTextArea = document.getElementById('textTextarea');
const listAdd = document.getElementById('listAdd');
const bottomAddForm = document.getElementById('bottomAddForm')
const preloader = document.getElementById('preloader');

// Создание PreLoader
// Проверяем наличие записи в sessionStorage 
if (!sessionStorage.getItem('loaded')) { 
  // Если запись отсутствует, значит это первая загрузка или перезагрузка страницы 
  console.log('Это первая загрузка или перезагрузка страницы.'); 
  preloader.style.display = ''; // Показываем прелоадер 
  } else { console.log('Страница уже была загружена в этой сессии.'); 
preloader.style.display = 'none'; // Сразу скрываем прелоадер 
}

if (!sessionStorage.getItem('loaded')) {
  // Если нет — показываем прелоадер
  preloader.style.display = '';
}

// Массив со значениями для комментариев:
let comments = []; // Массив для хранения комментариев с сервера

import { getListCommentators } from "./getListCommentators.js";
import { renderCommentators } from "./renderCommentators.js";
import { createLikeHandlers } from "./likeFunction.js";
import { answerToCommentByClick } from "./answerToOtherComment.js";
answerToCommentByClick(forTextArea)

// Берем значения комментариев с сервера:
import { getComments } from "./api.js";
getComments().then((appComments) => {
  comments = appComments;
  const { initEventListeners } = createLikeHandlers(comments)
  renderCommentators(listAdd, comments, getListCommentators, initEventListeners);
})


// Функция для добавления комментария на страницу, по нажатию на кнопку "Добавить":
import { postComments } from "./api.js";
forButtonAddForm.addEventListener('click', () => {
  const nameValue = forNameInput.value;
  const textareaValue = forTextArea.value;

  forNameInput.classList.remove('error');
  forTextArea.classList.remove('error');

  if (nameValue === '' && textareaValue === '') {
  forNameInput.classList.add('error');
  forTextArea.classList.add('error');
  return;
  }

  if (nameValue === '') {
    forNameInput.classList.add('error');
    return;
  }

  if (textareaValue === '') {
    forTextArea.classList.add('error');
    return;
  }
  
  // Скрываем форму и добавляем сообщение о загрузке 
  bottomAddForm.style.display = "none"; // Убираем форму
  // Статус для момента, после отправки нового комментария
  const statusElement = document.createElement('div'); // Создаем блок
  statusElement.className = 'status-message visible' // Классы для CSS
  statusElement.textContent = 'Комментарий добавляется...';
  statusElement.id = 'temp-status';
  listAdd.appendChild(statusElement); // Добавляем в конец

  postComments(nameValue, textareaValue)
    .then((response) => {
      console.log('Комментарий отправлен:', response);
      return getComments();
    })
    .then((appComments) => {
      comments = appComments;
      const { initEventListeners } = createLikeHandlers(comments)
      renderCommentators(listAdd, comments, getListCommentators, initEventListeners);
    })
    .then(() => {
      statusElement.remove();
      bottomAddForm.style.display = '';
      forNameInput.value = '';
      forTextArea.value = '';
    })
    .catch((error) => {
      console.error(`Ошибка: ${error.message}`);
      statusElement.remove();
      bottomAddForm.style.display = '';
      alert(error.message === 'Failed to fetch'
        ? 'Пропал интернет, попробуйте позже'
        : `Ошибка: ${error.message}`);
    })
})



// Обработчик beforeunload, который нужен, чтобы очистить данные сессии, для проверки прелоадера
window.onbeforeunload = function() {
  sessionStorage.clear();
};

