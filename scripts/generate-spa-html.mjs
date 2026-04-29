#!/usr/bin/env node
// Genera dist/client/index.html dopo `vite build` per deploy SPA su Netlify.
// TanStack Start non emette index.html (è progettato per SSR), ma il bundle
// client è completo in dist/client/assets/. Questo script crea uno shell HTML
// che carica l'entry main e il CSS, così funziona come SPA.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "dist", "client");
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error("[spa-html] dist/client/assets non trovato. Esegui prima `vite build`.");
  process.exit(1);
}

const files = readdirSync(assetsDir);

// Trova l'entry principale (main-*.js) e il CSS principale (styles-*.css)
const mainEntry = files.find((f) => /^main-.*\.js$/.test(f));
const mainCss = files.find((f) => /\.css$/.test(f));

if (!mainEntry) {
  console.error("[spa-html] entry main-*.js non trovato in dist/client/assets/");
  process.exit(1);
}

// Estrai metadati dal root route (titolo + meta) leggendo dal sorgente
let title = "App";
let description = "";
try {
  const rootSrc = readFileSync(join(process.cwd(), "src", "routes", "__root.tsx"), "utf-8");
  const titleMatch = rootSrc.match(/title:\s*["'`]([^"'`]+)["'`]/);
  const descMatch = rootSrc.match(/name:\s*["']description["'][^}]*content:\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) title = titleMatch[1];
  if (descMatch) description = descMatch[1];
} catch {}

const cssTag = mainCss ? `    <link rel="stylesheet" href="/assets/${mainCss}" />\n` : "";

const html = `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${description ? `<meta name="description" content="${description}" />\n    ` : ""}<link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
${cssTag}    <script type="module" crossorigin src="/assets/${mainEntry}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`[spa-html] dist/client/index.html generato (entry: ${mainEntry}${mainCss ? `, css: ${mainCss}` : ""})`);
