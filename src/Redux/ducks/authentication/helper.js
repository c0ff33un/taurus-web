export const userHelper = {
  login,
  guestLogin,
  logout
}

function requestOptions(data){
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
}

const url = process.env.REACT_APP_API_URL

function login(email, password) {

  const data = {
    "query": `mutation {confirmation(user:{email:"${email}" password:"${password}"}) {user{id handle email guest} jwt} }`
  }

  var jwt
  
  return fetch(url, requestOptions(data))
  .then(response => response.json())
  .catch(error => {throw new Error(error)})
  .then(response => {
    if (!response.data) {
      throw new Error(response.errors[0].message)
    } else {
      jwt = response.data.login.jwt
      return response
    }
  })
  .catch(error => {throw new Error(error)})
  .then(response => {
    return {
        data: response.data.login.user,
        token: jwt
    }
  })
}

function guestLogin(){
  const data = {
    "query": "mutation {guest{user{id handle email guest} jwt}}"
  }
  var jwt
  return fetch(url, requestOptions(data))
  .then(response => response.json())
  .then(response => {
    if (!response.data) {
      throw new Error(response.errors[0].message)
    } else{
      jwt = response.data.guest.jwt
      return response
    }
  })
  .then(response => {
    return {
        data: response.data.guest.user,
        token: jwt
    }
  })
  .catch(error => console.log(error))
}

function logout(token) {
  const mutation = {
    "query": `mutation {logout{msg}}`
  }
  var options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify(mutation),
  }

  return fetch(url,options)
  .then(response => {
    response.json()
  })
  .catch(error => {throw new Error(error)})
}
