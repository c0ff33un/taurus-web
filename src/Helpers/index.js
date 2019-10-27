export const userHelper = {
    register,
    login,
    logout
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

function login(email, password) {

    const url = 'http://localhost:3000/login'

    const data = {
        user : { 
            email: email,
            password: password
        }
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        "Accept": "appplication/json",
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    }

    var jwt
    return fetch(url, requestOptions)
    .then(response => {
      if (response.status !== 201){
        throw new Error(response.status)
      }else{
        jwt = response.headers.get('Authorization')
        return response.json()
      }
    })
    .catch(console.error)
    .then(response => {
        const user = {
            data: response,
            token: jwt
        }
        localStorage.setItem('user', JSON.stringify(user));
    })
}

function logout() {
    localStorage.removeItem('user');
}