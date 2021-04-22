// navigator.serviceWorker.register('/nuleds/sw.js', {
//   scope: '/nuleds/'
// })

let debounce
const encoder = new TextEncoder()
const serviceUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455"
const characteristicUID = "49535343-1e4d-4bd9-ba61-23c647249616"
const onHard = "(NC_Z0A255R255G255B255W255F0)"
const offHard = "(NC_Z0A255R0G0B0W0F0)"

const micButton = document.getElementById('micButton')

function sendCommand() {
  debounce = setTimeout(() => {
    nu.char.writeValue(encoder.encode(nu.command))
  }, 100)
}

const nu = new Proxy({on: true}, {
  set: function (obj, prop, value) {
    obj[prop] = value
    if (prop === "command") {
      clearTimeout(debounce)
      sendCommand()
    }
    return true
  }
})

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const commands = ['on', 'off', 'fast', 'slow', 'dimmer', 'brighter', 'darker', 'lighter', 'bam', 'bang', 'skadoosh', 'shazam']
const toggleCommands = ['bam', 'bang', 'skadoosh', 'shazam']
const grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;'
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector('.output')
const bg = document.querySelector('html')
const hints = document.querySelector('.hints')

recognition.onresult = function(event) {
  const command = event.results[0][0].transcript
  const howSure = event.results[0][0].confidence
  const cmd = command.toLowerCase()
  if (toggleCommands.includes(cmd)) {
    console.log(`Should Send a Toggle ... nu.on = ${nu.on}`)
    nu.command = nu.on ? offHard : onHard
    nu.on = !nu.on
  }
  if (cmd === "off") {
    nu.command = offHard
    nu.on = false
  }
  if (cmd === 'on') {
    nu.command = onHard
    nu.on = true
  }
  diagnostic.textContent = `Result received: ${command}`;
  console.log(`Confidence: ${howSure}`);
  micButton.className = "enabled"

}
recognition.onspeechend = function() {
  recognition.stop();
}
recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that command.";
}
recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}



const handleScan = async e => {
  if (!navigator.bluetooth) alert('NO WEB BLE')
  nu.device = await navigator.bluetooth.requestDevice({
    optionalServices: [serviceUID],
    acceptAllDevices: true
  })
  nu.server = await nu.device.gatt.connect()
  if (nu.server.connected) {
    console.log(`${nu.device.name} Connected`)
    nu.service = await nu.server.getPrimaryService(serviceUID)
    nu.char = await nu.service.getCharacteristic(characteristicUID)
    const buttons = Array.from(document.getElementsByClassName('btn'))
    buttons.forEach(b => {
      b.addEventListener('dblclick', () => {
        nu.command = nu.on ? offHard : onHard
        nu.on = !nu.on
        console.log(`CLICK ${nu.command}`)
      })
      b.addEventListener('click', e => {
        nu.on = e.target.className.includes('offBtn') ? false : true
        nu.command = e.target.value
        console.log(`CLICK ${nu.command}`)
      })
    })

    hints.innerHTML = '<blockquote>Click the Mic to speak command. Ive only loosely accounted for ON, OFF, BAM, BANG, SKADOOSH & SHAZAM ... the logic is all still rough. If you start with OFF or ON, the other toggle commands will work in proper sync.</blockquote>'


    micButton.className = 'enabled'
    micButton.addEventListener('click', () => {
      recognition.start()
      micButton.className = 'active'
      console.log('Ready to receive a color command.')
    })
  }
}

// SCAN BUTTON EVENT
const scanButton = document.getElementById('scan')
scanButton.addEventListener('click', handleScan)
