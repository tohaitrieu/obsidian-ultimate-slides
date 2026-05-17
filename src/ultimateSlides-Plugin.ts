import { addIcon, MarkdownView, Plugin, type TAbstractFile } from "obsidian";
import type { UltimateSlidesSettings } from "./@types";
import { EmbeddedSlideProcessor } from "./obsidian/embeddedSlideProcessor";
import { ObsidianUtils } from "./obsidian/obsidianUtils";
import { AutoCompleteSuggest } from "./obsidian/suggesters/AutoCompleteSuggester";
import { LineSelectionListener } from "./obsidian/suggesters/lineSelectionListener";
import {
    REVEAL_PREVIEW_VIEW,
    RevealPreviewView,
} from "./reveal/revealPreviewView";
import { RevealServer } from "./reveal/revealServer";
import {
    DEFAULT_SETTINGS,
    ICON_DATA,
    REFRESH_ICON,
    TEMPLATE_ICON,
} from "./ultimateSlides-constants";
import { UltimateSlidesDistribution } from "./ultimateSlides-Distribution";
import { UltimateSlidesSettingTab } from "./ultimateSlides-SettingTab";
import { TemplateManager } from "./template-inserter/TemplateManager";
import { TemplateInserterModal } from "./template-inserter/TemplateInserterModal";

export class UltimateSlidesPlugin extends Plugin {
    settings: UltimateSlidesSettings;
    obsidianUtils: ObsidianUtils;
    templateManager: TemplateManager;

    private revealServer: RevealServer;
    private autoCompleteSuggester: AutoCompleteSuggest;
    private target: TAbstractFile;
    private slideProcessor: EmbeddedSlideProcessor;
    private port: number;
    private host: string;
    private serverUrl: URL;

    async onload() {
        await this.loadSettings();

        addIcon("slides", ICON_DATA);
        addIcon("refresh", REFRESH_ICON);
        addIcon("template", TEMPLATE_ICON);

        const numPort = Number(this.settings.port);
        this.port = Number.isNaN(numPort) ? 3000 : numPort;
        this.host = this.settings.host || "localhost";
        this.serverUrl = new URL(`http://${this.host}:${this.port}`);

        this.obsidianUtils = new ObsidianUtils(this.app, this.settings);

        // Initialize template manager
        this.templateManager = new TemplateManager(this);
        await this.templateManager.loadTemplates();

        this.registerView(
            REVEAL_PREVIEW_VIEW,
            (leaf) =>
                new RevealPreviewView(
                    leaf,
                    this.url,
                    this,
                    this.settings,
                    this.hideView.bind(this),
                ),
        );
        this.registerEvent(
            this.app.vault.on("modify", this.onChange.bind(this)),
        );
        this.registerEditorSuggest(new LineSelectionListener(this.app, this));

        this.addRibbonIcon("slides", "Show slide preview", async () => {
            await this.showView();
        });

        // Template inserter ribbon icon
        this.addRibbonIcon("template", "Insert slide template", () => {
            this.openTemplateInserter();
        });

        this.addCommand({
            id: "open-preview",
            name: "Show slide preview",
            callback: async () => this.toggleView(),
        });
        this.addCommand({
            id: "reload-preview",
            name: "Reload slide preview",
            callback: () => {
                const instance = this.getViewInstance();
                if (!instance) {
                    return;
                }
                instance.onChange();
            },
        });
        this.addCommand({
            id: "print-active-presentation",
            name: "Print active presentation",
            callback: async () => {
                await this.showView();
                const instance = this.getViewInstance();
                if (!instance) {
                    return;
                }
                instance.printPresentation();
            },
        });
        this.addCommand({
            id: "export-active-presentation-html",
            name: "Export active presentation as html",
            callback: async () => {
                await this.showView();
                const instance = this.getViewInstance();
                if (!instance) {
                    return;
                }
                instance.exportAsHtml();
            },
        });
        this.addCommand({
            id: "stop-server-preview",
            name: "Stop slide preview server",
            callback: async () => this.revealServer.stop(),
        });
        this.addCommand({
            id: "start-server-preview",
            name: "Start slide preview server",
            callback: async () => this.revealServer.start(),
        });

        // Template inserter command
        this.addCommand({
            id: "insert-slide-template",
            name: "Insert slide template",
            editorCallback: (editor) => {
                new TemplateInserterModal(this.app, this.templateManager, editor).open();
            },
        });

        this.addSettingTab(new UltimateSlidesSettingTab(this.app, this));
        this.app.workspace.onLayoutReady(this.layoutReady);

        this.slideProcessor = new EmbeddedSlideProcessor(this);
        this.registerMarkdownCodeBlockProcessor(
            "slide",
            this.slideProcessor.handler,
        );
        this.registerMarkdownPostProcessor(
            this.obsidianUtils.markdownProcessor.postProcess,
        );
    }

