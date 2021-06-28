/**
 * TODO:
 * Switch to await/async syntax
 * Add passwords and error handling (try/catch?)
 * Make helper functions getCheckedChannel and createRadiobutton
 * Maybe change name for getChannelMsgs, it prints them, too
 * Split into multiple files?
 */

const getChannels = async () => {
  await fetch('/api/channel/joined', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
}

const createChannel = async () => {
  const name = document.getElementById('channelname')

  if (name.value.length === 0) {
    return
  }

  const res = await fetch('/api/channel/create', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ channelname: name.value })
  })
  const data = await res.json()

  if (data.id) {
    const radioboxes = document.getElementById('radioboxes')

    let input = document.createElement('input')
    input.type = 'radio'
    input.name = 'channel'
    input.value = name.value
    input.id = data.id

    let label = document.createElement('label')
    label.for = data.id
    label.innerText = name.value
  
    radioboxes.parentNode.insertBefore(label, radioboxes.nextSibling)
    radioboxes.parentNode.insertBefore(input, radioboxes.nextSibling)  
  }

  name.value = ''
}

const joinChannel = async () => {
  const name = document.getElementById('channelname')

  if (name.value.length === 0) {
    return
  }

  const res = await fetch('/api/channel/join', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ channelname: name.value })
  })
  const data = await res.json()

  if (data.id) {
    const radioboxes = document.getElementById('radioboxes')

    let input = document.createElement('input')
    input.type = 'radio'
    input.name = 'channel'
    input.value = name.value
    input.id = data.id

    let label = document.createElement('label')
    label.for = data.id
    label.innerText = name.value
  
    radioboxes.parentNode.insertBefore(label, radioboxes.nextSibling)
    radioboxes.parentNode.insertBefore(input, radioboxes.nextSibling)  
  }
  name.value = ''
}

const getJoinedChannels = async () => {
  const radioboxes = document.getElementById('radioboxes')
  const response = await fetch('/api/channel/joined')
  const data = await response.json()
  console.log('data:', data)

  data.forEach(channel => {
    let input = document.createElement('input')
    input.type = 'radio'
    input.name = 'channel'
    input.value = channel.name
    input.id = channel.id
    
    let label = document.createElement('label')
    label.for = channel.id
    label.innerText = channel.name

    radioboxes.parentNode.insertBefore(label, radioboxes.nextSibling)
    radioboxes.parentNode.insertBefore(input, radioboxes.nextSibling)
  })
}

const sendMessage = async () => {
  const msg = document.getElementById('message')
  let channel = ''
  let el = document.getElementsByName('channel')

  // find checked radiobox
  for (i = 0; i < el.length; i++) {
    if (el[i].checked) {
      channel = el[i]
      console.log('channel:', channel)
      break
    }
  }

  if (msg.value.length === 0) {
    return
  }

  await fetch('/api/message/create', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: msg.value, channel: channel.id })
  })
  msg.value = ''
}

const initApp = async () => {
  getJoinedChannels()
  getChannelMsgs()
  setInterval(getChannelMsgs, 500)
}

//this could get a param which has the channel and be used as in getChannelMsgs
const getMessages = async () => {
  const messages = document.getElementById('messages')
  const response = await fetch('/api/message/all')
  const data = await response.json()
  messages.innerText = ''
  
  data.forEach(msg => {
    messages.innerText += '\n' + msg.name + ': ' + msg.text
  })
}

const getChannelMsgs = async () => {
  let channel = ''
  let el = document.getElementsByName('channel')

  // find checked radiobox
  for (i = 0; i < el.length; i++) {
    if (el[i].checked) {
      channel = el[i].id
      break
    }
  }

  if (!channel) {
    console.log('no channel picked')
    return
  }

  const response = await fetch(`/api/message/${channel}`)
  const data = await response.json()

  let messages = document.getElementById('messages')
  messages.innerText = ''

  data.forEach(msg => {
    messages.innerText += '\n' + msg.name + ': ' + msg.text + ' (' + msg.created + ')'
  })
}