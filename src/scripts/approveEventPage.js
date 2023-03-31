// get the events list element
const allEventsEl = document.querySelector('#all-events-list');

// setting page state - eventsList state + cachedUser
let eventState = {};
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

// define user actions
const userActionStore = () => {
    let userActions = {
        upvote: 'user-upvote',
        approve: 'admin-approve',
        view: 'user-view'
    }
    // fix - user can vote multiple times
    async function upvoteEvent(selectedItem, event_id) {
        let payload = JSON.stringify({ vote: 1 });

        let options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload,
            credentials: 'include'
        };

        try {
            let response = await fetch(` http://localhost:3000/events/v/${event_id}`, options);

            let votesEl = selectedItem.querySelector('div.stat#votes')

            if (votesEl) {
                let votes = parseInt(votesEl.textContent);

                votesEl.innerHTML = `<i class="fas fa-vote-yea"></i> ${votes + 1}`;
            }

            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async function approveEvent(event_id) {
        let options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ approval: true }),
            credentials: 'include'
        };

        try {
            let response = await (await fetch(` http://localhost:3000/events/a/${event_id}`, options)).json();
            return response
        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    return { upvoteEvent, approveEvent, userActions }
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
    }

    //Function to close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    return { openModal, closeModal }
}

// function to call for events from server
async function getAllEvents() {
    let response = await fetch(' http://localhost:3000/events/all', { credentials: 'include' })

    try {
        let dat = await response.json();

        // fill eventState for eventsList click listener { indexOfEvent: number, }
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

// create string representations of the events 
function createEventItem({ upvotes, title, location }, index) {
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
            <div class="stat" id="votes">
            <i class="fas fa-vote-yea"></i>
            ${upvotes}
            </div>

           
            ${cachedUser.isAdmin ?
            `<div class="controls">
                    <button data-action='admin-approve' class="btn">approve</button>
                    <button data-action='user-view' class="btn">view</button>
                </div>`
            :
            `<div class="controls">
                    <button data-action='user-upvote' class="btn">upvote</button>
                    <button data-action='user-view' class="btn">view</button>
                </div>`
        }
        </div>
    </div>`
    )
}

// populate the event element with the string representation of the events, converting them to html
function populateEvents(element, events) {
    let eventElems = [];

    if (events.length) {
        events.forEach((event, i) => {
            let el = createEventItem(event, i);
            eventElems.push(el);
        })

        element.innerHTML = eventElems.join(' ')
    } else {
        element.textContent = events.message || events.error
    }

}

//Get modal element + close button
const modal = document.getElementById('eventModal');
const closeBtn = document.getElementById('closeBtn');

// invoke modalControls on selected modal element;
let { closeModal, openModal } = modalControls(modal);

// list event listener, determines type of action and conditionally renders controls based on account type
allEventsEl.addEventListener('click', (e) => {
    // find if an item was selected
    let listItem = e.target.closest('div.event-item');
    if (!listItem) return;

    // find out which item was clicked
    let selectedItem = eventState[listItem.dataset.index];

    // find if there was a button clicked
    let selectedButton = e.target.closest('button');
    if (!selectedButton) return;

    // build the clickData from the user's interactions thusfar and initialise the userActionStore
    let clickData = { item: selectedItem.event_id, action: selectedButton.dataset.action }
    let { userActions, approveEvent, upvoteEvent } = userActionStore();

    switch (clickData.action) { // depending on the user action
        // if the user is an admin approve the event
        case userActions.approve:
            approveEvent(clickData.item);
            listItem.remove();
            break;

        // if the user is a normal user, upvote the event
        case userActions.upvote:
            upvoteEvent(listItem, clickData.item);
            break;

        // if the user action is view, populate modal with selected item
        case userActions.view:
            openModal(selectedItem);
            break;

        default:
            break;
    }
})

// on pageload, populate events, if it doesn't work redirect user to login.
document.addEventListener('DOMContentLoaded', async () => {
    let events = await getAllEvents();

    if (events.message) return window.location.assign('/login.html');

    populateEvents(allEventsEl, events)
})

// listen for closeModal
closeBtn.addEventListener('click', closeModal);

