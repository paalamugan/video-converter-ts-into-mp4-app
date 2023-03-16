import { MEDIA_TYPES, OUTPUT_DIR, VIDEO_FORMATS } from "@/constants/common";
import { CustomError, errorResponse } from "@/helper/error";
import type { ErrorType, MediaType, VideoFormat } from "@/types/common";
import { concatArrayString } from "@/utils/utils";
import { Response } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/server-runtime";
import fse from "fs-extra";
import path from "path";
import { ffmpeg } from "video-converter-ts-into-mp4";

const convertVideoOrAudioOnly = (
  inputPath: string,
  type: MediaType,
  format: VideoFormat = "mp4"
) => {
  const command = ffmpeg().addInput(inputPath);
  if (type === "audio") {
    command.audioCodec("copy").noVideo().outputFormat("mp3");
  } else if (type === "video") {
    command
      .videoCodec("copy")
      .noAudio()
      .outputOption("-movflags frag_keyframe+empty_moov")
      .outputOption("-bsf:a aac_adtstoasc")
      .outputFormat(format);
  }
  return command.pipe();
};

export async function loader({ params, request }: LoaderArgs) {
  try {
    const id = params.id || "default";
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams) as {
      type: MediaType;
      format: VideoFormat;
    };
    const download = query.hasOwnProperty("download");
    const type = query.type || "audio-and-video"; // audio, video, audio-and-video
    const format = query.format || "mp4"; // mp4, avi, mov

    if (!VIDEO_FORMATS.includes(format)) {
      throw new CustomError(
        `Invalid format. Format must be either one of this values: "${concatArrayString(
          VIDEO_FORMATS
        )}".`,
        400
      );
    }

    const files = fse.readdirSync(OUTPUT_DIR);
    const fileName = files.find((file) => file === `${id}.${format}`);

    if (!fileName) {
      throw new CustomError("Video File not found!", 404);
    }

    const videoPath = path.resolve(OUTPUT_DIR, fileName);
    const isSupported = MEDIA_TYPES.includes(type);

    if (!isSupported) {
      throw new CustomError(
        `Invalid type. Type must be either one of this values: "${concatArrayString(
          MEDIA_TYPES
        )}".`,
        400
      );
    }

    if (type === "audio" || type === "video") {
      const stream = convertVideoOrAudioOnly(videoPath, type, format);
      const mediaFormat = type === "audio" ? "mp3" : format;
      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": `${type}/${mediaFormat}`,
          "Content-Disposition": `attachment; filename=${id}-${type}-only.${mediaFormat}`,
        },
      });
    }

    const stat = fse.statSync(videoPath);
    const fileSize = stat.size;
    const range = request.headers.get("range");
    const headers = new Headers();

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const file = fse.createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 1024 * 1024, // 1MB
      });

      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", chunksize.toString());
      headers.set("Content-Type", `video/${format}`);

      return new Response(file, {
        status: 206,
        headers,
      });
    } else {
      headers.set("Content-Length", fileSize.toString());
      headers.set("Content-Type", `video/${format}`);

      if (download) {
        headers.set(
          "Content-Disposition",
          `attachment; filename=${id}.${format}`
        );
      }

      const file = fse.createReadStream(videoPath);

      return new Response(file, {
        status: 200,
        headers,
      });
    }
  } catch (err) {
    return errorResponse(err as ErrorType);
  }
}
