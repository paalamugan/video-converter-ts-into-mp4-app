// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import path from "path";
import fs from "fs";
export async function loader({ request }: LoaderArgs) {
  try {
    const dir = path.join(process.cwd(), "node_modules");
    const files = fs.readdirSync(dir);
    return json({
      files,
    });
  } catch (error: unknown) {
    console.log("error ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
