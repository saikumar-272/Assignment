import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "src/app");

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Process only if file has @Component
  if (!content.includes("@Component")) return;

  const hasFormsImport = content.includes("FormsModule");
  const hasReactiveImport = content.includes("ReactiveFormsModule");
  const hasFormsImportStatement = /from ['"]@angular\/forms['"]/.test(content);

  // ✅ Ensure import statement exists
  if (!hasFormsImportStatement) {
    content =
      `import { FormsModule, ReactiveFormsModule } from '@angular/forms';\n` +
      content;
  } else {
    // ✅ Add missing named imports inside existing @angular/forms import
    content = content.replace(
      /import\s*{\s*([^}]*)}\s*from\s*['"]@angular\/forms['"]/,
      (match, p1) => {
        const imports = p1.split(",").map((s) => s.trim());
        if (!imports.includes("FormsModule")) imports.push("FormsModule");
        if (!imports.includes("ReactiveFormsModule"))
          imports.push("ReactiveFormsModule");
        return `import { ${[...new Set(imports)].join(
          ", "
        )} } from '@angular/forms'`;
      }
    );
  }

  // ✅ Ensure FormsModule and ReactiveFormsModule are in component imports: []
  if (/imports\s*:\s*\[([^\]]*)\]/.test(content)) {
    content = content.replace(/imports\s*:\s*\[([^\]]*)\]/, (match, p1) => {
      let imports = p1
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!imports.includes("FormsModule")) imports.push("FormsModule");
      if (!imports.includes("ReactiveFormsModule"))
        imports.push("ReactiveFormsModule");
      return `imports: [${[...new Set(imports)].join(", ")}]`;
    });
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("✅ Updated:", filePath);
}

walkDir(rootDir);
console.log(
  "🎯 Done adding FormsModule & ReactiveFormsModule imports recursively."
);
