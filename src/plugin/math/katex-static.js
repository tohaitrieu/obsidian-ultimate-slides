/**
 * Modified KaTeX plugin that uses pre-loaded KaTeX instead of dynamic script creation.
 * KaTeX must be loaded via static <script> tag before this plugin initializes.
 */
export const KaTeX = () => {
    let deck;

    const defaultOptions = {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    };

    function renderMath(element) {
        if (typeof renderMathInElement === "function") {
            renderMathInElement(element, defaultOptions);
        }
    }

    return {
        id: "katex",
        init: (reveal) => {
            deck = reveal;

            // Check if KaTeX is already loaded (via static script tag)
            if (
                typeof katex === "undefined" ||
                typeof renderMathInElement === "undefined"
            ) {
                console.warn(
                    "KaTeX plugin: KaTeX not found. Math rendering disabled.",
                );
                return;
            }

            // Render math in all slides
            const slides = deck
                .getRevealElement()
                .querySelectorAll(".slides section");
            slides.forEach((slide) => {
                renderMath(slide);
            });
            deck.layout();

            // Re-render on slide change
            deck.on("slidechanged", (event) => {
                renderMath(event.currentSlide);
            });
        },
    };
};

export default KaTeX;
