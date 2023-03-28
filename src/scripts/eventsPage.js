const allEventsEl = document.querySelector('#all-events-list');

async function getAllEvents() {
    let response = await fetch('http://localhost:3000/events/all', { credentials: 'include' })

    try {
        let dat = await response.json();

        return dat;
    } catch (error) {
        return error;
    }

}

function createEventItem({ owner_id, upvotes, title, description, location }) {
    return (
        `<div class="event-item">
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

    events.forEach(event => {
        let el = createEventItem(event);

        eventElems.push(el);
    })

    element.innerHTML = eventElems.join(' ')
}

document.addEventListener('DOMContentLoaded', async () => {
    let events = await getAllEvents();

    console.log(events);

    populateEvents(allEventsEl, events)
})