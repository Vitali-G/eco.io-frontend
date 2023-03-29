const allEventsEl = document.querySelector('#all-events-list');

let eventState = {};

async function getAllEvents() {
    let response = await fetch('http://localhost:3000/events/all', { credentials: 'include' })

    try {
        let dat = await response.json();

        dat.forEach((e, i) => {
            eventState[i] = e;
        })

        console.log(eventState);
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
        </div>
    </div>`
    )
}

function populateEvents(element, events) {
    let eventElems = [];

    events.forEach((event, i) => {
        let el = createEventItem(event, i);
        eventElems.push(el);
    })

    element.innerHTML = eventElems.join(' ')
}

allEventsEl.addEventListener('click', (e) => {
    let listItem = e.target.closest('div.event-item');
    if(listItem) {
        console.log(eventState[listItem.dataset.index]);
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    let events = await getAllEvents();

    if (events.message) {
        window.location.assign('/login.html')
    } else {
        populateEvents(allEventsEl, events)
    }

})

//Get modal element
const modal = document.getElementById('eventModal');
//get open modal button
const event = document.getElementById('modalBtn');
//get close button
const closeBtn = document.getElementById('closeBtn');
//Listen for click
allEventsEl.addEventListener('click', openModal);
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
