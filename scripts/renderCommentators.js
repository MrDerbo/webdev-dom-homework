// Рендерим комментарии на странице
const renderCommentators = (element, comments, getListCommentators, initEventListeners) => {
  const commentatorsHTML = comments.map((comment, index) => 
      getListCommentators(comment, index)).join('');
  element.innerHTML = commentatorsHTML;
  initEventListeners();
}

export { renderCommentators }