/**
 * @jest-environment jsdom
 */

import React, { createElement, useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useBoolean, useClickAway } from "../../src";
import { describe, it, expect } from "@jest/globals";

const ClickAway = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const awayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isClickedIn, { turnOn, turnOff, toggle }] = useBoolean();

  useClickAway(() => {
    turnOff();
  }, [targetRef, triggerRef]);

  return (
    <div>
      <div role="button" onClick={toggle} ref={triggerRef}></div>
      <div role="tooltip" onClick={turnOn} ref={targetRef}></div>
      <div role="contentinfo" onClick={turnOff} ref={awayRef}></div>
      <span>{isClickedIn ? "render-in" : "render-away"}</span>
    </div>
  );
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

    fireEvent.click(getByRole("button"));
    expect(queryAllByText("render-in").length).toBe(1);
    expect(queryAllByText("render-away").length).toBe(0);
    fireEvent.click(getByRole("button"));
    expect(queryAllByText("render-in").length).toBe(0);
    expect(queryAllByText("render-away").length).toBe(1);
  });
});
