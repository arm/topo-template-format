const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const skills_dir = path.join(root, "skills");
const context_path = path.join(
  skills_dir,
  "_shared",
  "topo-template-context.md",
);
const begin_marker = "<!-- BEGIN GENERATED: topo-template-context -->";
const end_marker = "<!-- END GENERATED: topo-template-context -->";

const check = process.argv.includes("--check");
const context = fs.readFileSync(context_path, "utf8").trim();

const skill_paths = fs
  .readdirSync(skills_dir, { withFileTypes: true })
  .filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("topo-template-"),
  )
  .map((entry) => path.join(skills_dir, entry.name, "SKILL.md"))
  .filter((skill_path) => fs.existsSync(skill_path));

let stale = false;

for (const skill_path of skill_paths) {
  const original = fs.readFileSync(skill_path, "utf8");
  const begin_index = original.indexOf(begin_marker);
  const end_index = original.indexOf(end_marker);

  if (begin_index === -1 || end_index === -1 || end_index < begin_index) {
    throw new Error(
      `${path.relative(root, skill_path)} is missing generated context markers`,
    );
  }

  const before = original.slice(0, begin_index + begin_marker.length);
  const after = original.slice(end_index);
  const updated = `${before}\n${context}\n${after}`;

  if (updated !== original) {
    stale = true;
    const relative_path = path.relative(root, skill_path);

    if (check) {
      console.error(`${relative_path} has stale generated context`);
      continue;
    }

    fs.writeFileSync(skill_path, updated);
    console.log(`Updated ${relative_path}`);
  }
}

if (check && stale) {
  console.error("Run `npm run sync:skills` to update generated skill context.");
  process.exit(1);
}
