const fs = require("fs");
const sqlite = require("sqlite3").verbose();
const path = require("path");
//set path for files
const database_file = path.join(__dirname, "db", "transcripts.db");
const json_data = path.join(__dirname, "sample_json");
const database = new sqlite.Database(database_file);

//fuction to create table in transcripts if it does not exists
function createTable() {
  return new Promise((resolve, reject) => {
    database.run(
       `CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station TEXT,
        state TEXT,
        dt TEXT,
        speaker TEXT,
        start INTEGER,
        end INTEGER,
        text TEXT
      )`,
      (err) => (err ? reject(err) : resolve())
    );
  });
}

//derive station and datetime from filename structure
function readFilenameParts(file_name) {
  if (!file_name.endsWith(".json")) return null;

  const nameParts = file_name.replace(".json", "").split("_");
  if (nameParts.length !== 7) return null;

  const [station, year, month, day, hour, minute] = nameParts;

  //construct and return ISO-formatted UTC timestamp
  try {
    const date_match = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:00`
    ).toISOString();
    return { station, date_match };
  } catch (err) {
    console.error(`Failed to parse datetime from: ${file_name}`);
    return null;
  }
}

//load all JSON files and insert their contents into the database
async function ingest() {
  await createTable();

  const files = fs.readdirSync(json_data);
  let total = 0; //count the number of rows

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const meta = readFilenameParts(file);
    if (!meta) {
      console.warn(`Not the file: ${file}`);
      continue;
    }

    const content = fs.readFileSync(path.join(json_data, file), "utf-8");
    let transcripts;

    try {
      transcripts = JSON.parse(content);
    } catch (e) {
      console.warn(`Skipped file: ${file}`);
      continue;
    }

    for (const record of transcripts) {
      const { speaker = "", start = 0, end = 0, text = "" } = record;
      //execute parameterized SQL insert
      database.run(
        `INSERT INTO transcripts (station, state, dt, speaker, start, end, text)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [meta.station, meta.state, meta.dt, speaker, start, end, text]
      );
      total++;
    }
  }
  console.log(`Ingested ${total} rows.`);
  database.close();
}
ingest();
