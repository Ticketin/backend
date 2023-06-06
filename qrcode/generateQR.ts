import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import { decode } from "https://deno.land/std/encoding/base64.ts";

export async function generateQR(collectionId: string) {
  const qr = (await qrcode(`https://pocky.deno.dev/${collectionId}`)) as unknown as string;
  return decode(qr.replace("data:image/gif;base64,", ""));
}
