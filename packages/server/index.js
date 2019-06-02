// const chromium = require('chrome-aws-lambda')
// const puppeter = require('puppeteer-core')

const puppeter = require('puppeteer')
const DataStore = require('nedb')
const express = require('express')

const db = new DataStore({ filename: './development.db', autoload: true })
const dfs = new DataStore({ filename: './fs.development.db', autoload: true })

const app = express()

async function screenshot(url) {
  // TODO: Validate url
  url = 'https://' + url

  // if (process.env.NODE_ENV === 'production') {
  //   const browser = await puppeteer.launch({
  //     args: chromium.args,
  //     executablePath: await chromium.executablePath,
  //     headless: chromium.headless
  //   })
  // } else {
  const browser = await puppeter.launch()
  // }

  const page = await browser.newPage()
  await page.goto(url)

  const screenshot = await page.screenshot({ fullPage: true })
  await browser.close()

  const screenshoted = await Buffer.from(screenshot).toString('base64')

  return screenshoted
}

function collectArtifacts(param) {
  // TODO:
}

app.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

app.post('/api/reports/:namespace/:url', async (req, res) => {
  // ketika ada post ke endpoint ini
  // https://laurete.dev/rin.rocks/rin-aec777.now.sh
  // https://rin.rocks (production) <--> https://rin-aec777.now.sh (new commit)
  // running service kita (compare current url)

  dfs.insert(
    {
      screenshot: Date.now(),
      content: await screenshot(req.params.url)
    },
    (err, doc) => {
      db.insert({
        namespace: req.params.namespace,
        commit_id: Math.random(),
        timestamp: Date.now(),
        url: req.params.url,
        artifacts: {
          summary: {}, // { javascript: { origin: '13.37kb', gzipped: '2kb' } }
          css: {}, // { vendor.min.css: '12kb', app.min.css: '20kb' }
          javascript: {} // { vendor.min.js: '21kb', app.min.js: '20kb' }
        },
        diff: [doc._id] // ['ref_id_to_image_table']
      })
    }
  )

  res.send({ ok: 'cool' })
})

app.get('/api/reports/:namespace/:url', (req, res) => {
  db.findOne({ _id: req.params.url }, (err, doc) => {
    res.send({ data: doc })
  })
})

app.listen(1337)
