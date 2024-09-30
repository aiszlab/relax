export const isHex = (value: string) => {
  return /^#?[a-fA-F0-9]+$/.test(value);
};
