// fix-browsermodule-imports.js
// ✅ Automatically replaces BrowserModule with CommonModule in feature modules

import fs from "fs";
import path from "path";

const rootDir = path.resolve("./src/app");
let changedFiles = [];

function processFile(filePath) {
  const fileName = path.basename(filePath);

  // Skip app.module.ts (BrowserModule should stay there)
  if (fileName === "app.module.ts") return;

  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("BrowserModule")) {
    const updated = content
      // Replace import statement
      .replace(
        /import\s*\{\s*BrowserModule\s*\}\s*from\s*['"]@angular\/platform-browser['"];?/g,
        "import { CommonModule } from '@angular/common';"
      )
      // Replace references in @NgModule imports
      .replace(/\bBrowserModule\b/g, "CommonModule");

    fs.writeFileSync(filePath, updated, "utf8");
    changedFiles.push(filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

console.log("🔍 Scanning for BrowserModule imports...");
walkDir(rootDir);

if (changedFiles.length) {
  console.log(
    `✅ Fixed BrowserModule imports in ${changedFiles.length} file(s):`
  );
  changedFiles.forEach((f) => console.log("   - " + f));
} else {
  console.log("✅ No incorrect BrowserModule imports found.");
}
