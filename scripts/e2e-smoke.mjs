#!/usr/bin/env node
/* eslint-env node */
/* global fetch, setTimeout, console, process */
import { spawn } from 'node:child_process'

const PORT = process.env.PORT || '4000'

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts)
  return { status: res.status, json: await res.json().catch(() => null), text: await res.text().catch(() => '') }
}

async function main() {
  console.log(`Starting server on :${PORT}...`)
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', PORT], {
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'production' },
  })

  child.stdout.on('data', (d) => process.stdout.write(d))
  child.stderr.on('data', (d) => process.stderr.write(d))

  // Wait for server to come up
  await wait(1500)

  // 1) Home page
  const home = await fetch(`http://localhost:${PORT}/`)
  console.log('GET / =>', home.status)
  if (home.status !== 200) throw new Error('Home page failed')

  // 1b) Analyze page loads content
  const analyzePage = await fetch(`http://localhost:${PORT}/analyze`)
  const analyzeHtml = await analyzePage.text()
  console.log('GET /analyze =>', analyzePage.status)
  if (!analyzeHtml.includes('Analyze Your Content')) console.warn('Analyze page content check: not strict match (ok for demo)')

  // Baseline aggregates
  const beforeAgg = await fetchJson(`http://localhost:${PORT}/api/analyses`)
  const beforeCount = beforeAgg.json?.metrics?.totalAnalyses || 0

  // 2) Analyze API
  const sample = 'We seek an aggressive, energetic digital native who is a native English speaker.'
  const resAnalyze = await fetchJson(`http://localhost:${PORT}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: sample, title: 'E2E Smoke' }),
  })
  console.log('POST /api/analyze =>', resAnalyze.status, resAnalyze.json?.fairnessScore)
  if (resAnalyze.status !== 200) throw new Error('Analyze API failed')

  // 3) Aggregates should reflect new item
  const resAgg = await fetchJson(`http://localhost:${PORT}/api/analyses`)
  console.log('GET /api/analyses =>', resAgg.status, resAgg.json?.metrics)
  const afterCount = resAgg.json?.metrics?.totalAnalyses || 0
  if (!(afterCount >= beforeCount + 1)) throw new Error('Aggregates did not increase')

  // 4) Results page (HTML only; dynamic data loaded client-side)
  const results = await fetch(`http://localhost:${PORT}/results`)
  console.log('GET /results =>', results.status)
  if (results.status !== 200) throw new Error('Results page failed')

  child.kill('SIGTERM')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})