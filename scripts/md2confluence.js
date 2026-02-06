#!/usr/bin/env node

const fs = require("fs");
const markdown2confluence = require("@shogobg/markdown2confluence");

// Get filename from command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error("Usage: node md2confluence.js <markdown-file>");
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(filename)) {
  console.error(`Error: File '${filename}' not found`);
  process.exit(1);
}

// Read the markdown file
const markdown = fs.readFileSync(filename, "utf8");

// Convert to Confluence format with collapse: false
const confluence = markdown2confluence(markdown, {
  codeBlock: {
    languageMap: {
      yaml: "yaml",
      yml: "yaml",
      dockerfile: "docker",
      sh: "bash",
      shell: "bash",
      json: "javascript",
    },
    options: {
      collapse: false,
      title: "none",
      borderStyle: "solid",
      theme: "RDark",
      linenumbers: true,
    },
  },
});

// Output to stdout
console.log(confluence);
