const allEventsEl = document.querySelector('#top-three-events-list');
//Get modal element

let eventState = {};
let activeEvent = null;
let cachedUser = JSON.parse(localStorage.getItem('cachedUser'));

async function getTopThree() {
    let response = await fetch('http://localhost:3000/home', { credentials: 'include' })
    console.log(response)
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

        element.innerHTML = eventElems.join(' ');
    } else {
        element.textContent = events.error
    }

}


document.addEventListener('DOMContentLoaded', async () => {
    let events = await getTopThree();

    console.log(events);
    
    populateEvents(allEventsEl, events)

})
