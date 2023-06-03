import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import oakLogger from "https://deno.land/x/oak_logger/mod.ts";

import { fetchEspnScoreboard } from "./sports/fetchEspnScoreboard.ts";
import { mapEspnToSportResult } from "./sports/mapEspnEventToSportResult.ts";

const router = new Router();
router.get("/", (context) => {
  context.response.body = {
    message: "Hello World!",
  };
});

router.get("/api/sport/nba/:matchDate", async (ctx) => {
  const { matchDate } = ctx.params;
  const event = await fetchEspnScoreboard(matchDate);
  if (!event) {
    ctx.response.body = {
      error: { code: "NOT_FOUND", message: "No event found" },
    };
    ctx.response.status = 404;
    return;
  }
  ctx.response.body = mapEspnToSportResult(event);
});

const app = new Application();
app.use(oakCors());
app.use(oakLogger.logger);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("server running on port http://localhost:8000");
await app.listen({ port: 8000 });
