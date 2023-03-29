const allEventsEl = document.querySelector('#all-events-list');
//Get modal element
const modal = document.getElementById('eventModal');
const closeBtn = document.getElementById('closeBtn');

let eventState = {};
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

console.log(cachedUser);

async function getAllEvents() {
    let response = await fetch('http://localhost:3000/events/a/all', { credentials: 'include' })

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
        element.textContent = events.error
    }

}

allEventsEl.addEventListener('click', (e) => {
    let listItem = e.target.closest('div.event-item');

    if (listItem) {
        console.log(eventState[listItem.dataset.index]);
        openModal(eventState[listItem.dataset.index])
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

//Function to open modal
function openModal(data) {
    const modalTitle = modal.querySelector('p#title');
    const modalDescription = modal.querySelector('p#description');
    const modalLocation = modal.querySelector('p#location');
    modal.style.display = 'block';
    modalTitle.textContent = data.title;
    modalLocation.textContent = data.location;
    modalDescription.textContent = data.description;
}
//Listen for click
closeBtn.addEventListener('click', closeModal);
//Function to close modal
function closeModal() {
    modal.style.display = 'none';
}
