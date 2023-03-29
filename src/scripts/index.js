function logout() {
    localStorage.removeItem('cachedUser');
    console.log('logging out');
    window.location.assign('/login.html');
}

(() => {
    const usernameElem = document.querySelector('#account-display-username');

    let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

    usernameElem.innerText = cachedUser.username;

    usernameElem.addEventListener('click', () => {
        logout()
    });
})()