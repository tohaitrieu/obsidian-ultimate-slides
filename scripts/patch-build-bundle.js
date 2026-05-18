/**
 * Post-build script to patch the bundle for Obsidian plugin review compliance.
 * Removes problematic patterns that trigger security warnings.
 */
const fs = require("node:fs");
const path = require("node:path");

const buildDir = process.argv[2] || "build";

function patchMainJs() {
    const mainJsPath = path.join(buildDir, "main.js");
    if (!fs.existsSync(mainJsPath)) {
        console.log("main.js not found, skipping patch");
        return;
    }

    let content = fs.readFileSync(mainJsPath, "utf8");
    const originalLength = content.length;

    // Remove setImmediate polyfill that uses createElement("script")
    // This is from jszip's lie/immediate dependencies
    // Pattern: script element with onreadystatechange for async scheduling
    content = content.replace(
        /var [a-zA-Z]=global\.document\.createElement\("script"\);[a-zA-Z]\.onreadystatechange[^}]+\}[^}]+\}/g,
        "setTimeout(Zf,0)",
    );

    content = content.replace(
        /var [a-zA-Z]=s\.createElement\("script"\);[a-zA-Z]\.onreadystatechange[^}]+\}[^}]+\}/g,
        "setTimeout(u,0,_)",
    );

    // Replace feature detection patterns that check for script onreadystatechange
    // Pattern: "onreadystatechange"in global.document.createElement("script")
    content = content.replace(
        /"onreadystatechange"in global\.document\.createElement\("script"\)/g,
        "false",
    );

    // Pattern: "onreadystatechange"in s.createElement("script")
    content = content.replace(
        /"onreadystatechange"in s\.createElement\("script"\)/g,
        "false",
    );

    // Check for remaining patterns
    const remaining = (content.match(/createElement\([^)]*script/g) || [])
        .length;

    fs.writeFileSync(mainJsPath, content);
    console.log(
        `Patched main.js: ${originalLength} -> ${content.length} bytes`,
    );
    console.log(`Remaining createElement script patterns: ${remaining}`);

    if (remaining > 0) {
        console.warn("Warning: Some createElement script patterns remain");
    }
}

function patchStylesCss() {
    const stylesCssPath = path.join(buildDir, "styles.css");
    if (!fs.existsSync(stylesCssPath)) {
        console.log("styles.css not found, skipping patch");
        return;
    }

    let content = fs.readFileSync(stylesCssPath, "utf8");

    // Convert 3-digit hex to 6-digit hex
    content = content.replace(
        /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([^0-9a-fA-F])/g,
        "#$1$1$2$2$3$3$4",
    );

    const remaining = (content.match(/#[0-9a-fA-F]{3}[^0-9a-fA-F]/g) || [])
        .length;

    fs.writeFileSync(stylesCssPath, content);
    console.log(`Patched styles.css: 3-digit hex remaining: ${remaining}`);
}

patchMainJs();
patchStylesCss();
