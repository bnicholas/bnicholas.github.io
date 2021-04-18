const werd = "quia"

console.log(werd)

// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/nuleds/sw.js').then(function (reg) {
    if (reg.installing) { console.log('Service worker installing') }
    else if (reg.waiting) { console.log('Service worker installed') }
    else if (reg.active) { console.log('Service worker active'); }
  }).catch(function(error) {
    console.log('Registration failed with ' + error);
  });
}

let btDevice = null
const serviceUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455"
const characteristicUID = "49535343-1E4D-4BD9-BA61-23C647249616"
const scanButton = document.getElementById('scan')

scanButton.addEventListener('click', async e => {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true
  })
  const server = await device.gatt.connect()
  console.log(device)
  console.log(server)
  console.log(`BluetoothDevice.id ${device.id}`)
  console.log(`BluetoothDevice.name ${device.name}`)
  console.log(`BluetoothDevice.gatt ${device.gatt}`)
  console.log(`BluetoothDevice.uuids ${device.uuids}`)
  if (server.connected) alert(`${device.name} Connected`)
  // const service = await server.getPrimaryService('heart_rate')
  // const handleBodySensorLocationCharacteristic = await service.getCharacteristic('body_sensor_location')
  // const handleHeartRateMeasurementCharacteristic = await service.getCharacteristic('heart_rate_measurement')
})

const buttons = Array.from(document.getElementsByClassName('btn'))

buttons.forEach(b => {
  b.addEventListener('click', async e => {
    const value = e.target.value
    console.log(`BUTTON CLICK ${value}`)
  })
})
