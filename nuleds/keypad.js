
const status = ["Scanning", "Stopped Scanning", "Connecting", "Connected", "Disconnected"]


const isDeviceConnected = () => {

}

const scanForDevices = () => {

}

const selectDevice = () => {

}


ButtonConnect.Click

ButtonScan.Click

ButtonStopScan.Click

BluetoothLE1.DeviceFound

BluetoothLE1.Connected

BluetoothLE1.Disconnected

ButtonDisconnect.Click

const serviceUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455"
const characteristicUID = "49535343-1E4D-4BD9-BA61-23C647249616"
const buttonCommands = {
  scan: "",
  stopScan: "",
  connect: "",
  disconnect: "",
  send: "",
  pb1: "(EE_6BC,32,PB1SC)\r\n",
  pb2: "(EE_6BC,32,PB2SC)\r\n",
  pb3: "(EE_6BC,32,PB3SC)\r\n",
  pb4: "(EE_6BC,32,PB4SC)\r\n",
  pb5: "(EE_6BC,32,PB5SC)\r\n",
  pb6: "(EE_6BC,32,PB6SC)\r\n",
}
