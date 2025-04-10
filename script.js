const forButtonAddForm = document.getElementById('buttonAddForm');
const forNameInput = document.getElementById('nameInput');
const forTextArea = document.getElementById('textTextarea');
const listAdd = document.getElementById('listAdd');
const bottomAddForm = document.getElementById('bottomAddForm')
const preloader = document.getElementById('preloader'); 
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
// метод GET
const getComments = () => {
    if (!sessionStorage.getItem('loaded')) {
    // Если нет — показываем прелоадер
    preloader.style.display = '';
    bottomAddForm.style.display = 'none';
  }

      const fetchPromise = fetch("https://wedev-api.sky.pro/api/v1/marat_karimov/comments", {
       method: "GET"
      });
      
      fetchPromise.then((response) => {
        const jsonPromise = response.json();
        jsonPromise.then((responseData) => {
          const appComments = responseData.comments.map((comment) => {
            return {
              name : comment.author.name,
              date : new Date(comment.date).toLocaleDateString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit' }) + ' ' + new Date(comment.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              text : comment.text,
              likes : comment.likes,
              isLiked: false,
            };
          });
          comments = appComments;
          renderCommentators();
              // Скрываем прелоадер и сохраняем состояние в sessionStorage
          preloader.style.display = 'none';
          bottomAddForm.style.display = '';
          sessionStorage.setItem('loaded', 'true');
        })
      });
    };
    getComments();
  



// Массив со значениями для комментариев:
let comments = []; // Массив для хранения комментариев с сервера


// Рендеринг комментариев:
const renderCommentators = () => {
  const commentatorsHTML = comments.map((comment, index) => {
    return `<li class="comment" id="backgroundID">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date.toLocaleString()}</div> <!-- Форматируем дату -->
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button" data-index='${index}' ${comment.isLiked ? '-active-like' : ''}></button>
        </div>
      </div>
    </li>`;
  }).join('');

  listAdd.innerHTML = commentatorsHTML;

  initEventListeners();
};

// Функции для работы лайка
const saveLikesState = () => {
  comments.forEach((comment, index) => {
    const likeButton = document.querySelector(`.like-button[data-index='${index}']`);
    if (likeButton) {
      comment.isLiked = likeButton.classList.contains('-active-like');
    }
  });
};

const restoreLikesState = () => {
  comments.forEach((comment, index) => {
    const likeButton = document.querySelector(`.like-button[data-index='${index}']`);
    if (likeButton && comment.isLiked) {
      likeButton.classList.add('-active-like');
    }
  });
};

const handleLikeClick = function() {
  const index = this.getAttribute('data-index');
  const comment = comments[index];
  const likesCounter = this.parentElement.querySelector('.likes-counter');

  // Добавляем класс для анимации вращения
  this.classList.add('-loading-like');

  // Функция delay для имитации API запроса
  function delay(interval = 300) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, interval);
      });
    }

  // Имитация задержки API-запроса
  delay(2000).then(() => {
    // Удаление класса анимации после завершения "загрузки"
    this.classList.remove('-loading-like');

    // Логика увеличения/снижения лайков
    if (comment.isLiked) {
      comment.likes = (parseInt(comment.likes) - 1).toString();
      comment.isLiked = false;
      this.classList.remove('-active-like');
    } else {
      comment.likes = (parseInt(comment.likes) + 1).toString();
      comment.isLiked = true;
      this.classList.add('-active-like');
    }

    likesCounter.textContent = comment.likes;
  });
};

const initEventListeners = () => {
  const likeButtons = document.querySelectorAll('.like-button');
  likeButtons.forEach(button => {
    button.addEventListener('click', handleLikeClick);
  });
};

renderCommentators();
initEventListeners();


// // Функция ответа на комментарий после нажатия на текст комментария:
// const answerToCommentByClick = () => {
//   const clickedComments = document.querySelectorAll('.comment-text');

//   for (const clickedComment of clickedComments) {
//     clickedComment.addEventListener('click', () => {
//       // Находим родительский элемент комментария (li)
//       const commentElement = clickedComment.closest('.comment');

//       // Получаем имя автора и текст комментария
//       const authorName = commentElement.querySelector('.comment-header div').textContent;
//       const commentText = clickedComment.textContent;

//       return forTextArea.value =`> ${commentText}\n${authorName}, `;
//     });
//   }
// };

const clickedNameOrText = () => {
  forNameInput.style.background = '#fff';
  forTextArea.style.background = '#fff';
  forNameInput.style.border = 'none';
  forTextArea.style.border = 'none';
}

// Функция для добавления комментария на страницу, по нажатию на кнопку "Добавить":
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

function fetchPOST(attempt = 1) {
    const maxAttempts = 3;

    fetch("https://wedev-api.sky.pro/api/v1/marat_karimov/comments", {
        method: "POST",
        body: JSON.stringify({
            name: nameValue,
            text: forTextArea.value,
            forceError: true,
        }),
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status >= 500 && attempt < maxAttempts) {
                    // Если 500+ ошибка и еще есть попытки, делаем повторный запрос
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(fetchPOST(attempt + 1));
                        }, 1000 * attempt); // Увеличиваем задержку с каждой попыткой
                    });
                }
                // Для ошибок 4xx и 5xx сначала читаем JSON с сообщением об ошибке
                if (response.status >= 400 && response.status <= 400) {
                    return response.json().then(errorData => {
                        // Если сервер вернул сообщение об ошибке, используем его
                        if (errorData.error) {
                            throw new Error(errorData.error);
                        }
                        // Если нет сообщения от сервера, используем стандартное
                        throw new Error(`Ошибка сервера: ${response.status}`);
                    });
                }
            }
            return response.json();
        })
        .then(() => {
            getComments();
            renderCommentators();
            statusElement.remove();
            bottomAddForm.style.display = ''; // Возвращаем видимость формы
            forNameInput.value = '';         // Очищаем поле имени
            forTextArea.value = '';          // Очищаем поле текста
        })
        .catch((error) => {
            console.error(`Ошибка: ${error.message}`);
            if (error.message === 'Failed to fetch') {
            alert('Пропал интернет, попробуйте позже');
            } else {
            alert('Произошла ошибка: ' + error.message);
            }
            statusElement.remove();
            bottomAddForm.style.display = ''; // Возвращаем видимость формы
        });
    }
    fetchPOST();
})



// Обработчик beforeunload, который нужен, чтобы очистить данные сессии, для проверки прелоадера
window.onbeforeunload = function() {
  sessionStorage.clear();
};

