import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import path from "path";
import fse from "fs-extra";
import { OUTPUT_DIR } from "@/constants/common";

export async function loader({ request }: LoaderArgs) {
  try {
    const videoDir = path.resolve(OUTPUT_DIR);
    if (!fse.existsSync(videoDir)) {
      return json({
        message: "No files to delete.",
      });
    }
    const files = fse.readdirSync(videoDir);
    fse.removeSync(videoDir);
    return json({
      message: `Successfully deleted ${files.length} files.`,
    });
  } catch (error: unknown) {
    console.log("error ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
