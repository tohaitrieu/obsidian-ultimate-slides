import { type App, type Editor, Modal } from "obsidian";
import type { SlideTemplate, TemplateManager } from "./TemplateManager";

export class TemplateInserterModal extends Modal {
    private templateManager: TemplateManager;
    private editor: Editor;
    private selectedCategory = "All";
    private searchQuery = "";

    constructor(app: App, templateManager: TemplateManager, editor: Editor) {
        super(app);
        this.templateManager = templateManager;
        this.editor = editor;
    }

    onOpen() {
        const { contentEl, modalEl } = this;
        contentEl.empty();
        modalEl.addClass("ultimate-slides-template-modal");

        // Header
        const header = contentEl.createDiv({ cls: "us-modal-header" });
        header.createEl("h2", { text: "📊 Insert Slide Template" });

        // Search bar
        const searchContainer = contentEl.createDiv({
            cls: "us-search-container",
        });
        const searchInput = searchContainer.createEl("input", {
            type: "text",
            placeholder: "Search templates...",
            cls: "us-search-input",
        });
        searchInput.addEventListener("input", (e) => {
            this.searchQuery = (
                e.target as HTMLInputElement
            ).value.toLowerCase();
            this.renderTemplates(templateGrid);
        });

        // Category tabs
        const tabsContainer = contentEl.createDiv({ cls: "us-tabs-container" });
        const categories = ["All", ...this.templateManager.getCategories()];

        for (const category of categories) {
            const tab = tabsContainer.createEl("button", {
                text: category,
                cls: `us-tab ${category === this.selectedCategory ? "us-tab-active" : ""}`,
            });
            tab.addEventListener("click", () => {
                this.selectedCategory = category;
                tabsContainer
                    .querySelectorAll(".us-tab")
                    .forEach((t) => t.removeClass("us-tab-active"));
                tab.addClass("us-tab-active");
                this.renderTemplates(templateGrid);
            });
        }

        // Template grid
        const templateGrid = contentEl.createDiv({ cls: "us-template-grid" });
        this.renderTemplates(templateGrid);
    }

    private renderTemplates(container: HTMLElement) {
        container.empty();

        let templates = this.templateManager.getAllTemplates();

        // Filter by category
        if (this.selectedCategory !== "All") {
            templates = templates.filter(
                (t) => t.category === this.selectedCategory,
            );
        }

        // Filter by search
        if (this.searchQuery) {
            templates = templates.filter(
                (t) =>
                    t.name.toLowerCase().includes(this.searchQuery) ||
                    t.description.toLowerCase().includes(this.searchQuery),
            );
        }

        if (templates.length === 0) {
            container.createEl("p", {
                text: "No templates found",
                cls: "us-no-results",
            });
            return;
        }

        for (const template of templates) {
            const card = container.createDiv({ cls: "us-template-card" });

            // Preview skeleton
            const preview = card.createDiv({ cls: "us-template-preview" });
            this.renderPreviewSkeleton(preview, template.id);

            // Info
            const info = card.createDiv({ cls: "us-template-info" });
            info.createEl("span", {
                text: template.icon,
                cls: "us-template-icon",
            });
            info.createEl("span", {
                text: template.name,
                cls: "us-template-name",
            });

            // Category badge
            const badge = card.createDiv({ cls: "us-template-badge" });
            badge.createEl("span", { text: template.category });

            // Click to insert
            card.addEventListener("click", () => {
                this.insertTemplate(template);
            });

            // Hover tooltip
            card.setAttribute("title", template.description);
        }
    }

