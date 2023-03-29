(() => {
    const accountDisplayElem = document.querySelector('#account-display');
    
    let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

    let titleElem = accountDisplayElem.querySelector('#account-display-title');

    titleElem.innerHTML = cachedUser.username;

})()