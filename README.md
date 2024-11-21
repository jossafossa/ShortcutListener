# ShortcodeListener

A simple class to listen for keyboard shortcuts

## Quickstart

### 1. Install

```shell
npm install shortcodeListener
```

### 2. Listen for shortcuts

```javascript
import { ShortcodeListener } from 'ShortcodeListener';

const shortcuts = new ShortcodeListener({
  root: document.body // 
});

shortcuts.on("shortcutdown", ({keys, keySet}) => {
  // listen for a keystring
  if (keys === "control+alt+j") {
    console.log("pressed CTRL + ALT + J")
  }

  // or check for Keys
  if (keySet.has("control") && keySet.has("alt") && keySet.has("j") ) {
    console.log("pressed CTRL + ALT + J")
  }
})
```
