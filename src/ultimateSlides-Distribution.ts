import {
    existsSync,
    mkdirSync,
    readFileSync,
    renameSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import { requestUrl } from "obsidian";
import type { UltimateSlidesPlugin } from "./ultimateSlides-Plugin";

export class UltimateSlidesDistribution {
    plugin: UltimateSlidesPlugin;
    pluginDirectory: string;
    distDirectory: string;

    constructor(plugin: UltimateSlidesPlugin) {
        this.plugin = plugin;
        this.pluginDirectory = this.plugin.obsidianUtils.pluginDirectory;
        this.distDirectory = this.plugin.obsidianUtils.distDirectory;
    }

    isOutdated(): boolean {
        // Ultimate Slides bundles everything at build time - never outdated
        return false;
    }

    isOldVersion(): boolean {
        // Always return false - we don't need version-based updates
        // Everything is bundled with the plugin
        return false;
    }

    async update() {
        // Ultimate Slides bundles everything - skip download if dist exists
        if (existsSync(this.distDirectory)) {
            const revealJs = path.join(this.distDirectory, "reveal.js");
            if (existsSync(revealJs)) {
                console.log(
                    "Ultimate Slides: All assets already present, skipping download.",
                );
                return;
            }
        }

        // Fallback: try to download (will likely fail but handles edge cases)
        const version = this.plugin.manifest.version;
        const downloadUrl = `https://github.com/ebullient/obsidian-slides-extended/releases/download/${version}/slides-extended.zip`;

        // Backup existing dist directory before attempting update
        // Use dist-backup instead of dist/.backup to avoid issues with trailing slashes
        const backupDir = path.join(this.pluginDirectory, "dist-backup");
        let didBackup = false;

        if (existsSync(this.distDirectory)) {
            console.debug(
                "Backing up existing distribution files before update",
            );
            // Remove any existing backup first
            if (existsSync(backupDir)) {
                rmSync(backupDir, { recursive: true, force: true });
            }
            renameSync(this.distDirectory, backupDir);
            didBackup = true;
        }

        try {
            const response = await requestUrl(downloadUrl);
            if (response.status !== 200) {
                throw new Error(
                    `Failed to download ${downloadUrl}: HTTP ${response.status}`,
                );
            }

            const zip = new JSZip();
            const contents = await zip.loadAsync(response.arrayBuffer);
            const pluginDirectory = this.pluginDirectory;

            for (const filename of Object.keys(contents.files)) {
                if (!contents.files[filename].dir) {
                    zip.file(filename)
                        .async("nodebuffer")
                        .then((content) => {
                            const dest = path.join(pluginDirectory, filename);
                            const dir = path.dirname(dest);
                            mkdirSync(dir, { recursive: true });
                            writeFileSync(dest, content);
                        });
                }
            }

            // Update successful, remove backup
            if (didBackup && existsSync(backupDir)) {
                console.debug("Update successful, removing backup");
                rmSync(backupDir, { recursive: true, force: true });
            }
        } catch (error) {
            console.error("Failed to update distribution files:", error);

            // Restore backup on failure
            if (didBackup && existsSync(backupDir)) {
                console.debug("Restoring backup due to update failure");
                // Remove partial update if it exists
                if (existsSync(this.distDirectory)) {
                    rmSync(this.distDirectory, {
                        recursive: true,
                        force: true,
                    });
                }
                renameSync(backupDir, this.distDirectory);
            }

            throw error;
        }
    }
}
