/*!
 * reveal.js Mermaid plugin (modified for Ultimate Slides)
 */

import mermaid from "mermaid/dist/mermaid.esm.mjs";

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function getInnerHtml(el) {
    let contentEl = el;
    const firstElementChild = el?.firstElementChild;
    if (firstElementChild?.tagName?.toLowerCase() === "pre") {
        contentEl = firstElementChild;
    }
    return contentEl?.innerHTML?.trim();
}

async function renderMermaid({ el, beforeRender, afterRender }) {
    const beforeRenderRes = await beforeRender?.(el);

    if (beforeRenderRes === false) {
        return;
    }

    const html = getInnerHtml(el);
    const graphDefinition = decodeHtml(html);

    try {
        const { svg: svgCode } = await mermaid.render(
            `mermaid-${Math.random().toString(36).substring(2)}`,
            graphDefinition,
        );
        el.innerHTML = svgCode;

        // Fix SVG sizing - remove max-width constraint
        const svg = el.querySelector("svg");
        if (svg) {
            svg.style.maxWidth = "none";
            svg.style.width = "90%";
            svg.removeAttribute("width");
        }

        await afterRender?.(el);
    } catch (error) {
        let errorStr = "";
        if (error?.str) {
            errorStr = error.str;
        }
        if (error?.message) {
            errorStr = error.message;
        }
        console.error(errorStr, { error, graphDefinition, el });
        el.innerHTML = errorStr;
    }
}

function getRenderMermaidEl({ beforeRender, afterRender }) {
    return function renderMermaidEl(el) {
        return renderMermaid({
            el,
            beforeRender,
            afterRender,
        });
    };
}

const Plugin = {
    id: "mermaid",

    init: (reveal) => {
        const { ...mermaidConfig } = reveal.getConfig().mermaid || {};
        const { ...mermaidPluginConfig } =
            reveal.getConfig().mermaidPlugin || {};

        if (mermaidPluginConfig.iconPacks) {
            mermaid.registerIconPacks(mermaidPluginConfig.iconPacks);
        }

        const renderMermaidEl = getRenderMermaidEl({
            beforeRender: mermaidPluginConfig.beforeRender,
            afterRender: mermaidPluginConfig.afterRender,
        });

        mermaid.initialize({
            startOnLoad: false,
            ...mermaidConfig,
        });

        const mermaidEls = reveal
            .getRevealElement()
            .querySelectorAll(".mermaid");

        Array.from(mermaidEls).forEach((el) => {
            renderMermaidEl(el);
        });
    },
};

export default () => Plugin;
