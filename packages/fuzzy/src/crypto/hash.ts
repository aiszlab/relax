/**
 * @description
 * hash
 */
export const hash = async (
  algorithm: AlgorithmIdentifier = "SHA-1",
  input: string = crypto.randomUUID(),
) => {
  const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
  const _buffer = Array.from(new Uint8Array(buffer));
  return _buffer.map((_) => _.toString(16).padStart(2, "0")).join("");
};
