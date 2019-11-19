function requestOptions(data){
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }
}

const url = process.env.REACT_APP_API_URL

export function registerRequest(user) {
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
  })
}
