
import { EventEmitter } from "events";
import type { FirestorePermissionError } from "./errors";

type AppEvents = {
  "permission-error": (error: FirestorePermissionError) => void;
};

// We need to declare the `EventEmitter` type to correctly type the `on` and `off` methods
// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50867
declare interface AppEventEmitter {
  on<U extends keyof AppEvents>(event: U, listener: AppEvents[U]): this;
  off<U extends keyof AppEvents>(event: U, listener: AppEvents[U]): this;
  emit<U extends keyof AppEvents>(
    event: U,
    ...args: Parameters<AppEvents[U]>
  ): boolean;
}

class AppEventEmitter extends EventEmitter {}

export const errorEmitter = new AppEventEmitter();
