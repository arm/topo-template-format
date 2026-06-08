const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const skills_dir = path.join(root, "skills");
const context_path = path.join(
  skills_dir,
  "_shared",
  "topo-template-context.md",
);
const reference_path = path.join("references", "topo-template-context.md");

const check = process.argv.includes("--check");
const canonical_context = fs.readFileSync(context_path, "utf8");

const skill_paths = fs
  .readdirSync(skills_dir, { withFileTypes: true })
  .filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("topo-template-"),
  )
  .map((entry) => path.join(skills_dir, entry.name))
  .filter((skill_dir) => fs.existsSync(path.join(skill_dir, "SKILL.md")));

let stale = false;

for (const skill_dir of skill_paths) {
  const skill_reference_path = path.join(skill_dir, reference_path);
  const relative_path = path.relative(root, skill_reference_path);
  const reference_context_copy = fs.existsSync(skill_reference_path)
    ? fs.readFileSync(skill_reference_path, "utf8")
    : null;

  if (reference_context_copy !== canonical_context) {
    stale = true;

    if (check) {
      const state = reference_context_copy === null ? "missing" : "stale";
      console.error(`${relative_path} is ${state}`);
      continue;
    }

    fs.mkdirSync(path.dirname(skill_reference_path), { recursive: true });
    fs.writeFileSync(skill_reference_path, canonical_context);
    console.log(`Updated ${relative_path}`);
  }
}

if (check && stale) {
  console.error(
    "Run `npm run sync:skills` to update skill context references.",
  );
  process.exit(1);
}
