export const userHelper = {
    register,
    login,
    guestLogin,
    logout
}


const url = process.env.REACT_APP_API_URL

function requestOptions(data){
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
}

function register(user) {

  const {handle, email, password} = user
  const data = {
    "query": `mutation {signup(user:{handle:"${handle}" email:"${email}" password:"${password}"}){id handle email guest}}`
  }

  return fetch(url,requestOptions(data))
  .then(response => response.json())
  .catch(error => console.log(error))
  .then(response => {
    if(!response.data){
      throw new Error(response.errors[0].message)
    }else{
      return response
    }
  })
  .catch(error => console.log(error))
  .then(response => {
    const user = {
      data: response.data.signup.user,
    }
    
    // -------- Do stuff here ----------

  })
}

function login(email, password) {

    const data = {
      "query": `mutation {login(user:{email:"${email}" password:"${password}"}) {user{id handle email guest} jwt} }`
    }

    var jwt
    
    return fetch(url, requestOptions(data))
    .then(response => response.json())
    .catch(error => console.log(error))
    .then(response => {
      if(!response.data){
        throw new Error(response.errors[0].message)
      }else{
        jwt = response.data.login.jwt
        return response
      }
    })
    .catch(error => console.log(error))
    .then(response => {
      const user = {
          data: response.data.login.user,
          token: jwt
      }
      localStorage.setItem('user', JSON.stringify(user));
    })
}

function guestLogin(){
  const data = {
    "query": "mutation {guest{user{id handle email guest} jwt}}"
  }

  var jwt
  return fetch(url, requestOptions(data))
  .then(response => response.json())
  .catch(error => console.log(error))
  .then(response => {
    if(!response.data){
      throw new Error(response.errors[0].message)
    }else{
      jwt = response.data.guest.jwt
      return response
    }
  })
  .catch(error => console.log(error))
  .then(response => {
    const user = {
        data: response.data.guest.user,
        token: jwt
    }
    localStorage.setItem('user', JSON.stringify(user));
  })
}

function logout() {
    localStorage.removeItem('user');
}