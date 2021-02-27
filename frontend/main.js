const createUser = () => {
  const username = document.getElementById("username").value
  fetch('/api/account/create', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username })
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

const login = () => {
  const username = document.getElementById("username").value
  fetch('/api/account/login', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username })
  })
    .then(res => {
      console.log('login res', res)
      // res.json() //tää valitti että unexpected end of JSON input
    })
    .then(res => console.log(res))
}

const logout = () => {
  fetch('/api/account/logout', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  })
  .then(res => {
    console.log('logout res', res)
    res.json()
  })
    .then(res => console.log(res))
}