export const userHelper = {
    register,
    login,
    logout
}


const url = process.env.REACT_APP_API_URL

function register(user) {

  const data = {
    "query": `mutation {signup(user:${user}){id handle email guest}}`
  }

  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  }

  return fetch(url,requestOptions)
  .then(response => response.json())
  .catch(err => console.log(err))
  .then(response => {
    if(!response.data){
      throw new Error(response.errors[0].message)
    }else{
      return response
    }
  })
  .then(response => {
    const user = {
      data: response.data.login.user,
    }
    
    // -------- Do stuff here ----------

  })
  .catch(err => console.log(err))
}



function login(email, password) {

    const data = {
      "query": `mutation {login(user:{email:"${email}" password:"${password}"}) {user{id handle email guest} jwt} }`
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
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(response => {
      if(!response.data){
        throw new Error(response.errors[0].message)
      }else{
        jwt = response.data.login.jwt
        return response
      }
    })
    .then(response => {

      const user = {
          data: response.data.login.user,
          token: jwt
      }
      localStorage.setItem('user', JSON.stringify(user));
    })
    .catch(err => console.log(err))
}

function guestLogin(){

  const data = {
    "query": "mutation {guest{user{id handle email guest} jwt}}"
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }

  var jwt
    return fetch(url, requestOptions)
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(response => {
      if(!response.data){
        throw new Error(response.errors[0].message)
      }else{
        jwt = response.data.login.jwt
        return response
      }
    })
    .then(response => {

      const user = {
          data: response.data.login.user,
          token: jwt
      }
      localStorage.setItem('user', JSON.stringify(user));
    })
    .catch(err => console.log(err))

}

function logout() {
    localStorage.removeItem('user');
}