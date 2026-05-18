/**
 * Modified MathJax3 plugin that uses pre-loaded MathJax instead of dynamic script creation.
 * MathJax must be loaded via static <script> tag before this plugin initializes.
 */
export const MathJax3 = () => {
    let deck;

    return {
        id: "mathjax3",
        init: (reveal) => {
            deck = reveal;

            // Check if MathJax is already loaded (via static script tag)
            if (typeof MathJax === "undefined") {
                console.warn(
                    "MathJax3 plugin: MathJax not found. Math rendering disabled.",
                );
                return;
            }

            // Wait for MathJax to be ready, then typeset
            if (MathJax.startup?.promise) {
                MathJax.startup.promise.then(() => {
                    // Typeset the slides
                    if (MathJax.typesetPromise) {
                        MathJax.typesetPromise(deck.getRevealElement()).then(
                            () => {
                                deck.layout();
                            },
                        );
                    }
                });
            }

            // Re-typeset on slide change
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

export default MathJax3;
