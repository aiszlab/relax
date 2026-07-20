/**
 * @description
 * convert a ratio number to a percentage string
 * @param value  — ratio number (0–1)
 * @param digits — optional decimal places, uses toFixed when specified
 * @returns percentage string with "%" suffix
 */
export const toPercentage = (value: number, digits?: number): string => {
  const percent = value * 100;
  return (digits === undefined ? String(percent) : percent.toFixed(digits)) + "%";
};
