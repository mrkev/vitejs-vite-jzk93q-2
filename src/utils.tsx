/** ensures exhaustivenes in switches and other conditionals */
export function exhaustive(x: never): never {
  throw new Error(`unexpected ${x} in switch statement`);
}

/** gets rid of nulls/undefineds. unsafe! */
export function nullthrows<T>(x: T | null | undefined): T {
  if (x == null) {
    throw new Error("unexpected null");
  } else {
    return x;
  }
}
