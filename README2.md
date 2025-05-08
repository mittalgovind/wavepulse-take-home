# Documentation
## Setup instructions for dependencies :
- Initialized Node Project with `npm init -y command`
- `npm install express sqlite3`
- `npm install --save-dev nodemon`
## Update package.json to include:
            "scripts": {
                "start": "node app.js",
                "dev": "nodemon app.js"
            }
## Run the ingestion script:
- `node ingest.js`
## Start the API service:
- `npm run dev`
## Used Prettier Code Formatter VS Code Extention
## Example Curl Commands:
- `curl "http://localhost:8000/transcripts?station=WGMD&q=he"`
- `curl "http://localhost:8000/transcripts?station=KVNT&q=in&limit=20&offset=0"`
## Time Spent: 
            It took approximatly 3hrs