    openTemplateInserter() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            new TemplateInserterModal(this.app, this.templateManager, view.editor).open();
        }
    }

    get url(): URL {
        return this.serverUrl;
    }

    layoutReady = async () => {
        try {
            const version = this.manifest.version;
            const distribution = new UltimateSlidesDistribution(this);

            console.log(
                "Ultimate Slides v%s, needsReload=%s",
                version,
                distribution.isOutdated(),
            );
            if (distribution.isOutdated()) {
                await distribution.update();
                console.log("Ultimate Slides updated to v%s", version);
            }

            this.configureServer();
            await this.initServer();
        } catch (err) {
            console.debug("Ultimate Slides caught an error", err);
        }

        this.autoCompleteSuggester = new AutoCompleteSuggest(this.app);

        if (this.settings.autoComplete !== "never") {
            this.autoCompleteSuggester.activate();
        }
        this.registerEditorSuggest(this.autoCompleteSuggester);
    };

    getViewInstance(): RevealPreviewView {
        for (const leaf of this.app.workspace.getLeavesOfType(
            REVEAL_PREVIEW_VIEW,
        )) {
            const view = leaf.view;
            if (view instanceof RevealPreviewView) {
                return view;
            }
        }
        return null;
    }

    getTargetName(): string {
        return this.target ? this.target.name : "";
    }

    onChange(file: TAbstractFile) {
        if (!this.settings.autoReload) {
            return;
        }
        const instance = this.getViewInstance();
        if (!instance) {
            return;
        }
        if (file === this.target) {
            instance.onChange();
        }
    }

    async toggleView() {
        const instance = this.getViewInstance();
        if (instance) {
            this.app.workspace.detachLeavesOfType(REVEAL_PREVIEW_VIEW);
            if (this.settings.autoComplete === "inPreview") {
                this.autoCompleteSuggester.deactivate();
            }
        } else {
            if (this.settings.autoComplete !== "never") {
                this.autoCompleteSuggester.activate();
            }
            await this.showView();
        }
    }

    hideView() {
        if (this.settings.autoComplete === "inPreview") {
            this.autoCompleteSuggester.deactivate();
        }
    }

    async showView() {
        const targetDocument = this.app.workspace.getActiveFile();
        if (!targetDocument) {
            return;
        }
        if (
            targetDocument === this.target &&
            this.app.workspace.getLeavesOfType(REVEAL_PREVIEW_VIEW).length > 0
        ) {
            return;
        }
        this.target = targetDocument;
        await this.activateView();

        const url = this.revealServer.getTargetUrl(this.target);
        await this.openUrl(url);
    }

    configureServer = () => {
        this.revealServer = new RevealServer(
            this.obsidianUtils,
            this.port,
            this.host,
            this.url,
        );
    };

    initServer = async () => {
        if (this.settings.autoStart) {
            await this.revealServer.start();
        }

        const instance = this.getViewInstance();
        if (instance) {
            if (instance.url === "about:blank") {
                await this.showView();
            }
        }
    };

    stopServer = async () => {
        if (this.revealServer) {
            await this.revealServer.stop();
        }
        const instance = this.getViewInstance();
        if (instance) {
            await instance.onClose();
        }
    };

    private async openUrl(url: URL) {
        const instance = this.getViewInstance();
        instance.setUrl(url.toString());
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(REVEAL_PREVIEW_VIEW);
        if (this.settings.paneMode === "sidebar") {
            await this.app.workspace.getRightLeaf(true).setViewState({
                type: REVEAL_PREVIEW_VIEW,
                active: true,
            });
        } else {
            await this.app.workspace
                .getLeaf(this.settings.paneMode)
                .setViewState({
                    type: REVEAL_PREVIEW_VIEW,
                    active: false,
                });
        }
        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(REVEAL_PREVIEW_VIEW)[0],
        );
    }

    async onunload() {
        console.debug("unloading Ultimate Slides");
        await this.stopServer();
    }

    async loadSettings() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
        // Migrate renamed setting
        if (data?.themeDirectory && !data?.assetsDirectory) {
            this.settings.assetsDirectory = data.themeDirectory;
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
        console.debug("Ultimate Slides: settings saved");

        await this.stopServer();

        const numPort = Number(this.settings.port);
        this.port = Number.isNaN(numPort) ? 3000 : numPort;
        this.host = this.settings.host || "localhost";
        this.serverUrl = new URL(`http://${this.host}:${this.port}`);

        this.obsidianUtils = new ObsidianUtils(this.app, this.settings);
        this.configureServer();
        await this.initServer();
        const instance = this.getViewInstance();
        if (instance) {
            await instance.onChange();
        }
    }

    async update(newSettings: UltimateSlidesSettings) {
        this.settings = newSettings;
        await this.saveSettings();
    }
}
