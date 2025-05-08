const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
//connect to the SQLite database stored at /db/transcripts.db
const database = new sqlite3.Database(path.join(__dirname, 'db', 'transcripts.db'));
//define the GET endpoint for /transcripts
app.get('/transcripts', (req, res) => {
  const { q, station, limit = 20, offset = 0 } = req.query;
  let filters = [];
  let parameters = [];
  //condition for station filter
  if (station) {
    filters.push("station = ?");
    parameters.push(station);
  }

  //condition for text search if keyword (q) is provided
  if (q) {
    filters.push("text LIKE ?");
    parameters.push(`%${q}%`);
  }

  //combine all filter conditions into "WHERE" condition
  const filterConditions = filters.length ? "WHERE " + filters.join(" AND ") : "";
  //sql query for the count of total matching records
  const recordCount = `SELECT COUNT(*) AS count FROM transcripts ${filterConditions}`;
  //sql query to get matching results
  const getData = 
   `SELECT id, station, dt AS datetime, substr(text, 1, 200) AS snippet
    FROM transcripts
    ${filterConditions}
    LIMIT ? OFFSET ?`;

  database.get(recordCount, parameters, (err, countRow) => {
    if (err) return res.status(500).json({ error: err.message });
    database.all(getData, [...parameters, parseInt(limit), parseInt(offset)], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      //return json response with total number of matching records
      //and a list of objects with fields: id, station, datetime, and a 200-character snippet from the transcript text
      res.json({ count: countRow.count, results: rows });
    });
  });
});

app.listen(8000, () => {
  console.log(`API Server running at http://localhost:8000`);
});

