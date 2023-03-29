const leaderboardElem = document.querySelector('#leaderboard');

let users = [
    { username: 'stef', isAdmin: true },
    { username: 'bob', isAdmin: false },
    { username: 'josh', isAdmin: false },
    { username: 'steve', isAdmin: true }
]

function createUserItem({ username, isAdmin }) {
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
                <p>124</p>
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

document.addEventListener('DOMContentLoaded', () => {
    populateLeaderboard(users)
})
