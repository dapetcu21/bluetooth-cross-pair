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

async function main() {
  const command = process.argv[2]
  switch (command) {
    case "export": {
      const exportFunc = platformCommand('export')
      const results = []
      for (let i = 3; i < process.argv.length; i++) {
        const mac = process.argv[i].replace(/[^0-9a-fA-F]/g, '').toLowerCase()
        results.push(await exportFunc(mac))
      }
      if (!results.length) {
        throw new Error('At least one MAC address must be provided')
      }
      const data = JSON.stringify(results, null, 2)

      process.stdout.write(data, 'utf-8')
      break
    }

    case "import": {
      const importFunc = platformCommand('export')
      const filename = process.argv[3]
      if (!filename) {
        throw new Error('Second argument needs to be a filename')
      }
      const data = await fs.readFile(filename, 'utf-8')
      await importFunc(JSON.parse(data))
      break
    }

    default: {
      throw new Error('Invalid command')
    }
  }
}

main().catch(err => {
  console.error(err)
})

