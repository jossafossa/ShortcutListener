# Shortcutlistener

A simple class to listen for keyboard shortcuts

## Quickstart

### 1. Install

```shell
npm install shortcut-listener
```

### 2. Listen for shortcuts

```typescript
import { ShortcutListener } from "shortcut-listener";

const shortcuts = new ShortcutListener({
  root: document.body,
});

shortcuts.on("shortcutdown", ({ keys, keySet }) => {
  // listen for a keystring
  if (keys === "control+alt+j") {
    console.log("pressed CTRL + ALT + J");
  }

  // or check for keys
  if (keySet.has("control") && keySet.has("alt") && keySet.has("j")) {
    console.log("pressed CTRL + ALT + J");
  }
});
```

### Events

| Event          | Description               |
| -------------- | ------------------------- |
| `shortcutdown` | Gets triggered on keydown |
| `shortcutup`   | Gets triggered on keyup   |

### Methods

| Method                 | Description             |
| ---------------------- | ----------------------- |
| `on(event, callback)`  | Add an eventListener    |
| `off(event, callback)` | Remove an eventListener |

### ShortcutEvent

`ShortcutEvent` is a custom event type that is returned by the `on` method. It extends `Event` but has a few extra shortcut specific values.

| Key        | Description                                                          |
| ---------- | -------------------------------------------------------------------- |
| `shortcut` | A `string` representation of the shortcut. Example `control+shift+j` |
| `keys`     | A `Set` with all the keys                                            |
