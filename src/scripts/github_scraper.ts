// const response = await fetch(
//     'https://api.github.com/users/Migalha0/repos?per_page=100'
// )

// const repos = await response.json()

// // console.log(repos[2])

// repos.forEach(repo => {
//     console.log(`${repo.name} | ${repo.description} | ${repo.html_url} | ${repo.visibility} | ${repo.language}`
//     )
//     console.log('---------------')
// })

export async function getRepos() {
    const response = await fetch(
        'https://api.github.com/users/Migalha0/repos?per_page=100'
    )

    if (!response.ok) {
        throw new Error('Failed to fetch repositories')
    }

    return response.json()
}