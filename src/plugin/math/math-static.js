/**
 * Static math plugin for reveal.js that uses pre-loaded MathJax/KaTeX.
 * Libraries must be loaded via static <script> tags before this plugin.
 * This eliminates dynamic script element creation.
 */

const MathJax3 = () => {
    let deck;

    return {
        id: "mathjax3",
        init: (reveal) => {
            deck = reveal;

            if (typeof MathJax === "undefined") {
                console.warn(
                    "MathJax3: MathJax not loaded. Math rendering disabled.",
                );
                return;
            }

            if (MathJax.startup?.promise) {
                MathJax.startup.promise.then(() => {
                    if (MathJax.typesetPromise) {
                        MathJax.typesetPromise(deck.getRevealElement()).then(
                            () => {
                                deck.layout();
                            },
                        );
                    }
                });
            }

            deck.on("slidechanged", (event) => {
                if (MathJax.typesetPromise) {
                    MathJax.typesetPromise([event.currentSlide]).catch((err) =>
                        console.error("MathJax typeset error:", err),
                    );
                }
            });
        },
    };
};

const KaTeX = () => {
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

    function renderMath(element, options) {
        if (typeof renderMathInElement === "function") {
            renderMathInElement(element, options);
        }
    }

    return {
        id: "katex",
        init: (reveal) => {
            deck = reveal;

            if (
                typeof katex === "undefined" ||
                typeof renderMathInElement === "undefined"
            ) {
                console.warn(
                    "KaTeX: KaTeX not loaded. Math rendering disabled.",
                );
                return;
            }

            const revealOptions = deck.getConfig().katex || {};
            const options = { ...defaultOptions, ...revealOptions };

            const slides = deck
                .getRevealElement()
                .querySelectorAll(".slides section");
            slides.forEach((slide) => {
                renderMath(slide, options);
            });
            deck.layout();

            deck.on("slidechanged", (event) => {
                renderMath(event.currentSlide, options);
            });
        },
    };
};

// Export for reveal.js plugin system
window.RevealMath = {
    MathJax3: MathJax3,
    KaTeX: KaTeX,
};
