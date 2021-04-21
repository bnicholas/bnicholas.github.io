// navigator.serviceWorker.register('/nuleds/sw.js', {
//   scope: '/nuleds/'
// })

let debounce
const encoder = new TextEncoder()
const serviceUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455"
const characteristicUID = "49535343-1e4d-4bd9-ba61-23c647249616"
const onHard = "(NC_Z0A255R255G255B255W255F0)"
const offHard = "(NC_Z0A255R0G0B0W0F0)"

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
  }
}

// SCAN BUTTON EVENT
const scanButton = document.getElementById('scan')
scanButton.addEventListener('click', handleScan)