    private renderPreviewSkeleton(container: HTMLElement, templateId: string) {
        const skeletonMap: Record<string, () => void> = {
            "text-image-1-3": () => {
                const left = container.createDiv({
                    cls: "us-skel-col us-skel-30",
                });
                left.createDiv({ cls: "us-skel-title" });
                left.createDiv({ cls: "us-skel-line" });
                left.createDiv({ cls: "us-skel-line us-skel-short" });
                container.createDiv({
                    cls: "us-skel-col us-skel-65 us-skel-image",
                });
            },
            "image-overlay-bottom": () => {
                container.createDiv({ cls: "us-skel-image us-skel-full" });
                const overlay = container.createDiv({
                    cls: "us-skel-overlay-bottom",
                });
                overlay.createDiv({ cls: "us-skel-title" });
            },
            "2-columns": () => {
                container
                    .createDiv({ cls: "us-skel-col us-skel-45" })
                    .createDiv({ cls: "us-skel-lines" });
                container
                    .createDiv({ cls: "us-skel-col us-skel-45" })
                    .createDiv({ cls: "us-skel-lines" });
            },
            "3-columns": () => {
                for (let i = 0; i < 3; i++) {
                    container
                        .createDiv({ cls: "us-skel-col us-skel-30" })
                        .createDiv({ cls: "us-skel-lines" });
                }
            },
            "grid-2x2": () => {
                container.addClass("us-skel-grid-2x2");
                for (let i = 0; i < 4; i++) {
                    container.createDiv({
                        cls: "us-skel-grid-item us-skel-image",
                    });
                }
            },
            "section-header": () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title us-skel-large" });
                container.createDiv({ cls: "us-skel-subtitle" });
            },
            "key-levels": () => {
                container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-code",
                });
                const right = container.createDiv({
                    cls: "us-skel-col us-skel-45",
                });
                for (let i = 0; i < 4; i++) {
                    right.createDiv({ cls: "us-skel-line us-skel-short" });
                }
            },
            table: () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title" });
                container.createDiv({ cls: "us-skel-table" });
            },
            "fragment-list": () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title" });
                for (let i = 0; i < 3; i++) {
                    container.createDiv({ cls: "us-skel-line" });
                }
            },
            timeline: () => {
                container.addClass("us-skel-timeline");
                for (let i = 0; i < 4; i++) {
                    const item = container.createDiv({
                        cls: "us-skel-timeline-item",
                    });
                    item.createDiv({ cls: "us-skel-dot" });
                    item.createDiv({ cls: "us-skel-line us-skel-short" });
                }
            },
            "stats-cards": () => {
                container.addClass("us-skel-cards-row");
                for (let i = 0; i < 3; i++) {
                    const card = container.createDiv({
                        cls: "us-skel-stat-card",
                    });
                    card.createDiv({ cls: "us-skel-stat-num" });
                    card.createDiv({ cls: "us-skel-line us-skel-short" });
                }
            },
            "before-after": () => {
                container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-image",
                });
                container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-image",
                });
            },
            "pros-cons": () => {
                const left = container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-green",
                });
                left.createDiv({ cls: "us-skel-lines" });
                const right = container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-red",
                });
                right.createDiv({ cls: "us-skel-lines" });
            },
            "steps-process": () => {
                container.addClass("us-skel-steps");
                for (let i = 0; i < 4; i++) {
                    const step = container.createDiv({ cls: "us-skel-step" });
                    step.createDiv({
                        cls: "us-skel-step-num",
                        text: String(i + 1),
                    });
                    step.createDiv({ cls: "us-skel-line us-skel-short" });
                }
            },
            quiz: () => {
                container.addClass("us-skel-quiz");
                container.createDiv({ cls: "us-skel-title" });
                const options = container.createDiv({
                    cls: "us-skel-quiz-options",
                });
                for (let i = 0; i < 4; i++) {
                    options.createDiv({ cls: "us-skel-quiz-option" });
                }
            },
            quote: () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-quote-mark", text: '"' });
                container.createDiv({ cls: "us-skel-line" });
                container.createDiv({ cls: "us-skel-line us-skel-short" });
            },
            "video-background": () => {
                container.addClass("us-skel-video");
                container.createDiv({ cls: "us-skel-play-btn", text: "▶" });
            },
            "iframe-embed": () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title" });
                container.createDiv({ cls: "us-skel-iframe" });
            },
            "comparison-table": () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title" });
                container.createDiv({
                    cls: "us-skel-table us-skel-table-wide",
                });
            },
            checklist: () => {
                container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-checklist",
                });
                container.createDiv({
                    cls: "us-skel-col us-skel-45 us-skel-checklist",
                });
            },
            "kpi-dashboard": () => {
                container.addClass("us-skel-cards-row");
                for (let i = 0; i < 4; i++) {
                    container.createDiv({ cls: "us-skel-kpi-card" });
                }
            },
            "code-highlight": () => {
                container.addClass("us-skel-centered");
                container.createDiv({ cls: "us-skel-title" });
                container.createDiv({ cls: "us-skel-code us-skel-code-block" });
            },
            cta: () => {
                container.addClass("us-skel-centered us-skel-gradient");
                container.createDiv({ cls: "us-skel-title us-skel-large" });
                container.createDiv({ cls: "us-skel-button" });
            },
            "thank-you": () => {
                container.addClass("us-skel-centered us-skel-gradient");
                container.createDiv({ cls: "us-skel-title us-skel-large" });
                container.createDiv({ cls: "us-skel-table us-skel-small" });
            },
        };

        const renderer = skeletonMap[templateId];
        if (renderer) {
            renderer();
        } else {
            container.createDiv({ cls: "us-skel-generic" });
        }
    }

    private insertTemplate(template: SlideTemplate) {
        const cursor = this.editor.getCursor();
        this.editor.replaceRange(template.content + "\n", cursor);
        this.close();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
