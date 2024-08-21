import type { Voidable } from "@aiszlab/relax/types";

/**
 * @description
 * create tagged template literals
 */
export const taggedTemplateLiterals = (
  template: string,
  variables?: Record<string, Voidable<string | number>>,
) => {
  if (!variables) return template;

  const entries = Object.entries(variables);
  if (entries.length === 0) return template;

  const [keys, values] = entries.reduce<[string[], (string | number)[]]>(
    (prev, [key, value]) => {
      prev[0].push(key);
      prev[1].push(value ?? "");
      return prev;
    },
    [[], []],
  );

  try {
    const render = new Function(...keys, `return \`${template}\``);
    return render(...values);
  } catch (error) {
    return template;
  }
};
