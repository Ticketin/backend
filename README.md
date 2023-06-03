# pocky/backend

See production deployment here: https://pocky.deno.land/

A REST API for Pocky. It does:
* Store QR codes in the safe place
* Relay sport API (e.g. ESPN) for the chainlink
* Fetches sport API initially to construct the collection metadata

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
