import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import path from "path";
import fse from "fs-extra";
import { OUTPUT_DIR } from "@/constants/common";

export async function loader({ request }: LoaderArgs) {
  try {
    const videoDir = path.resolve(OUTPUT_DIR);
    const files = fse.readdirSync(videoDir);
    fse.removeSync(videoDir);
    return json({
      message: `Successfully Deleted ${files.length} files.`,
    });
  } catch (error: unknown) {
    console.log("error ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
