import path from "path";
import fse from "fs-extra";
import type { LoaderArgs } from "@remix-run/server-runtime";
import type { ErrorType } from "@/types/common";

import { json } from "@remix-run/server-runtime";
import { OUTPUT_DIR } from "@/constants/common";
import { errorResponse } from "@/helper/error";

export async function loader({ request }: LoaderArgs) {
  try {
    const urlInstance = new URL(request.url);
    const type = urlInstance.searchParams.get("type");
    const videoIds = urlInstance.searchParams.get("ids") || "";

    const videoDir = path.resolve(OUTPUT_DIR);
    const files = fse.readdirSync(videoDir);

    let totalCount = files.length;

    if (!totalCount) {
      return json({
        message: "No files found!",
      });
    }

    if (type !== "all") {
      const deleteIds = videoIds.split(",");

      const filteredFiles = files.filter((file) => {
        return deleteIds?.includes(file.split(".")[0]);
      });

      totalCount = filteredFiles.length;

      filteredFiles.forEach((file) => {
        fse.removeSync(path.resolve(videoDir, file));
      });
    } else {
      fse.removeSync(path.resolve(videoDir));
    }

    return json({
      message: `Successfully deleted ${totalCount} files.`,
    });
  } catch (error: unknown) {
    return errorResponse(error as ErrorType);
  }
}
