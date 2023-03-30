const loginForm = document.querySelector('#log-in-form');
const loginFormErrorEl = document.querySelector('#form-errors');

async function login(data) {
    let payload = JSON.stringify(data);

    let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    }

    let response = await fetch(' http://localhost:3000/auth/login', options)

    try {
        let dat = await response.json();

        return dat;
    } catch (error) {
        return error
    }
}

loginForm.addEventListener('submit', async e => {
    e.preventDefault()

    let formValues = new FormData(loginForm);
    let data = { username: formValues.get('username').toString(), password: formValues.get('password').toString() }

    let res = await login(data);
    console.log(data)

    if (res.error) {
        loginFormErrorEl.textContent = res.error;
    } else {
        loginFormErrorEl.textContent = "";
        localStorage.setItem('cachedUser', JSON.stringify(res.user))
        console.log('logged in');

        window.location.assign('/approved-events.html')
    }
})
