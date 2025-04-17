// Функция ответа на комментарий после нажатия на текст комментария:
const answerToCommentByClick = (textAreaElement) => {
    const listElement = document.getElementById('listAdd');
  
    // Используем делегирование событий вместо множественных обработчиков
    listElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('comment-text')) {
        const clickedComment = event.target;
        const commentElement = clickedComment.closest('.comment');
        const authorName = commentElement.querySelector('.comment-header div').textContent;
        const commentText = clickedComment.textContent.trim();
        
        textAreaElement.value = `> ${commentText}\n${authorName}, `;
        textAreaElement.focus();
      }
    });
};

export { answerToCommentByClick }