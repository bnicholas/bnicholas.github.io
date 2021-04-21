// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/nuleds/sw.js', {
    scope: '/nuleds/'
  }).then(function (reg) {
    if (reg.installing) {
      console.log('Service worker installing')
    } else if (reg.waiting) {
      console.log('Service worker installed')
    } else if (reg.active) {
      console.log('Service worker active');
    }
  }).catch(function (error) {
    console.log('Registration failed with ' + error);
  });
}

const encoder = new TextEncoder()
const serviceUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455"
const characteristicUID = "49535343-1e4d-4bd9-ba61-23c647249616"
const onHard = "(NC_Z0A255R255G255B255W255F0)"
const _onHard = encoder.encode(onHard)
const offHard = "(NC_Z0A255R0G0B0W0F0)"
const _offHard = encoder.encode(offHard)
const nuBlu = { server: null, device: null }

const handleScan = async e => {
  if (!navigator.bluetooth) alert('NO WEB BLE')
  nuBlu.device = await navigator.bluetooth.requestDevice({
    optionalServices: [serviceUID],
    acceptAllDevices: true
  })
  nuBlu.server = await nuBlu.device.gatt.connect()
  if (nuBlu.server.connected) {
    alert(`${nuBlu.device.name} Connected`)
    nuBlu.service = await nuBlu.server.getPrimaryService(serviceUID)
    nuBlu.char = await nuBlu.service.getCharacteristic(characteristicUID)
    nuBlu.onHard = () => nuBlu.char.writeValue(_onHard)
    nuBlu.offHard = () => nuBlu.char.writeValue(_offHard)

    // ADD EVENTS TO ALL THE SCENE BUTTONS
    const buttons = Array.from(document.getElementsByClassName('btn'))
    buttons.forEach(b => {
      b.addEventListener('click', async e => {
        const value = encoder.encode(e.target.value)
        nuBlu.char.writeValue(value)
        console.log(`BUTTON CLICK ${value}`)
      })
    })
  }
}

// SCAN BUTTON EVENT
const scanButton = document.getElementById('scan')
scanButton.addEventListener('click', handleScan)
