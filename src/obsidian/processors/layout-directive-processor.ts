import type { Processor } from "src/@types";

/**
 * LayoutDirectiveProcessor
 *
 * Converts markdown-friendly layout directives into grid HTML.
 *
 * Supported directives:
 * - columns-2, columns-3, columns-4
 * - grid-2x2
 * - timeline
 *
 * Example:
 * ```
 * columns-3
 * ### Column 1
 * Content here
 *
 * ### Column 2
 * More content
 *
 * ### Column 3
 * Last column
 * ```
 */
export class LayoutDirectiveProcessor implements Processor {
    process(markdown: string): string {
        // Process each slide separately
        const slides = markdown.split(/\n---\n/);
        const processedSlides = slides.map((slide) => this.processSlide(slide));
        return processedSlides.join("\n---\n");
    }

    private processSlide(slide: string): string {
        // Skip if slide contains code blocks with directives (documentation examples)
        if (this.hasDirectiveInCodeBlock(slide)) {
            return slide;
        }

        // Check for columns-N directive
        const columnsMatch = slide.match(/^(columns-(\d))\s*$/m);
        if (columnsMatch) {
            const numColumns = Number.parseInt(columnsMatch[2], 10);
            if (numColumns >= 2 && numColumns <= 4) {
                return this.processColumns(slide, columnsMatch[0], numColumns);
            }
        }

        // Check for grid-2x2 directive
        if (/^grid-2x2\s*$/m.test(slide)) {
            return this.processGrid2x2(slide);
        }

        // Check for timeline directive
        if (/^timeline\s*$/m.test(slide)) {
            return this.processTimeline(slide);
        }

        return slide;
    }

    private hasDirectiveInCodeBlock(slide: string): boolean {
        // Check if directives appear inside code blocks
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = slide.match(codeBlockRegex) || [];
        for (const block of codeBlocks) {
            if (/columns-\d|grid-2x2|timeline/.test(block)) {
                return true;
            }
        }
        return false;
    }

    private processColumns(
        slide: string,
        directive: string,
        numColumns: number,
    ): string {
        // Remove the directive line
        const content = slide.replace(
            new RegExp(`^${directive}\\s*$`, "m"),
            "",
        );

        // Split by ### headings
        const sections = content.split(/(?=^### )/m).filter((s) => s.trim());

        // Separate the title part (before first ###)
        let titlePart = "";
        let columnSections = sections;

        if (sections.length > 0 && !sections[0].startsWith("### ")) {
            titlePart = sections[0];
            columnSections = sections.slice(1);
        }

        // Generate split HTML with divs for each column
        const divs = columnSections.slice(0, numColumns).map((section) => {
            return `<div>\n\n${section.trim()}\n\n</div>`;
        });

        return `${titlePart}\n<split even>\n\n${divs.join("\n\n")}\n\n</split>`;
    }

    private processGrid2x2(slide: string): string {
        // Remove the directive line
        const content = slide.replace(/^grid-2x2\s*$/m, "");

        // Split by ### headings
        const sections = content.split(/(?=^### )/m).filter((s) => s.trim());

        // Separate the title part
        let titlePart = "";
        let gridSections = sections;

        if (sections.length > 0 && !sections[0].startsWith("### ")) {
            titlePart = sections[0];
            gridSections = sections.slice(1);
        }

        // Grid positions for 2x2 - positioned below title (y starts at 22%)
        const positions = [
            { x: 2, y: 22 }, // top-left
            { x: 51, y: 22 }, // top-right
            { x: 2, y: 58 }, // bottom-left
            { x: 51, y: 58 }, // bottom-right
        ];

        const grids = gridSections.slice(0, 4).map((section, index) => {
            const pos = positions[index];
            return `<grid drag="47 33" drop="${pos.x} ${pos.y}" align="topleft">\n\n${section.trim()}\n\n</grid>`;
        });

        // Put title in its own grid at top to avoid centering issues
        const titleGrid = titlePart.trim()
            ? `<grid drag="100 18" drop="0 2" align="center">\n\n${titlePart.trim()}\n\n</grid>\n\n`
            : "";

        return `${titleGrid}${grids.join("\n\n")}`;
    }

    private processTimeline(slide: string): string {
        // Remove the directive line
        const content = slide.replace(/^timeline\s*$/m, "");

        // Split by ### headings
        const sections = content.split(/(?=^### )/m).filter((s) => s.trim());

        // Separate the title part
        let titlePart = "";
        let timelineSections = sections;

        if (sections.length > 0 && !sections[0].startsWith("### ")) {
            titlePart = sections[0];
            timelineSections = sections.slice(1);
        }

        // Generate split HTML with divs for each timeline item
        const divs = timelineSections.slice(0, 5).map((section) => {
            return `<div>\n\n${section.trim()}\n\n</div>`;
        });

        return `${titlePart}\n<split even>\n\n${divs.join("\n\n")}\n\n</split>`;
    }
}
