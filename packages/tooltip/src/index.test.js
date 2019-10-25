import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import * as autoId from "@reach/auto-id"; // eslint-disable-line no-unused-vars
import Tooltip, { LEAVE_TIMEOUT, MOUSE_REST_TIMEOUT } from ".";

jest.mock("@reach/auto-id", () => ({
  ...jest.requireActual("@reach/auto-id")
}));

jest.mock("@reach/utils", () => ({
  ...jest.requireActual("@reach/utils"),
  checkStyles: jest.fn()
}));

beforeEach(() => {
  const newAutoId = jest.requireActual("@reach/auto-id");
  jest.setMock("@reach/auto-id", newAutoId);
  jest.useFakeTimers();
});

describe("Tooltip", () => {
  it("shows/hides on hover", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );
    const trigger = getByText("Trigger");

    expect(baseElement).toMatchSnapshot("closed tooltip");
    fireEvent.mouseOver(trigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot("after mouse enter");
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(LEAVE_TIMEOUT));
    expect(baseElement).toMatchSnapshot("after mouse leave");
  });

  it("shows/hides when trigger is activeElement", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );
    const trigger = getByText("Trigger");

    expect(baseElement).toMatchSnapshot("before focus");
    fireEvent.focus(trigger);
    expect(baseElement).toMatchSnapshot("after focus");
    fireEvent.blur(trigger);
    act(() => jest.advanceTimersByTime(LEAVE_TIMEOUT));
    expect(baseElement).toMatchSnapshot("after blur");
  });

  it("shows without timeout when one tooltip is already visible", () => {
    const { baseElement, getByText } = render(
      <>
        <Tooltip label="First">
          <button>First Trigger</button>
        </Tooltip>
        <Tooltip label="Second">
          <button>Second Trigger</button>
        </Tooltip>
      </>
    );
    const firstTrigger = getByText("First Trigger");
    const secondTrigger = getByText("Second Trigger");

    fireEvent.mouseOver(firstTrigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot("after first mouseover");
    fireEvent.mouseLeave(firstTrigger);
    fireEvent.mouseOver(secondTrigger);
    expect(baseElement).toMatchSnapshot("after second mouseover");
  });

  it("hides on ESC", () => {
    const { baseElement, getByText } = render(
      <Tooltip label="Content">
        <button>Trigger</button>
      </Tooltip>
    );

    const trigger = getByText("Trigger");
    fireEvent.focus(trigger);
    act(() => jest.advanceTimersByTime(MOUSE_REST_TIMEOUT));
    expect(baseElement).toMatchSnapshot("after focus");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(baseElement).toMatchSnapshot("after escape");
  });
});
