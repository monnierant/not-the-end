import axios from "axios";
import * as fs from "fs";
import * as path from "path";

interface Compatibility {
  minimum: string;
  verified: string;
  maximum: string;
}

interface Manifest {
  compatibility: Compatibility;
  id: string;
}

async function readCompatibilityInfo(filePath: string): Promise<Compatibility> {
  const data = fs.readFileSync(filePath, "utf-8");
  const manifest: Manifest = JSON.parse(data);
  return manifest.compatibility;
}

async function readModuleId(filePath: string): Promise<string> {
  const data = fs.readFileSync(filePath, "utf-8");
  const manifest: Manifest = JSON.parse(data);
  return manifest.id;
}

async function updateReleaseVersion(
  githubUrl: string,
  version: string,
  authToken: string
) {
  const compatibilityInfo = await readCompatibilityInfo(
    path.resolve(__dirname, "src", "system.json")
  );
  const moduleId = await readModuleId(
    path.resolve(__dirname, "src", "system.json")
  );
  try {
    const response = await axios.post(
      "https://api.foundryvtt.com/_api/packages/release_version/",
      {
        id: moduleId,
        release: {
          version: version,
          manifest: `${githubUrl}/releases/download/v${version}/system.json`,
          notes: `${githubUrl}/releases/tag/${version}`,
          compatibility: {
            minimum: compatibilityInfo.minimum,
            verified: compatibilityInfo.verified,
            maximum: compatibilityInfo.maximum,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Error updating release version:", error);
    process.exit(1);
  }
}

updateReleaseVersion(
  process.env.RELEASE_GITHUB_URL ?? "",
  process.env.RELEASE_VERSION ?? "",
  process.env.RELEASE_AUTH_TOKEN ?? ""
);