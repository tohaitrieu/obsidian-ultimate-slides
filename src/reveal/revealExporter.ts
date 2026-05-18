import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { Platform } from "obsidian";

async function emptyDir(dir: string): Promise<void> {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
}

async function copy(src: string, dest: string): Promise<void> {
    await cp(src, dest, { recursive: true });
}

function outputFileSync(filePath: string, data: Buffer): void {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, data);
}

import type { ObsidianUtils } from "../obsidian/obsidianUtils";

export class RevealExporter {
    private pluginDirectory: string;
    private exportDirectory: string;
    private vaultDirectory: string;

    constructor(utils: ObsidianUtils) {
        this.pluginDirectory = utils.pluginDirectory;
        this.exportDirectory = utils.exportDirectory;
        this.vaultDirectory = utils.vaultDirectory;
    }

    public async export(
        filePath: string,
        html: string,
        imgList: string[],
        localAssetPaths: string[] = [],
    ) {
        const ext = path.extname(filePath);
        const folderName = path.basename(filePath).replaceAll(ext, "");
        const folderDir = path.join(this.exportDirectory, folderName);
        const sourceDir = path.dirname(filePath);
        const vaultDir = this.vaultDirectory.replace(/\/$/, "");

        console.debug("export", sourceDir, vaultDir, folderDir);

        await emptyDir(folderDir);
        await writeFile(path.join(folderDir, "index.html"), html);

        // TODO: let's track what css, scripts, and plugins are actually used
        // rather than copying everything.
        await copy(
            path.join(this.pluginDirectory, "css"),
            path.join(folderDir, "css"),
        );
        await copy(
            path.join(this.pluginDirectory, "dist"),
            path.join(folderDir, "dist"),
        );
        await copy(
            path.join(this.pluginDirectory, "plugin"),
            path.join(folderDir, "plugin"),
        );

        for (const img of imgList) {
            console.debug("export", img);
            if (img.startsWith("http")) {
                continue;
            }
            if (img.startsWith("/local-file-url")) {
                const urlpath = img.replace(
                    "/local-file-url",
                    Platform.resourcePathPrefix,
                );
                const result = await fetch(urlpath).catch((error) => {
                    return new Response(null, {
                        status: 404,
                        statusText: error.messge,
                    });
                });
                if (result.ok) {
                    if (result.blob) {
                        const blob = await result.blob();
                        const bytes = await blob.arrayBuffer();
                        outputFileSync(
                            path.join(folderDir, img),
                            Buffer.from(bytes),
                        );
                    } else {
                        console.info(
                            "open a bug to handle this kind of response. Include this message",
                            result,
                        );
                    }
                } else {
                    console.error(result.statusText);
                }
                continue;
            }
            let imgPath = path.join(vaultDir, img);
            if (sourceDir !== vaultDir) {
                const relative = path.join(sourceDir, img);
                if (existsSync(relative)) {
                    imgPath = relative;
                }
            }
            console.debug("img", img, imgPath, sourceDir !== vaultDir);
            await copy(imgPath, path.join(folderDir, img));
        }

        for (const asset of localAssetPaths) {
            if (
                asset.startsWith("http") ||
                asset.startsWith("dist/") ||
                asset.startsWith("css/") ||
                asset.startsWith("plugin/")
            ) {
                continue;
            }
            let assetPath = path.join(vaultDir, asset);
            if (sourceDir !== vaultDir) {
                const relative = path.join(sourceDir, asset);
                if (existsSync(relative)) {
                    assetPath = relative;
                }
            }
            if (existsSync(assetPath)) {
                await copy(assetPath, path.join(folderDir, asset));
            }
        }

        window.open(`file://${folderDir}`);
    }
}
