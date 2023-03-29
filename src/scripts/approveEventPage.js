const allEventsEl = document.querySelector('#all-events-list');

let eventState = {};

let cachedUser = JSON.parse(localStorage.getItem('cachedUser'))

async function getAllEvents() {
    let response = await fetch('http://localhost:3000/events/all', { credentials: 'include' })

    try {
        let dat = await response.json();

        if (dat.length) {
            dat.forEach((e, i) => {
                eventState[i] = e;
            })
        }

        return dat;
    } catch (error) {
        return error;
    }

}

function createEventItem({ owner_id, upvotes, title, description, location }, index) {
    return (
        `<div class="event-item" data-index="${index}">
        <div class="event-header">
            <div class="event-header-tag">
                <i class="fa fa-ticket" aria-hidden="true"></i>
                <h2>${title}</h2>
            </div>

            <div class="event-location">${location}</div>
        </div>

        <div class="item-spacer"></div>

        <div class="event-body">
            <div class="stat">
            <i class="fa fa-users" aria-hidden="true"></i>
            10000+
            </div>
            <div class="stat">
            <i class="fas fa-vote-yea"></i>
            ${upvotes}
            </div>

           
            ${cachedUser.isAdmin ?
            `<div class="admin-controls">
                    <button id='admin-approve'>approve</button>
                </div>`
            :
            `<div class="user-controls">
                    <button id='user-upvote'>upvote</button>
                </div>`
        }
        </div>
    </div>`
    )
}

function populateEvents(element, events) {
    let eventElems = [];

    if (events.length) {
        events.forEach((event, i) => {
            let el = createEventItem(event, i);
            eventElems.push(el);
        })

        element.innerHTML = eventElems.join(' ')
    } else {
        element.textContent = 'Error'
    }

}

allEventsEl.addEventListener('click', (e) => {
    // find if an item was selected
    let listItem = e.target.closest('div.event-item');

    if (listItem) { // if item clicked
        // find out which item was clicked
        let selectedItem = eventState[listItem.dataset.index];

        // find if there was a button clicked
        let selectedButton = e.target.closest('button')
        if (selectedButton) { // if button was clicked

            // print the desired user action from the list
            console.log({ item: selectedItem.event_id, action: selectedButton.id });
        }


    }
})

document.addEventListener('DOMContentLoaded', async () => {
    let events = await getAllEvents();

    console.log(events);

    if (events.message) {
        window.location.assign('/login.html')
    } else {
        populateEvents(allEventsEl, events)
    }

})

//Get modal element
const modal = document.getElementById('eventModal');
//get open modal button
const modalBtn = document.getElementById('modalBtn');
//get close button
const closeBtn = document.getElementById('closeBtn');
//Listen for click
modalBtn.addEventListener('click', openModal);
//Function to open modal
function openModal() {
    modal.style.display = 'block';
}
//Listen for click
closeBtn.addEventListener('click', closeModal);
//Function to close modal
function closeModal() {
    modal.style.display = 'none';
}
