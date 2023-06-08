import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Router,
  helpers,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import oakLogger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";

import { generateQR } from "./qrcode/generateQR.ts";
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

router.get("/api/qrcode/:collectionId", async (ctx) => {
  ctx.response.headers.set("Content-Type", "image/gif");
  ctx.response.body = await generateQR(ctx.params.collectionId);
});

router.get("/render", (ctx) => {
  const { svg: svgBase64 } = helpers.getQuery(ctx);
  if (!svgBase64) {
    ctx.response.status = 400;
    ctx.response.body = "svg query param is required";
    return;
  }
  const svg = atob(svgBase64);

  // this allows loading image inside the svg
  ctx.response.headers.set(
    "Content-Security-Policy",
    "object-src data: 'unsafe-eval'"
  );
  ctx.response.body = `<html><body>${svg}</body></html>`;
  ctx.response.type = "html";
});

const app = new Application();
app.use(oakCors());
app.use(oakLogger.logger);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("server running on port http://localhost:8000");
await app.listen({ port: 8000 });
