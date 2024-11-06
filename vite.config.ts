import * as fsPromises from "fs/promises";
import copy from "rollup-plugin-copy";
import { defineConfig, Plugin } from "vite";
import path from "path";
import fs from "fs-extra";

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = process.env.GH_PROJECT;
const githubTag = process.env.GH_TAG;
const foundryPath = process.env.FOUNDRY_PATH;
const kindOfProject = process.env.KIND_OF_PROJECT || "system";

console.log(process.env.VSCODE_INJECTION);

const newLocal = "writeBundle";
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  base: "",
  build: {
    // sourcemap: true,
    assetsDir: "dist/assets/",
    rollupOptions: {
      input: "src/ts/module.ts",
      output: {
        assetFileNames: "assets/[name].[ext]",
        dir: "dist/scripts/",
        entryFileNames: "module.js",
        format: "es",
      },
      watch: {
        include: "src/**",
      },
    },
  },
  plugins: [
    copy({
      targets: [{ src: "src/*.json", dest: "dist" }],
    }),
    updateModuleManifestPlugin(kindOfProject),
    // scss({
    //   fileName: "style.css",
    //   sourceMap: true,
    //   watch: ["src/styles/*.scss"],
    // }),
    copy({
      targets: [
        { src: "src/languages", dest: "dist" },
        { src: "src/templates", dest: "dist" },
        // { src: "src/images", dest: "dist" },
      ],
      // hook: newLocal,
    }),
    conditionalCopyPlugin(kindOfProject),
  ],
});

function updateModuleManifestPlugin(kind: string = "module"): Plugin {
  return {
    name: "update-module-manifest",
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(
        await fsPromises.readFile("./package.json", "utf-8")
      ) as Record<string, unknown>;
      const version = moduleVersion || (packageContents.version as string);
      const manifestContents: string = await fsPromises.readFile(
        `src/${kind}.json`,
        "utf-8"
      );
      const manifestJson = JSON.parse(manifestContents) as Record<
        string,
        unknown
      >;
      manifestJson["version"] = version;
      if (githubProject) {
        const baseUrl = `https://github.com/${githubProject}/releases`;
        manifestJson["manifest"] = `${baseUrl}/latest/download/${kind}.json`;
        if (githubTag) {
          manifestJson[
            "download"
          ] = `${baseUrl}/download/${githubTag}/${kind}.zip`;
        }
      }
      await fsPromises.writeFile(
        `dist/${kind}.json`,
        JSON.stringify(manifestJson, null, 4)
      );
    },
  };
}

function conditionalCopyPlugin(kind: string = "module"): Plugin {
  console.log(`kind: ${kind}`);
  return {
    name: "conditional-copy-plugin",
    async writeBundle(): Promise<void> {
      if (!foundryPath) {
        console.log(
          "FOUNDRY_PATH is not defined -> Skip internal test release."
        );
        return;
      }

      const sourceFolder = path.resolve(__dirname, "dist");
      const destinationFolder = path.join(foundryPath, `Data/${kind}s`);

      try {
        const manifestContents: string = await fsPromises.readFile(
          `src/${kind}.json`,
          "utf-8"
        );
        const manifestJson = JSON.parse(manifestContents) as Record<
          string,
          unknown
        >;

        const exists = await fs.pathExists(destinationFolder);
        if (exists) {
          await fs.copy(
            sourceFolder,
            path.join(destinationFolder, manifestJson["id"] as string)
          );
          console.log("Folder copied successfully.");
        } else {
          console.log(
            `Destination folder does not exist: ${destinationFolder} -> Skip internal test release.`
          );
        }
      } catch (err) {
        console.error(err);
      }
    },
  };
}
