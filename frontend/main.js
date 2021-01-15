const createUser = () => {
  const username = document.getElementById("username").value
  fetch('/api/user/create', {
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
  fetch('/api/user/login', {
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