const leaderboardElem = document.querySelector('#leaderboard');

async function getTopUsers() {
    try {
        let response = await (await fetch(' http://localhost:3000/users/top')).json();
        return response;
    } catch (error) {
        console.log(error);
        return { error }
    }
}

function createUserItem({ username, isAdmin, events_attended }) {
    return (
        `<div class="user-item">
        <div class="user-header">
            <div class="user-header-tag">
                <h2>${username}</h2>
            </div>

            ${isAdmin ? `<div class="admin-tag">admin</div>` : ''}
        </div>

        <div class="item-spacer"></div>

        <div class="user-body">
            <div class="stat">
                <i class="fa fa-ticket" aria-hidden="true"></i>
                <p>${events_attended}</p>
            </div>
        </div>
    </div>`
    )
}

function populateLeaderboard(users) {
    let usersEls = [];

    users.forEach((event, i) => {
        let el = createUserItem(event, i);
        usersEls.push(el);
    })

    leaderboardElem.innerHTML = usersEls.join(' ')
}

document.addEventListener('DOMContentLoaded', async () => {
    let users = await getTopUsers();

    if(users.error) {
        console.log(users.error);
    }else {

        populateLeaderboard(users)
    }
})
