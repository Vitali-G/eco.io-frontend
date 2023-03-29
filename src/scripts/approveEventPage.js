const allEventsEl = document.querySelector('#all-events-list');

let eventState = {};
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'))

// user actions
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
            let response = await fetch(`http://localhost:3000/events/v/${event_id}`, options);

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
            let response = await (await fetch(`http://localhost:3000/events/a/${event_id}`, options)).json();
            return response
        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    return { upvoteEvent, approveEvent, userActions }
}

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
            <div class="stat" id="votes">
            <i class="fas fa-vote-yea"></i>
            ${upvotes}
            </div>

           
            ${cachedUser.isAdmin ?
            `<div class="admin-controls">
                    <button data-action='admin-approve'>approve</button>
                    <button data-action='user-view'>view</button>
                </div>`
            :
            `<div class="user-controls">
                    <button data-action='user-upvote'>upvote</button>
                    <button data-action='user-view'>view</button>
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
    let { userActions, approveEvent, upvoteEvent } = userActionStore();

    // find if an item was selected
    let listItem = e.target.closest('div.event-item');

    if (listItem) { // if item clicked
        // find out which item was clicked
        let selectedItem = eventState[listItem.dataset.index];

        // find if there was a button clicked
        let selectedButton = e.target.closest('button');

        if (selectedButton) { // if button was clicked

            // build the clickData from the user's interactions thusfar
            let clickData = { item: selectedItem.event_id, action: selectedButton.dataset.action }

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

                // if the user is a normal user, upvote the event
                case userActions.view:
                    console.log(selectedItem);
                    break;

                default:
                    break;
            }
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
