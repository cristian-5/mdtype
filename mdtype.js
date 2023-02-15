
import { parse } from "https://deno.land/std@0.151.0/flags/mod.ts";

import MarkdownIt from "https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/+esm";
import subscript from "https://cdn.jsdelivr.net/npm/markdown-it-sub@1.0.0/+esm";
import supscript from "https://cdn.jsdelivr.net/npm/markdown-it-sup@1.0.0/+esm";
import footnotes from "https://cdn.jsdelivr.net/npm/markdown-it-footnote@3.0.3/+esm";
import tasklists from "https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/+esm";
import defslists from "https://cdn.jsdelivr.net/npm/markdown-it-deflist@2.1.0/+esm";
import katexmath from "https://cdn.jsdelivr.net/npm/markdown-it-katex@2.0.3/+esm";
import bracketed from "https://cdn.jsdelivr.net/npm/markdown-it-bracketed-spans@1.0.1/+esm";
import attribute from "https://cdn.jsdelivr.net/npm/markdown-it-attrs@4.1.6/+esm";

import underline from "./extensions/underline.js";

const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true
})
.use(subscript).use(supscript).use(footnotes)
.use(tasklists).use(defslists).use(katexmath)
.use(underline).use(bracketed).use(attribute);

const args = parse(Deno.args, {
	"--": false, boolean: [ "help", "version" ],
	alias: { 'h': "help", 'v': "version" },
	stopEarly: true,
});

const USAGE = "usage: mdtype <json input>";
const VERSION = "mdtype v0.0.1";

if (args["help"]) { console.log(USAGE); Deno.exit(0); }
if (args["version"]) { console.log(VERSION); Deno.exit(0); }

const input = args["_"][0];

if (!input) {
	console.error("error: missing input file");
	console.error(USAGE);
	Deno.exit(1);
}

/// ==== PARSING INPUT JSON ====================================

const defaults = {
	title: "Unknown Title",
	files: [],
	styles: [],
	margins: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
	author: "Unknown Author",
	date: "Unknown Date",
	page: { size: "A4", orientation: "portrait" },
	language: "en-US",
};

let options;
try {
	options = JSON.parse(await Deno.readTextFile(input));
	options = Object.assign({}, defaults, options);
} catch (e) {
	console.error(`error: ${e}`);
	Deno.exit(1);
}

if (!("files" in options)) {
	console.error("error: missing input files");
	Deno.exit(1);
}

/// ==== READING INPUT FILES ===================================

let document = "";
try {
	for (const file of options["files"])
		document += md.render(await Deno.readTextFile(file));
} catch (e) {
	console.error(`error: ${e}`);
	Deno.exit(1);
}

/// ==== PROCESSING FILES ======================================

const html = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="author" content="${options.author}">
	<meta name="date" content="${options.date}">
	<title>${options.title}</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/vs.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
	<link rel="stylesheet" href="Default.css">
	${options.styles.map(s => `<link rel="stylesheet" href="${s}">`).join("\n")}
	<style>
	@media print {
		@page {
			size: ${options.page.size} ${options.page.orientation};
			margin: ${options.margins.top} ${options.margins.right} ${options.margins.bottom} ${options.margins.left} !important;
		}
		.page-break-before { page-break-before: always; }
		.page-break-after { page-break-after: always; }
		.page-nobreak { page-break-inside: avoid; }
	}
	@media screen {
		body {
			padding: ${options.margins.top} ${options.margins.right} ${options.margins.bottom} ${options.margins.left};
			width: calc(210mm - ${options.margins.left} - ${options.margins.right});
		}
	}
	</style>
</head>
<body>${document}<script>hljs.highlightAll();</script></body>
</html>`;

await Deno.writeTextFile(options.title + ".html", html);


