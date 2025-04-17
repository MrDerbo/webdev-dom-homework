export const createLikeHandlers = (comments) => {
  // Логика работы лайка: прибавление, удаление, ожидание и т.д.
  const handleLikeClick = function() {
    const index = this.getAttribute('data-index');
    const comment = comments[index];
    const likesCounter = this.parentElement.querySelector('.likes-counter');
  
    this.classList.add('-loading-like');
  
    function delay(interval = 300) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, interval);
      });
    }
  
    delay(2000).then(() => {
      this.classList.remove('-loading-like');
  
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
  
  // Инициализация системы лайков
  const initEventListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
      button.addEventListener('click', handleLikeClick);
    });
  };

  return { initEventListeners, handleLikeClick };
}