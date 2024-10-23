/**
 * @description
 * hash
 */
export const hash = async (
  input: string = crypto.randomUUID(),
  algorithm: AlgorithmIdentifier = "SHA-1",
) => {
  const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
  const _buffer = Array.from(new Uint8Array(buffer));
  return _buffer.map((_) => _.toString(16).padStart(2, "0")).join("");
};

/**
 * @description
 * sync function
 */
function* _hashSync(
  input: string,
  algorithm: AlgorithmIdentifier,
): Generator<Promise<string>, string> {
  const _hash = yield hash(input, algorithm);
  return _hash;
}

const hashSync = (
  input: string = crypto.randomUUID(),
  algorithm: AlgorithmIdentifier = "SHA-1",
) => {
  const nextable = _hashSync(input, algorithm);

  while (!nextable.next().done) {}

  nextable.next().value;
};
