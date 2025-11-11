const fs = require('fs')
const path = require('path')

function sigmoid(x){return 1/(1+Math.exp(-x))}

const modelPath = path.join(__dirname, '..', 'public', 'models', 'bias-classifier.json')
const art = JSON.parse(fs.readFileSync(modelPath, 'utf8'))

function tokenize(text){
  const TOKEN_SPLIT = /[^\p{L}\p{N}']+/u
  return text.toLowerCase().split(TOKEN_SPLIT).filter(Boolean)
}

function predict(tokens){
  const vocabIndex = new Map(art.vocab.map((t,i)=>[t,i]))
  const vec = new Array(art.vocab.length).fill(0)
  for(const t of tokens){
    const idx = vocabIndex.get(t)
    if(idx !== undefined) vec[idx] += 1
  }
  const scores = []
  for(let i=0;i<art.labels.length;i++){
    let z = (art.bias && art.bias[i]) || 0
    const w = art.weights[i]
    for(let j=0;j<w.length;j++) z += (w[j]||0)* (vec[j]||0)
    scores.push(sigmoid(z))
  }
  return {labels: art.labels, scores}
}

const samples = [
  "We seek an aggressive, energetic digital native for our startup.",
  "We are looking for a tech-savvy, experienced professional with strong communication skills.",
  "We prefer a native English speaker with clear communication skills.",
  "We value a diverse, experienced team; applicants with disabilities are encouraged to apply.",
]

for(const s of samples){
  const tokens = tokenize(s)
  const res = predict(tokens)
  console.log('\nSentence:', s)
  res.labels.forEach((l,i)=>{
    if(res.scores[i] > 0.4) console.log(`  ${l}: ${res.scores[i].toFixed(3)}`)
  })
}
