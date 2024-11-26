import { expect, describe, it, vi } from "vitest";
import { ShortcutEvent, ShortcutListener } from "./ShortcutListener";

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
    ["Shift+a", ["Shift", "a"], { key: "A", shiftKey: true }],
    ["Shift+]", ["Shift", "]"], { key: "]", shiftKey: true }],
    ["Control+a", ["Control", "a"], { key: "a", ctrlKey: true }],
    ["Control+a", ["Control", "a"], { key: "a", ctrlKey: true }],
    ["Meta+a", ["Meta", "a"], { key: "a", metaKey: true }],
    ["Alt+a", ["Alt", "a"], { key: "a", altKey: true }],
    ["Shift+a", ["Shift", "a"], { key: "a", shiftKey: true }],
    [
      "Control+Meta+Shift+Alt+b",
      ["Control", "Meta", "Shift", "Alt", "b"],
      { key: "b", ctrlKey: true, shiftKey: true, altKey: true, metaKey: true },
    ],
    [
      "Control+Meta+Shift+Alt+b",
      ["Control", "Meta", "Shift", "Alt", "b"],
      { metaKey: true, altKey: true, shiftKey: true, ctrlKey: true, key: "b" },
    ],
    [
      "Control+ArrowUp",
      ["Control", "ArrowUp"],
      { key: "ArrowUp", ctrlKey: true },
    ],
  ])(
    "fires the correct events for '%s'",
    (shortcutExpect, keysExpect, event) => {
      const root = document.createElement("div");
      const listener = new ShortcutListener({ root });

      listener.on("shortcutdown", ({ keys, shortcut }) => {
        expect(shortcut).toBe(shortcutExpect);
        expect([...keys]).toStrictEqual(keysExpect);
      });

      listener.on("shortcutup", ({ keys, shortcut }) => {
        expect(shortcut).toBe(shortcutExpect);
        expect([...keys]).toStrictEqual(keysExpect);
      });

      root.dispatchEvent(new KeyboardEvent("keydown", event));
      root.dispatchEvent(new KeyboardEvent("keyup", event));
    }
  );

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

describe("ShortcutEvent", () => {
  it("can be instantiated", () => {
    const event = new ShortcutEvent("shortcutdown");
    expect(event).toBeDefined();
  });

  it.each([
    ["cmd+option+k", ["meta", "alt", "K"]],
    ["cmd+option+K", ["Meta", "Alt", "k"]],
    ["CMD+OPTION+K", ["Meta", "Alt", "k"]],
    ["ctrl+shift+up", ["control", "shift", "arrowup"]],
    ["command+shift+down", ["meta", "shift", "arrowdown"]],
    ["ctrl+option+left", ["control", "alt", "arrowleft"]],
    ["ctrl+shift+right", ["control", "shift", "arrowright"]],
    ["ctrl+shift+space", ["control", "shift", "space"]],
    ["ctrl+shift+del", ["control", "shift", "delete"]],
    ["ctrl+shift+bksp", ["control", "shift", "backspace"]],
    ["ctrl+shift+return", ["control", "shift", "enter"]],
    ["ctrl+shift+esc", ["control", "shift", "escape"]],
    ["ctrl+shift+pgup", ["control", "shift", "pageup"]],
    ["ctrl+shift+pgdn", ["control", "shift", "pagedown"]],
  ])("%s matches to %s", (alias, keys) => {
    const event = new ShortcutEvent("shortcutdown", { keys: new Set(keys) });
    expect(event.matches(alias)).toBe(true);
  });

  it.each([
    ["cmd+k", ["meta", "alt", "k"]],
    ["ctrl+shift+up", ["control", "arrowdown"]],
    ["command+shift+down", ["meta", "shift", "arrowup"]],
  ])("%s does not match to %s", (alias, keys) => {
    const event = new ShortcutEvent("shortcutdown", { keys: new Set(keys) });
    expect(event.matches(alias)).toBe(false);
  });

  it("can be iterated over", () => {
    const keys = new Set(["a", "b", "c"]);
    const event = new ShortcutEvent("shortcutdown", { keys });

    expect([...event]).toStrictEqual(["a", "b", "c"]);
  });

  it("can be converted to a string", () => {
    const keys = new Set(["a", "b", "c"]);
    const shortcut = new ShortcutEvent("shortcutdown", { keys });

    expect(`the shortcut is ${shortcut}`).toBe("the shortcut is a+b+c");
  });
});
