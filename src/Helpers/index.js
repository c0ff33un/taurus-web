export const userHelper = {
    register
}

function register(user) {

    const url = 'http://localhost:3000/signup'

    const data = {
        user: user
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    return fetch(url,requestOptions)
        .then(res => res.json())
        .catch(error=> console.log('Error:', error))
        .then( response => console.log('Success', response))
}