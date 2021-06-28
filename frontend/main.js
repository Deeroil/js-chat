/**
 * TODO:
 * Switch to await/async syntax
 * Add passwords and error handling (try/catch?)
 * Make helper functions getCheckedChannel and createRadiobutton
 * Maybe change name for getChannelMsgs, it prints them, too
 * 
 * Lisää TODO:
 *  - ylin chatissa näytetty viesti on nyt uusin viesti, käännä toisin päin
 *  - erittele erillisiksi funktioiksi vanhojen/uusien viestien hakeminen
 *    - mm. eri endpointit uusien/vanhojen viestien hakemisiin
 *  - älä hae (vanhoja) viestejä enempää jos niitä ei ole
 *  - korjaa uuden viestin lisääminen
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
    createChannelRadiobox({ name: name.value, id: data.id })
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
    createChannelRadiobox({ name: name.value, id: data.id })
  }
  name.value = ''
}

const createChannelRadiobox = (channel) => {
  const radioboxes = document.getElementById('radioboxes')

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
}

const getJoinedChannels = async () => {
  const response = await fetch('/api/channel/joined')
  const data = await response.json()
  console.log('data:', data)

  data.forEach(channel => {
    createChannelRadiobox(channel)
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

// index 0 is the newest message
let messageHistory = []
let oldestMessageDate = ''
let prevChannel = null

const getChannelMsgs = async () => {
  let checkedChannel = ''
  let el = document.getElementsByName('channel')

  // find checked radiobox
  for (i = 0; i < el.length; i++) {
    if (el[i].checked) {
      checkedChannel = el[i].id
      break
    }
  }

  if (!checkedChannel) {
    console.log('no channel picked')
    return
  }
  
  if (checkedChannel !== prevChannel) {
    oldestMessageDate = ''
    messageHistory = []

    let messages = document.getElementById('messages')
    messages.innerText = ''
  }

  prevChannel = checkedChannel

  console.log('oldestMessageDate:', oldestMessageDate)

  const response = await fetch(`/api/message/${checkedChannel}?limit=3&offset=${oldestMessageDate}`)
  const data = await response.json()
  console.log('data:', data)

  //do I want to have some boolean for this
  if (data.length === 0) {
    return
  }

  data.forEach(msg => {
    const obj = {
      name: msg.name,
      text: msg.text,
      created: msg.created
    }

    //do I want to push or smth else?
    messageHistory.push(obj)
    console.log('messageHistory now:', messageHistory)

    oldestMessageDate = obj.created
  })

  let messages = document.getElementById('messages')

  data.forEach(msg => {
    messages.innerText += '\n' + msg.name + ': ' + msg.text + ' (' + msg.created + ')'
  })
}