import { copyFile, mkdir } from 'node:fs/promises'

const projectRoot = new URL('../', import.meta.url)
const compiledWorker = new URL('../dist/muq_hussain_portfolio/index.js', import.meta.url)
const serverDirectory = new URL('../dist/server/', import.meta.url)
const serverEntrypoint = new URL('../dist/server/index.js', import.meta.url)

await mkdir(serverDirectory, { recursive: true })
await copyFile(compiledWorker, serverEntrypoint)

console.log(`Staged Cloudflare Worker entrypoint for Sites from ${projectRoot.pathname}`)
