const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const sqlite3 = require('sqlite3').verbose();

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
  db.run(`CREATE TABLE IF NOT EXISTS clients (id, name)`)
    .run('CREATE TABLE IF NOT EXISTS documents (id, prizmDocId, title, clientId)')
    .run('DELETE FROM clients')
    .run(`INSERT INTO clients(id, name) VALUES(1, 'Melissa Harper');`)
    .all('SELECT * FROM clients;', [], (err, rows) => {
      console.log(rows)
    })
})
db.close()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);