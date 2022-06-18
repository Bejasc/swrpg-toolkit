import vue from "@vitejs/plugin-vue";
import vuetify from "@vuetify/vite-plugin";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 3030,
	},
	plugins: [
		vue({}),
		// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
		vuetify({
			autoImport: true,
		}),
	],
	base: "./",
	define: { "process.env": {} },
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	/* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
