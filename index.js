const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const fetch = require('node-fetch')
const cors = require('cors')

const path = require('path')
const dbPath = path.resolve(__dirname, 'prizmdoc.db')

// open database in memory
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the ./db/prizmdoc.db SQlite database.');
});

db.serialize(() => {
  db
    // .run('DROP TABLE IF EXISTS documents')
    // .run('DROP TABLE IF EXISTS clients')
    .run(`CREATE TABLE IF NOT EXISTS clients (name)`)
    .run('CREATE TABLE IF NOT EXISTS documents (prizmDocId, title, clientId)')
    .run('DELETE FROM clients')
    .run(`INSERT INTO clients(name) VALUES('Melissa Harper');`)
    // .run(`INSERT INTO documents (prizmDocId, title, clientId) VALUES ('docId', 'someTitle', '1')`)
    // .all('SELECT rowid, * FROM clients;', [], (err, rows) => {
    //   console.log(rows)
    // })
    // .all('SELECT rowid, * FROM documents', [], (err, rows) => {
    //   console.log(rows)
    // })
})

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors())
app.use(express.json());

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.post('/doc', (req, res) => {
  return fetch('https://prizmdoc-integ.canopy.ninja/api/v1/documents/f-xwZXhBvA9Azmf85mC1l-bzAUvaOp3d2i6rA2ttCLzd/actions/clone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      filename: 'my-file.docx'
    }
  }).then(r => r.json()).then(body => {
    console.log(`Document uploaded successfully, documentId: ${body.documentId}`);
    db.run(`INSERT INTO documents ('prizmDocId', 'title', 'clientId') VALUES ('${body.documentId}', '${req.body.title}', '1')`)
    return body.documentId
  }).then(docId => {
    fetch('https://prizmdoc-integ.canopy.ninja/api/v1/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "documentId": docId
      })
    }).then(data => data.json())
      .then(data => res.send(JSON.stringify({sessionId: data.sessionId})))
  }).catch('error saving Id')
})

app.delete('/doc', (req, res) => {
  const sql = 'DELETE FROM documents WHERE rowid=?'
  db.run(sql, req.body.id, err => {
    if (err) next(err)
  })
  return res.sendStatus(200)
})

app.post('/delete-all', (req, res, next) => {
  db.run('DELETE FROM documents', err => {
    if (err) next(err)
  })
  return res.sendStatus(200)
})

app.get('/docs', (req, res) => {
  db.all('SELECT rowid, * FROM documents', (err, rows) => {
    return res.send(JSON.stringify({docs: rows}))
  })
})

const getSession = docId => fetch('https://prizmdoc-integ.canopy.ninja/api/v1/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "documentId": docId
  })
}).then(data => data.json())

app.get('/doc/:docid', (req, res) => {
  db.get(`SELECT prizmDocId FROM documents WHERE rowid = '${req.params.docid}'`, (err, row) => {
    return getSession(row.prizmDocId).then(data => res.send(JSON.stringify({ sessionId: data.sessionId })))
  })
})

app.get('/user', (req, res) => {
  db.get('SELECT rowid as id, * FROM clients', (err, row) => {
    return res.send(JSON.stringify({user: row}))
  })
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);