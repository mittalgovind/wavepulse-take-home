# WavePulse Mini-Project (3-Hour Take-Home Assignment)

This assignment mirrors the first slice of real work you would do as an intern.

You will ingest sample JSON transcript data, expose a basic REST API, and demonstrate the system via simple queries.

The goal is to assess your ability to write clean, working code with minimal setup and clear documentation.

Please stop after 3 hours and submit whatever you have — partial solutions are absolutely fine.

Do not use AI assistants, as their work is both easy to spot and counterproductive to this assignment. It should be 100% your work. 

## 1. What We Provide

This starter GitHub repository includes:

- A `sample_transcripts/` folder with ~100 JSON files, each containing radio transcript data.
- Each file is named like `IL_WTRH_2024_08_21_01_30.json` and contains a list of transcript segments.

Each JSON object contains the following fields:

`id`, `station`, `state`, `datetime`, `speaker`, `start` (seconds), `end` (seconds), `text`.

## 2. Data Ingestion (Approximately 1 Hour)

Write a script (e.g., `ingest.py`) that does the following:

- Iterates over all JSON files in the `sample_json/` directory.
- Parses each transcript record and inserts it into a local SQLite database.
- The SQLite table should be named `transcripts` and include: `id` (auto), `station`, `state`, `dt` (timestamp), `speaker`, `start`, `end`, `text`.
- Derive `station` and base `datetime` from the filename structure (`<STATE>_<CALLSIGN>_<YYYY_MM_DD_HH_MM>.json`).
- Print a message indicating how many rows were loaded.

Note: You may use PostgreSQL if you prefer, but SQLite is sufficient for this assignment.

## 3. API Implementation (Approximately 1 Hour)

Implement a REST API endpoint using a web framework of your choice (e.g., FastAPI, Flask, Express):

**Endpoint:** `GET /transcripts`

Support the following query parameters:

- `q` (keyword search on 'text' field, using `LIKE` or `ILIKE`)
- `station` (exact match)
- `limit` (default 20, maximum 100)
- `offset` (for pagination)

Return a JSON object with:

- `count` (total number of matching records)
- `results`: a list of objects with fields: `id`, `station`, `datetime`, and a 200-character snippet from the transcript text.

Include one basic test to verify that the endpoint returns results for a known station.

## 4. Documentation and Demo (Approximately 1 Hour)

Create a README file that includes:

- Setup instructions for dependencies (e.g., `pip install -r requirements.txt`).
- How to run the ingestion script (e.g., `python ingest.py`).
- How to start the API service (e.g., `uvicorn api:app --reload`).
- Two example `curl` commands showing how to query the endpoint.
- A note indicating how much time you spent.
- If the project is incomplete, list any TODOs clearly.
  

Optional: You may include a Dockerfile or `docker-compose.yml` if you prefer a containerized setup.

## 5. Submission

Fork the provided GitHub repository, push your work to your fork, and submit a pull request (PR) to the original repo.

Reminder: Stop at approximately 3 hours — I value clean thinking and maintainability over completeness.

## 6. Evaluation Criteria

Submissions will be evaluated based on:

- Data ingestion correctness and log output
- API functionality and pagination
- Code clarity, documentation and structure
- Basic test and error handling
- Developer experience (README and ease of setup)

Bonus: Docker support, strong FTS usage, or additional test coverage.

Thank you for taking the time to complete this assignment. 

I look forward to reviewing your work and going through it with you!
