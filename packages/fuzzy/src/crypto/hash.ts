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
