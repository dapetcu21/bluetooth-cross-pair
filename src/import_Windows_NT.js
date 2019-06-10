const fs = require('fs').promises
const path = require('path')
const { spawn } = require('child_process')

const formatKey = key => key.toLowerCase().match(/[0-9a-f][0-9a-f]/g).reverse().join(',')

const formatEntry = ({ deviceAddress, adapterAddress, pairingKey }) =>
  `"${deviceAddress}"=hex:${formatKey(pairingKey)}`

module.exports = async function (entries) {
  const adapters = {}
  entries.forEach((entry) => {
    adapters[entry.adapterAddress] = adapters[entry.adapterAddress] || []
    adapters[entry.adapterAddress].push(entry)
  })
  const header = "Windows Registry Editor Version 5.00\r\n\r\n"
  const regData = header + Object.keys(adapters).map(adapterAddress => (
    `[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\BTHPORT\\Parameters\\Keys\\${adapterAddress}]\r\n` +
    adapters[adapterAddress].map(formatEntry).join('\r\n')
  )).join('\r\n')

  const pathname = path.resolve('output.reg')
  await fs.writeFile(pathname, regData, 'utf-8')
  spawn('psexec', ['-s', '-i', 'regedit.exe', pathname], {
    stdio: 'inherit'
  })
}
