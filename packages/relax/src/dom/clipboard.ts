const clipboard = async (value: string) => {
  return await navigator.clipboard.writeText(value);
};

export { clipboard };
