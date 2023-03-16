import type { MEDIA_TYPES, VIDEO_FORMATS } from "@/constants/common";

export type Merge<P, T> = Omit<P, keyof T> & T;
export type ErrorType = Error & { status: number; code?: string };
export type MediaType = typeof MEDIA_TYPES[number];
export type VideoFormat = typeof VIDEO_FORMATS[number];
