async function createEvent(data) {

    // build fetch options using input data
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    }

    try {
        // attempt to create event
        let response = await (await fetch(' http://localhost:3000/events', options)).json()

        return response;

    } catch (error) { // handle errors
        console.log(error.message);
        return error
    }
}

// get the cached user from localstorage
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'))

// check for presence of cached user on load
document.addEventListener('DOMContentLoaded', (e) => {
    if (!cachedUser) window.location.assign('/login.html');
})

// get event form element
const formElem = document.querySelector('#event-form');

// add form event listener on submit
formElem.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get the most recent form element's state
    let form = e.target;

    // create a FormData object to access the values 
    let formData = new FormData(form);


    // create a data payload with the data from the form
    // and the cached user
    let data = {
        owner_id: cachedUser.user_id,
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location')
    }

    // post to the server
    let res = await createEvent(data);

    if (res.message) { // if there is an error, redirect to login page
        return window.location.assign('/login.html');
    }
    
    console.log(res);
    window.location.assign('/approve-event.html')
})