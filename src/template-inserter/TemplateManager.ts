import { type App, normalizePath } from "obsidian";
import type { UltimateSlidesPlugin } from "../ultimateSlides-Plugin";
import { ALL_TEMPLATE_CONTENT } from "./template-content";

export interface SlideTemplate {
    id: string;
    name: string;
    category: string;
    content: string;
    description: string;
    icon: string;
}

// Built-in template definitions
const BUILT_IN_TEMPLATES: Omit<SlideTemplate, "content">[] = [
    {
        id: "presentation-starter",
        name: "Full Presentation",
        category: "Starter",
        description:
            "Complete presentation with frontmatter, agenda, and slides",
        icon: "🚀",
    },
    {
        id: "slide-with-frontmatter",
        name: "Slide with Frontmatter",
        category: "Starter",
        description: "Single slide with full frontmatter configuration",
        icon: "📄",
    },
    {
        id: "text-image-1-3",
        name: "Text + Image (1/3 + 2/3)",
        category: "Layout",
        description: "Text left 30%, image right 65%",
        icon: "📊",
    },
    {
        id: "image-overlay-bottom",
        name: "Image Overlay Bottom",
        category: "Layout",
        description: "Full image with title overlay at bottom",
        icon: "🖼️",
    },
    {
        id: "2-columns",
        name: "2 Columns",
        category: "Layout",
        description: "Two equal columns 50/50",
        icon: "▥",
    },
    {
        id: "3-columns",
        name: "3 Columns",
        category: "Layout",
        description: "Three equal columns",
        icon: "▤",
    },
    {
        id: "grid-2x2",
        name: "Grid 2x2",
        category: "Layout",
        description: "Four images in a grid",
        icon: "⊞",
    },
    {
        id: "section-header",
        name: "Section Header",
        category: "Structure",
        description: "Section title with gradient background",
        icon: "📑",
    },
    {
        id: "key-levels",
        name: "Key Levels",
        category: "Trading",
        description: "Support/Resistance with trading setup",
        icon: "📈",
    },
    {
        id: "table",
        name: "Table",
        category: "Data",
        description: "4-column data table",
        icon: "📋",
    },
    {
        id: "fragment-list",
        name: "Fragment List",
        category: "Content",
        description: "Animated list items",
        icon: "📝",
    },
    {
        id: "timeline",
        name: "Timeline",
        category: "Layout",
        description: "4-point horizontal timeline",
        icon: "⏱️",
    },
    {
        id: "stats-cards",
        name: "Stats Cards",
        category: "Data",
        description: "3 stats with insight",
        icon: "🔢",
    },
    {
        id: "before-after",
        name: "Before/After",
        category: "Comparison",
        description: "Side-by-side comparison",
        icon: "🔄",
    },
    {
        id: "pros-cons",
        name: "Pros/Cons",
        category: "Comparison",
        description: "Bull/Bear analysis",
        icon: "⚖️",
    },
    {
        id: "steps-process",
        name: "Steps Process",
        category: "Layout",
        description: "4-step process flow",
        icon: "🔢",
    },
    {
        id: "quiz",
        name: "Quiz",
        category: "Interactive",
        description: "Question with 4 options",
        icon: "❓",
    },
    {
        id: "quote",
        name: "Quote",
        category: "Content",
        description: "Centered quote with author",
        icon: "💬",
    },
    {
        id: "video-background",
        name: "Video Background",
        category: "Media",
        description: "Video as slide background",
        icon: "🎬",
    },
    {
        id: "iframe-embed",
        name: "Iframe Embed",
        category: "Media",
        description: "Embed external content",
        icon: "🌐",
    },
    {
        id: "comparison-table",
        name: "Comparison Table",
        category: "Data",
        description: "Compare multiple options",
        icon: "📊",
    },
    {
        id: "checklist",
        name: "Checklist",
        category: "Content",
        description: "Animated checkbox list",
        icon: "☑️",
    },
    {
        id: "kpi-dashboard",
        name: "KPI Dashboard",
        category: "Data",
        description: "4 KPI cards with insight",
        icon: "📉",
    },
    {
        id: "code-highlight",
        name: "Code Highlight",
        category: "Content",
        description: "Code block with line highlighting",
        icon: "💻",
    },
    {
        id: "cta",
        name: "Call to Action",
        category: "Structure",
        description: "CTA with button",
        icon: "🎯",
    },
    {
        id: "thank-you",
        name: "Thank You",
        category: "Structure",
        description: "Closing slide",
        icon: "🙏",
    },
    // Mermaid templates
    {
        id: "mermaid-flowchart",
        name: "Flowchart",
        category: "Mermaid",
        description: "Decision tree / flowchart",
        icon: "🔀",
    },
    {
        id: "mermaid-mindmap",
        name: "Mindmap",
        category: "Mermaid",
        description: "Mind map diagram",
        icon: "🧠",
    },
    {
        id: "mermaid-sequence",
        name: "Sequence",
        category: "Mermaid",
        description: "Sequence diagram",
        icon: "↔️",
    },
    {
        id: "mermaid-timeline",
        name: "Timeline",
        category: "Mermaid",
        description: "Timeline diagram",
        icon: "📅",
    },
    {
        id: "mermaid-gantt",
        name: "Gantt Chart",
        category: "Mermaid",
        description: "Project gantt chart",
        icon: "📊",
    },
    {
        id: "mermaid-pie",
        name: "Pie Chart",
        category: "Mermaid",
        description: "Pie chart with data",
        icon: "🥧",
    },
    {
        id: "mermaid-journey",
        name: "User Journey",
        category: "Mermaid",
        description: "User journey map",
        icon: "🚶",
    },
    {
        id: "mermaid-quadrant",
        name: "Quadrant",
        category: "Mermaid",
        description: "Quadrant chart",
        icon: "📐",
    },
    {
        id: "mermaid-er",
        name: "ER Diagram",
        category: "Mermaid",
        description: "Entity relationship",
        icon: "🗃️",
    },
    {
        id: "mermaid-state",
        name: "State Diagram",
        category: "Mermaid",
        description: "State machine",
        icon: "🔄",
    },
    {
        id: "mermaid-class",
        name: "Class Diagram",
        category: "Mermaid",
        description: "UML class diagram",
        icon: "📦",
    },
    {
        id: "mermaid-git",
        name: "Git Graph",
        category: "Mermaid",
        description: "Git branch visualization",
        icon: "🌿",
    },
];

