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

  constructor(
    type: ShortcutEventType,
    { keys }: ShortcutEventOptions = { keys: new Set() }
  ) {
    super(type);

    this.keys = keys;
    this.shortcut = this.#keysToString(keys);
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

  #getKeys(event: KeyboardEvent): KeySet {
    const keys: KeySet = new Set();

    if (event.ctrlKey) keys.add("control");
    if (event.metaKey) keys.add("meta");
    if (event.shiftKey) keys.add("shift");
    if (event.altKey) keys.add("alt");

    keys.add(event.key.toLowerCase());

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
