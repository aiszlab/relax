import { taggedTemplateLiterals } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`taggedTemplateLiterals` util", () => {
  it("normal string", () => {
    const template = "it is a normal string";
    const value = taggedTemplateLiterals(template);

    expect(value).toBe(template);
  });

  it("inject variables", () => {
    const template = "it is a ${shown} string";

    const valueWithoutVariables = taggedTemplateLiterals(template);
    const valueWithEmptyVariables = taggedTemplateLiterals(template, {});
    const valueWithVariables = taggedTemplateLiterals(template, { shown: "test" });
    const valueWithVoidVariables = taggedTemplateLiterals(template, { shown: undefined });
    const valueWithErrorVariables = taggedTemplateLiterals(template, { display: "test" });

    expect(valueWithoutVariables).toBe(template);
    expect(valueWithEmptyVariables).toBe(template);
    expect(valueWithVariables).toBe("it is a test string");
    expect(valueWithVoidVariables).toBe("it is a  string");
    expect(valueWithErrorVariables).toBe(template);
  });
});
