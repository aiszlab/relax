/**
 * @jest-environment jsdom
 */

import { createElement, useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useBoolean, useClickAway } from "../../src";
import { describe, it, expect } from "@jest/globals";

const ClickAway = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const awayRef = useRef<HTMLDivElement>(null);
  const [isClickedIn, { turnOn, turnOff }] = useBoolean();

  useClickAway(() => {}, targetRef);

  const clickIn = () => {
    turnOn();
  };

  const clickAway = () => {
    turnOff();
  };

  return createElement("div", null, [
    createElement("div", { key: "tooltip", role: "tooltip", onClick: clickIn, ref: targetRef }),
    createElement("div", { key: "contentinfo", role: "contentinfo", onClick: clickAway, ref: awayRef }),
    createElement("span", { key: "render" }, isClickedIn ? "render-in" : "render-away"),
  ]);
};

describe("useClickAway", () => {
  it("test on dom", async () => {
    const { getByRole, queryAllByText } = render(createElement(ClickAway));

    expect(queryAllByText("render-in").length).toBe(0);
    fireEvent.click(getByRole("tooltip"));
    expect(queryAllByText("render-in").length).toBe(1);
    fireEvent.click(getByRole("contentinfo"));
    expect(queryAllByText("render-in").length).toBe(0);
    expect(queryAllByText("render-away").length).toBe(1);
  });
});
