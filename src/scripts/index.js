async function logout() {
    try {
        localStorage.removeItem('cachedUser');
        let response = await (await fetch('http://localhost:3000/auth/logout',  { credentials: 'include' })).json();

        return response;
    } catch (error) {

        console.log(error.message);
        return error;
    }

}

(() => {
    const usernameElem = document.querySelector('#account-display-username');

    let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

    if (cachedUser) usernameElem.innerText = cachedUser.username;


    usernameElem.addEventListener('click', async () => {
        let res = await logout();

        if (res.authenticated == false) {
            console.log('logged out');
            return window.location.assign('/login.html');
            return;
        }

        
    });
})()