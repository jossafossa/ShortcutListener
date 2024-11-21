import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      name: "ShortcutListener",
      entry: "src/index.ts",
      fileName: (format) => `index.${format}.js`,
    },
  },
});
