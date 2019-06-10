const fs = require('fs').promises
const { spawn } = require('child_process')

const formatMAC = s => s.toUpperCase().match(/[0-9A-F][0-9A-F]/g).join(':')
const formatKey = key => key.toUpperCase().match(/[0-9A-F][0-9A-F]/g).reverse().join('')

async function writeConfig(config) {
  const filename = `/var/lib/bluetooth/${formatMAC(config.adapterAddress)}/${formatMAC(config.deviceAddress)}/info`
  let data = await fs.readFile(filename, 'utf-8')
  data = data.replace(/Key=[0-9A-Fa-f]+/, `Key=${formatKey(config.pairingKey)}`)
  await fs.writeFile(filename, data, 'utf-8')
}

module.exports = async function (entries) {
  for (let i = 0; i < entries.length; i++) {
    await writeConfig(entries[i])
  }
  spawn('/etc/init.d/bluetooth', ['restart'], {
    stdio: 'inherit'
  })
}
