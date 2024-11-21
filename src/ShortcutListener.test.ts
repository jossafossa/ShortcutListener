import { expect, describe, it, vi } from "vitest";
import { ShortcutListener } from "./ShortcutListener";

describe("ShortcutListener", async () => {
  it("can be instantiated", () => {
    const listener = new ShortcutListener();
    expect(listener).toBeDefined();
  });

  it("can be instantiated on a custom root", () => {
    const root = document.createElement("div");
    const listener = new ShortcutListener({ root });
    expect(listener).toBeDefined();
  });

  it.each([
    ["a", ["a"], { key: "a" }],
    ["shift+a", ["shift", "a"], { key: "A", shiftKey: true }],
    ["shift+]", ["shift", "]"], { key: "]", shiftKey: true }],
    ["control+a", ["control", "a"], { key: "a", ctrlKey: true }],
    ["control+a", ["control", "a"], { key: "a", ctrlKey: true }],
    ["meta+a", ["meta", "a"], { key: "a", metaKey: true }],
    ["alt+a", ["alt", "a"], { key: "a", altKey: true }],
    ["shift+a", ["shift", "a"], { key: "a", shiftKey: true }],
    [
      "control+meta+shift+alt+b",
      ["control", "meta", "shift", "alt", "b"],
      { key: "b", ctrlKey: true, shiftKey: true, altKey: true, metaKey: true },
    ],
    [
      "control+meta+shift+alt+b",
      ["control", "meta", "shift", "alt", "b"],
      { metaKey: true, altKey: true, shiftKey: true, ctrlKey: true, key: "b" },
    ],
  ])("fires the correct events for '%s'", (keysExpect, keySetExpect, event) => {
    const root = document.createElement("div");
    const listener = new ShortcutListener({ root });

    listener.on("shortcutdown", ({ keys, keySet }) => {
      expect(keys).toBe(keysExpect);
      expect([...keySet]).toStrictEqual(keySetExpect);
    });

    listener.on("shortcutup", ({ keys, keySet }) => {
      expect(keys).toBe(keysExpect);
      expect([...keySet]).toStrictEqual(keySetExpect);
    });

    root.dispatchEvent(new KeyboardEvent("keydown", event));
    root.dispatchEvent(new KeyboardEvent("keyup", event));
  });

  it("does not fire on keyboard events from external elements", () => {
    const root = document.createElement("div");
    const listener = new ShortcutListener({ root });
    const callback = vi.fn();

    listener.on("shortcutdown", callback);

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    document.body.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));

    expect(callback).not.toHaveBeenCalled();
  });

  it("skips repeat events", () => {
    const root = document.createElement("div");
    const listener = new ShortcutListener({ root });
    const callback = vi.fn();

    listener.on("shortcutdown", () => {
      callback();
    });

    root.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", shiftKey: true })
    );
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    root.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", repeat: true })
    );

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("can be removed", () => {
    const root = document.createElement("div");
    const listener = new ShortcutListener({ root });
    const callback = vi.fn();

    listener.on("shortcutdown", callback);
    listener.off("shortcutdown", callback);

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    expect(callback).not.toHaveBeenCalled();
  });
});
