// Метод GET, с помощью которого получаем данные с сервера
const getComments = () => {
    if (!sessionStorage.getItem('loaded')) {
        preloader.style.display = '';
        bottomAddForm.style.display = 'none';
    }

    return fetch("https://wedev-api.sky.pro/api/v1/kks/comments", {
        method: "GET"
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        return response.json();
    })
    .then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: new Date(comment.date).toLocaleDateString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit' }) + ' ' + 
                      new Date(comment.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });

        preloader.style.display = 'none';
        bottomAddForm.style.display = '';
        sessionStorage.setItem('loaded', 'true');
        
        return appComments;
    })
    .catch(error => {
        console.error("Ошибка при получении комментариев:", error);
        preloader.style.display = 'none';
        throw error;
    });
};


// Метод POST, с помощью которого данные отправляются на сервер.
const postComments = (name, text, maxAttempts = 3) => {
    const fetchPOST = (attempt = 1) => {
      return fetch("https://wedev-api.sky.pro/api/v1/kks/comments", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          text: text,
          forceError: false,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          if (response.status >= 500 && attempt < maxAttempts) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(fetchPOST(attempt + 1));
              }, 1000 * attempt);
            });
          }
          if (response.status >= 400 && response.status <= 500) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
            });
          }
        }
        return response.json();
      });
    };
    return fetchPOST();
};



export { getComments, postComments }