export class TemplateManager {
    private plugin: UltimateSlidesPlugin;
    private app: App;
    private builtInTemplates: Map<string, SlideTemplate> = new Map();
    private userTemplates: Map<string, SlideTemplate> = new Map();

    constructor(plugin: UltimateSlidesPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;
    }

    async loadTemplates(): Promise<void> {
        await this.loadBuiltInTemplates();
        await this.loadUserTemplates();
    }

    private async loadBuiltInTemplates(): Promise<void> {
        for (const templateDef of BUILT_IN_TEMPLATES) {
            const content = this.getBuiltInTemplateContent(templateDef.id);
            this.builtInTemplates.set(templateDef.id, {
                ...templateDef,
                content,
            });
        }
    }

    private async loadUserTemplates(): Promise<void> {
        const userTemplatePath = this.plugin.settings.userTemplatesFolder;
        if (!userTemplatePath) return;

        const folder = this.app.vault.getAbstractFileByPath(
            normalizePath(userTemplatePath),
        );
        if (!folder || folder.constructor.name !== "TFolder") return;

        const files = this.app.vault
            .getMarkdownFiles()
            .filter((f) => f.path.startsWith(userTemplatePath));

        for (const file of files) {
            const content = await this.app.vault.read(file);
            const id = file.basename.replace("slide-", "");
            this.userTemplates.set(id, {
                id: `user-${id}`,
                name: this.formatName(id),
                category: "Custom",
                content,
                description: "User template",
                icon: "⭐",
            });
        }
    }

    private formatName(id: string): string {
        return id
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    getAllTemplates(): SlideTemplate[] {
        return [...this.builtInTemplates, ...this.userTemplates];
    }

    getCategories(): string[] {
        const categories = new Set<string>();
        for (const t of this.getAllTemplates()) {
            categories.add(t.category);
        }
        return Array.from(categories);
    }

    getTemplatesByCategory(category: string): SlideTemplate[] {
        return this.getAllTemplates().filter((t) => t.category === category);
    }

    getTemplate(id: string): SlideTemplate | undefined {
        return this.builtInTemplates.get(id) || this.userTemplates.get(id);
    }

    private getBuiltInTemplateContent(id: string): string {
        return (
            ALL_TEMPLATE_CONTENT[id] || "---\n\n## Slide Title\n\nContent here"
        );
    }
}
