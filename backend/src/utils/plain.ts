/**
 * Mongoose returns subdocuments that carry a toObject() method at runtime, but
 * our content interfaces are plain shapes without it. This converts to a plain
 * object when possible and otherwise returns the value unchanged.
 */
export function plain<T>(value: T): T {
  const maybe = value as unknown as { toObject?: () => T };
  return typeof maybe.toObject === "function" ? maybe.toObject() : value;
}
