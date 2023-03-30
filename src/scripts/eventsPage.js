const allEventsEl = document.querySelector('#all-events-list');
//Get modal element
const modal = document.getElementById('eventModal');
const closeBtn = document.getElementById('closeBtn');

let eventState = {};
let activeEvent = null;
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

async function getAllEvents() {
    let response = await fetch(' http://localhost:3000/events/a/all', { credentials: 'include' })

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
            `<div class="controls"><button data-action='admin-delete' class="btn">delete</button><button data-action='user-view' class="btn">view</button></div>`
            :
            `<div class="controls"><button data-action='user-view' class="btn">view</button></div>`
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
        element.textContent = events.error
    }

}

// define user actions
let userActionsStore = () => {
    let userActions = { view: 'user-view', delete: 'admin-delete', book: 'user-book' }

    async function deleteEvent(eventEl, event_id) {
     try {
        let response = await (await fetch(` http://localhost:3000/events/${event_id}`, { credentials: 'include', method: 'DELETE' })).json();
        eventEl.remove();
        console.log(response);
     } catch (error) {
        console.log(error);
     }
    }

    async function bookEvent(event_id) {
        console.log(`POST users/bookings/`);
        console.log({user_id: cachedUser.user_id, event_id});
    }

    return { userActions, deleteEvent, bookEvent }
}

// define modal controls 
const modalControls = (modal) => {
    
    //Function to open modal
    function openModal(data) {
        let modalTitle = modal.querySelector('p#title');
        let modalDescription = modal.querySelector('p#description');
        let modalLocation = modal.querySelector('p#location')

        modal.style.display = 'block';
        modalTitle.textContent = data.title;
        modalLocation.textContent = data.location;
        modalDescription.textContent = data.description;

        activeEvent = data.event_id;
    }

    //Function to close modal
    function closeModal() {
        activeEvent = null;
        modal.style.display = 'none';
    }

    return { openModal, closeModal }
}

let { openModal, closeModal } = modalControls(modal)

// open modal on event item click - should probably change to button similar 
allEventsEl.addEventListener('click', (e) => {
    let listItem = e.target.closest('div.event-item');

    if (listItem) {
        let selectedItem = eventState[listItem.dataset.index]
        let button = e.target.closest('button');

        if (button) {
            let clickData = { item: selectedItem.event_id, action: button.dataset.action }
            let { userActions, deleteEvent } = userActionsStore()

            switch (clickData.action) {
                case userActions.view:
                    openModal(selectedItem)
                    break;

                case userActions.delete:
                    deleteEvent(listItem, selectedItem.event_id)
                    break;

                default:
                    break;
            }
            console.log(clickData);
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

modal.addEventListener('click', async (e) => {
    let button = e.target.closest('button');
    
    if(button) {
        let { bookEvent } = userActionsStore();

        await bookEvent(activeEvent);
    }
})

//Listen for modal click
closeBtn.addEventListener('click', closeModal);