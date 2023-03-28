const signupForm = document.querySelector('#signup');
const signupFormErrorEl = document.querySelector('#form-errors');

async function signup(data) {
    let payload = JSON.stringify(data);

    let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: payload
    }

    let response = await fetch('http://localhost:3000/register', options)

    try {
        let dat = await response.json();

        return dat;
    } catch (error) {
        return error
    }
}

signupForm.addEventListener('submit', async e => {
    e.preventDefault()

    let formValues = new FormData(signupForm);
    let data = { username: formValues.get('username').toString(), password: formValues.get('password').toString() }

    let res = await signup(data);
    console.log(data)

    if (res.error) {
        signupFormErrorEl.textContent = res.error;
    } else {
        signupFormErrorEl.textContent = "";
        localStorage.setItem('cachedUser', JSON.stringify(res))
        console.log('registered');

        window.location.assign('/login.html')
    }
})
