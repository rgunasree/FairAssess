// Minimal placeholder trainer writing the same artifact to keep the pipeline working.
// Replace with real dataset-based training when you add data.

const fs = require('fs')
const path = require('path')

const out = path.join(__dirname, '..', 'public', 'models', 'bias-classifier.json')

const artifact = require(path.join(__dirname, '..', 'public', 'models', 'bias-classifier.json'))

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(artifact, null, 2))
console.log('Model artifact written to', out)
