export type Merge<P, T> = Omit<P, keyof T> & T;
export type ErrorType = Error & { status: number };
