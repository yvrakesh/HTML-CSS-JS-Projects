const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)

        createUserCard(data)
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No profile with this username')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data)
    } catch(err) {
        createErrorCard('Problem fetching repos')
    }
}

function createUserCard(user) {
    var str1 = user.location
    str1 = str1.replaceAll(",",", ")
    const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>${user.bio}</p>
      <ul>
        <li><a href = "${user.html_url}?tab=followers" target="_blank">${user.followers} <strong>Followers</strong></a></li>
        <li><a href = "${user.html_url}?tab=following" target="_blank">${user.following} <strong>Following</strong></a></li>
        <li><a href = "${user.html_url}?tab=repositories" target="_blank">${user.public_repos} <strong>Repos</strong></a></li>
        <li><a href = "${user.html_url}?tab=stars" target="_blank">${user.public_gists} <strong>Stars</strong></a></li>
      </ul>
      <ul>
        <!-- <li><a href = "mailto:${user.email}"><strong>Email:</strong>${user.email}</a></li> -->
        <li><a><strong>Location: &nbsp</strong>${str1}</a></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
    `
    main.innerHTML = cardHTML
    
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 20)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})