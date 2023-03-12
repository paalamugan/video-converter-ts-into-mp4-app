import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import path from "path";
import fse from "fs-extra";
import { OUTPUT_DIR } from "@/constants/common";

export async function loader({ request }: LoaderArgs) {
  try {
    const videoDir = path.resolve(OUTPUT_DIR);
    fse.removeSync(videoDir);
    return json({
      message: "successfully deleted all videos",
    });
  } catch (error: unknown) {
    console.log("error ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
