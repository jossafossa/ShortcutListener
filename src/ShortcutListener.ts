type ShortcutListenerProps = {
  root?: HTMLElement;
};

type Key = "control" | "meta" | "alt" | "shift" | string;

type KeySet = Set<Key>;

type ShortcutEventOptions = {
  keys: KeySet;
};

type ShortcutEventType = "shortcutdown" | "shortcutup";

export class ShortcutEvent extends Event {
  keys: KeySet;
  shortcut: string;
  #keysAliasses = new Map([
    ["up", "arrowup"],
    ["down", "arrowdown"],
    ["left", "arrowleft"],
    ["right", "arrowright"],
    [" ", "space"],
    ["plus", "+"],
    ["ctrl", "control"],
    ["cmd", "meta"],
    ["command", "meta"],
    ["option", "alt"],
    ["bksp", "backspace"],
    ["del", "delete"],
    ["return", "enter"],
    ["esc", "escape"],
    ["pgup", "pageup"],
    ["pgdn", "pagedown"],
  ]);

  constructor(
    type: ShortcutEventType,
    { keys }: ShortcutEventOptions = { keys: new Set() }
  ) {
    super(type);

    this.keys = keys;
    this.shortcut = this.#keysToString(keys);
  }

  #getAlias(key: Key): Key {
    return this.#keysAliasses.get(key) || key;
  }

  matches(shortcut: string): boolean {
    const keys = new Set(shortcut.toLowerCase().split("+"));

    if (keys.size !== this.keys.size) return false;

    const aliases = [...keys].map((key) => this.#getAlias(key));

    for (const key of this.keys) {
      if (!aliases.includes(key.toLowerCase())) return false;
    }

    return true;
  }

  #keysToString(keys: KeySet): string {
    return [...keys].join("+");
  }

  [Symbol.iterator]() {
    return this.keys[Symbol.iterator]();
  }

  // toString
  [Symbol.toPrimitive]() {
    return this.shortcut;
  }
}

export class ShortcutListener extends EventTarget {
  #root: HTMLElement;

  constructor({ root = document.body }: ShortcutListenerProps = {}) {
    super();

    this.#root = root;

    this.#root.addEventListener("keydown", (event) =>
      this.#handleKeyDown(event)
    );
    this.#root.addEventListener("keyup", (event) => this.#handleKeyUp(event));
  }

  #getKey({ key }: KeyboardEvent): Key {
    return key.length === 1 ? key.toLowerCase() : key;
  }

  #getKeys(event: KeyboardEvent): KeySet {
    const keys: KeySet = new Set();

    if (event.ctrlKey) keys.add("Control");
    if (event.metaKey) keys.add("Meta");
    if (event.shiftKey) keys.add("Shift");
    if (event.altKey) keys.add("Alt");

    keys.add(this.#getKey(event));

    return keys;
  }

  #handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;

    const keys = this.#getKeys(event);

    this.dispatchEvent(new ShortcutEvent("shortcutdown", { keys }));
  }

  #handleKeyUp(event: KeyboardEvent) {
    const keys = this.#getKeys(event);
    this.dispatchEvent(new ShortcutEvent("shortcutup", { keys }));
  }

  on(
    type: string,
    callback: (evt: ShortcutEvent) => void,
    options?: AddEventListenerOptions | boolean
  ) {
    this.addEventListener(type, callback as EventListener, options);
  }

  off(
    type: string,
    callback: (evt: ShortcutEvent) => void,
    options?: EventListenerOptions | boolean
  ) {
    this.removeEventListener(type, callback as EventListener, options);
  }
}
