const loginForm = document.querySelector('#log-in-form');

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

    console.log(payload);
    let response = await fetch('http://localhost:3000/auth/login', options)


    let dat = await response.json();

    return dat;
}

loginForm.addEventListener('submit', async e => {
    e.preventDefault()

    let formValues = new FormData(loginForm);

    let data = { username: formValues.get('username').toString(), password: formValues.get('password').toString() }



    let res = await login(data);

    console.log(res);
})