const bplist = require('bplist-parser');
const fs = require('fs').promises

const normalizeMAC = (mac) => mac.replace(/[^0-9A-Fa-f]/g, '').toLowerCase()

module.exports = async function (deviceAddress) {
  const plistFilename = '/private/var/root/Library/Preferences/com.apple.bluetoothd.plist'
  const data = await new Promise((resolve, reject) => {
    bplist.parseFile(plistFilename, (err, data) => {
      if (err) { reject(err) }
      resolve(data)
    })
  })

  let foundAdapterMAC
  let foundKey

  for (let adapterMAC in data[0].LinkKeys) {
    const adapter = data[0].LinkKeys[adapterMAC]
    for (let deviceMAC in adapter) {
      if (normalizeMAC(deviceMAC) === deviceAddress) {
        foundKey = adapter[deviceMAC]
        foundAdapterMAC = adapterMAC
        break
      }
    }
    if (foundKey) { break }
  }

  if (!foundKey) {
    throw new Error(`Cannot find device with MAC ${deviceAddress}`)
  }

  return {
    deviceAddress,
    adapterAddress: normalizeMAC(foundAdapterMAC),
    pairingKey: foundKey.toString('hex'),
  }
}