import type { ErrorType } from "@/types/common";
import { json } from "@remix-run/server-runtime";

export class CustomError extends Error implements ErrorType {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

export const errorResponse = (error: ErrorType) => {
  if (error.code === "ENOENT") {
    error.message = "Video file not found!";
  }
  return json(
    {
      error: {
        message: error.message,
        details: error.cause,
      },
    },
    {
      status: error.status || 500,
    }
  );
};
