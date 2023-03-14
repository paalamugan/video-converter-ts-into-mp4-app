import path from "path";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  combineMultipleVideoUrlIntoFile,
  getHashKey,
} from "video-converter-ts-into-mp4";
import { CustomError, errorResponse } from "@/helper/error";
import { OUTPUT_DIR, TMP_DIR } from "@/constants/common";
import type { ErrorType } from "@/types/common";

export const action = async ({ request }: ActionArgs) => {
  try {
    const formData = await request.formData();
    const urlInstance = new URL(request.url);

    let inputUrl = formData.get("url")?.toString() || "";
    const format = formData.get("format")?.toString() || "mp4";

    inputUrl = inputUrl.trim();
    if (!/https?:\/\/.+/.test(inputUrl)) {
      throw new CustomError("Url must start with http:// or https://", 400);
    }

    const fileName = getHashKey(inputUrl);
    const outputPath = path.resolve(OUTPUT_DIR, `${fileName}.${format}`);
    const result = await combineMultipleVideoUrlIntoFile(inputUrl, outputPath, {
      tmpDir: TMP_DIR,
    });

    const finalOutputPath = result.path;
    if (!finalOutputPath) {
      throw new CustomError(
        "Something went wrong, Failed to convert a video!",
        500
      );
    }

    const id = path.basename(finalOutputPath).split(".")[0];

    return json({
      url: `${urlInstance.origin}/api/video/${id}`,
      format: format,
    });
  } catch (err) {
    return errorResponse(err as ErrorType);
  }
};

export const loader: LoaderFunction = ({ request }) => {
  const error = new CustomError(
    `"${request.method}" Method not allowed. Please use a POST method`,
    405
  );
  return errorResponse(error);
};
