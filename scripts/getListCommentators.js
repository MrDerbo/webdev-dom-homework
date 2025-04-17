// Стилизация и логика появления одного комментария, подобно CSS.
const getListCommentators = (comment, index) => {
    return `
    <li class="comment" id="backgroundID">
        <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date.toLocaleString()}</div>
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
}

export { getListCommentators }