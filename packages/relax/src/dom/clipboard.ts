const clipboard = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

export { clipboard };
