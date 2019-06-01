const express = require('express')
const app = express()

function screenshot(url) {
  // TODO: 1. Kita harus tau halaman APA SAJA YANG BERUBAH Next.js. e.g: `pages/`
  // Bisa dengan cara "kasih pilihan route apa saja yang ingin di compare"
}

function collectArtifacts() {}

app.get('/', (req, res) => {
  req.send({ hello: 'world' })
})

app.post('/reports/:namespace/:url', (req, res) => {
  // ketika ada post ke endpoint ini
  // https://laurete.dev/rin.rocks/rin-aec777.now.sh
  // https://rin.rocks (production) <--> https://rin-aec777.now.sh (new commit)
  // running service kita (compare current url)

  screenshot(req.params.url)
})

app.get('/reports/:namespace/:url', (req, res) => {
  console.log(req.params.namespace, req.params.url)
})

app.listen(1337)
