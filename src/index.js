#!/usr/bin/env node

const os = require('os')
const fs = require('fs').promises

function platformCommand(command) {
  const osType = os.type()
  let commandFunc;
  try {
    commandFunc = require(`./${command}_${osType}`)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Command "${command}" not supported yet on ${osType}`)
    }
    throw err
  }
  return commandFunc
}

function usage() {
  console.log('bluetooth-cross-pair export <key_file> <MAC1> [<MAC2>] [<MAC3>] ... ')
  console.log('  Exports the Bluetooth keys for client devices identified by <MAC1>, <MAC2>, etc. to file <key_file>')
  console.log('bluetooth-cross-pair import <key_file>')
  console.log('  Imports the Bluetooth keys from the <key_file> file')
}

async function main() {
  const command = process.argv[2]
  switch (command) {
    case "export": {
      const exportFunc = platformCommand('export')
      const filename = process.argv[3]
      if (!filename) {
        throw new Error('An output filename must be provided')
      }

      const results = []
      for (let i = 4; i < process.argv.length; i++) {
        const mac = process.argv[i].replace(/[^0-9a-fA-F]/g, '').toLowerCase()
        results.push(await exportFunc(mac))
      }
      if (!results.length) {
        throw new Error('At least one MAC address must be provided')
      }

      const data = JSON.stringify(results, null, 2)
      await fs.writeFile(filename, data, 'utf-8')
      break
    }

    case "import": {
      const importFunc = platformCommand('import')
      const filename = process.argv[3]
      if (!filename) {
        throw new Error('Second argument needs to be a filename')
      }
      const data = await fs.readFile(filename, 'utf-8')
      await importFunc(JSON.parse(data))
      break
    }

    default: {
      usage()
      break
    }
  }
}

main().catch(err => {
  console.error(err)
})
