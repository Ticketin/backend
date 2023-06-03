# pocky/backend

See production deployment here: https://pocky.deno.land/

A REST API for Pocky. It does:
 - [ ] Store QR codes in the safe place
 - [x] Relay sport API (e.g. ESPN) for the chainlink
 - [x] Fetches sport API initially to construct the collection metadata

### Prerequisites

 * Deno 1.34 or higher

## Running the Server

Start the server with the command:

```
deno run --allow-net main.ts
```

This starts the server at http://localhost:8000/

## Deploying the Server

As new commits pushed into `main` branch, Deno deploys it automatically.


## API Documentation

### GET `/api/sport/nba/:matchDate`

Fetches the metadata and the result of a match. The `matchDate`is `YYYYMMDD` format.  For response format, please refer [`SportResult`](./sports/mapEspnEventToSportResult.ts).

 It is being called by Chainlink Oracle nodes.

##### Request Example

```bash
 $ curl https://pocky.deno.land/api/sport/nba/20230527
```

##### Response Example

```json
{
  "hasResult": true,
  "home": {
    "metadata": {
      "name": "Miami Heat",
      "symbol": "MIA",
      "color": "#98002e",
      "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/mia.png"
    },
    "score": 103,
    "stats": {
      "fieldGoalsMade": "33",
      "fieldGoalsPct": "35.5?",
      "threePointMade": "14",
      "threePointPct": "46.7?",
      "freeThrowsMade": "23",
      "freeThrowPct": "79.3?"
    }
  },
  "away": {
    "metadata": {
      "name": "Boston Celtics",
      "symbol": "BOS",
      "color": "#006532",
      "logo": "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/bos.png"
    },
    "score": 104,
    "stats": {
      "fieldGoalsMade": "34",
      "fieldGoalsPct": "43.6?",
      "threePointMade": "7",
      "threePointPct": "20.0?",
      "freeThrowsMade": "29",
      "freeThrowPct": "85.3?"
    }
  }
}
```

##### Error Example

When match is not held at given date, it returns `HTTP 404 Not Found` with `NOT_FOUND` code.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "event not found"
  }
}
```
