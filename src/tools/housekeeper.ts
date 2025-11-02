/**
 * Housekeeper — bezpieczny „cleanup” dla projektów Node/TS.
 * Funkcje CLI:
 *  - default (bez flag)  → help
 *  - --status            → rozmiary i liczby plików
 *  - --run               → cleanup (przeniesienie starych plików do trash)
 *  - --prune             → usuń stare foldery trash (> trashMaxDays)
 *  - --restore last      → przywróć ostatni trash zgodnie z manifestem
 *  - --targets a,b       → nadpisz cele z configu (CSV)
 *  - --keep-days N       → nadpisz retencję dni
 *  - --keep-recent N     → nadpisz ile najnowszych zawsze zostaje
 * Bezpieczeństwo:
 *  - Działa tylko zdefiniowanych katalogach targets (whitelist).
 *  - Nie dotyka src/, package.json, tsconfig.json, NOTES.md, automation_october.md.
 *  - Zawsze tworzy manifest przeniesień.
 */

import path from "node:path";
import fs from "fs-extra";
import { pathToFileURL } from "node:url";

type CLI = {
  run: boolean;
  prune: boolean;
  status: boolean;
  restore: "last" | "";
  targetsCsv?: string;
  keepDays?: number;
  keepRecent?: number;
};

type Config = {
  targets: string[];
  keepRecent: number;
  keepDays: number;
  trashMaxDays: number;
};

type MovedItem = {
  srcRel: string; // relatywna ścieżka od ROOT
  dstRel: string; // rel. ścieżka w .trash/<ts>/
  size: number; // bajty
  mtime: number; // ms epoch
};

const ROOT = process.cwd();
const ALWAYS_PRESENT = ["package.json", "tsconfig.json", "src", "data"];
const DEFAULT_CONFIG: Config = {
  targets: ["data/logs", "data/screens"],
  keepRecent: 5,
  keepDays: 7,
  trashMaxDays: 30,
};

function parseCLI(argv: string[]): CLI {
  const args = new Map<string, string | boolean>();
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args.set(key, true);
      } else {
        args.set(key, next);
        i++;
      }
    }
  }
  return {
    run: Boolean(args.get("run")),
    prune: Boolean(args.get("prune")),
    status: Boolean(args.get("status")),
    restore: (args.get("restore") === true
      ? "last"
      : (args.get("restore") as string)) as "last" | "",
    targetsCsv:
      typeof args.get("targets") === "string"
        ? (args.get("targets") as string)
        : undefined,
    keepDays:
      typeof args.get("keep-days") === "string"
        ? Number(args.get("keep-days"))
        : undefined,
    keepRecent:
      typeof args.get("keep-recent") === "string"
        ? Number(args.get("keep-recent"))
        : undefined,
  };
}

async function loadConfig(): Promise<Config> {
  const cfgPath = path.join(ROOT, "housekeeper.config.json");
  if (await fs.pathExists(cfgPath)) {
    const raw = await fs.readJSON(cfgPath);
    return {
      targets: Array.isArray(raw.targets)
        ? raw.targets
        : DEFAULT_CONFIG.targets,
      keepRecent:
        typeof raw.keepRecent === "number"
          ? raw.keepRecent
          : DEFAULT_CONFIG.keepRecent,
      keepDays:
        typeof raw.keepDays === "number"
          ? raw.keepDays
          : DEFAULT_CONFIG.keepDays,
      trashMaxDays:
        typeof raw.trashMaxDays === "number"
          ? raw.trashMaxDays
          : DEFAULT_CONFIG.trashMaxDays,
    };
  }
  return DEFAULT_CONFIG;
}

function nowStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function assertProjectRoot(): Promise<void> {
  for (const f of ALWAYS_PRESENT) {
    if (!(await fs.pathExists(path.join(ROOT, f)))) {
      console.error("Błąd: uruchom w katalogu projektu (brakuje:", f, ").");
      process.exit(1);
    }
  }
}

async function dirFiles(dirAbs: string): Promise<string[]> {
  if (!(await fs.pathExists(dirAbs))) return [];
  const names: string[] = await fs.readdir(dirAbs);
  const abs: string[] = names.map((n: string) => path.join(dirAbs, n));
  const files: string[] = [];
  for (const p of abs) {
    const st = await fs.lstat(p);
    if (st.isFile()) files.push(p);
  }
  return files;
}

async function getSize(p: string): Promise<number> {
  try {
    const s = await fs.stat(p);
    return s.size;
  } catch {
    return 0;
  }
}

async function folderSize(dirAbs: string): Promise<number> {
  if (!(await fs.pathExists(dirAbs))) return 0;
  const entries = await fs.readdir(dirAbs);
  let total = 0;
  for (const e of entries) {
    const p = path.join(dirAbs, e);
    const s = await fs.stat(p);
    if (s.isDirectory()) total += await folderSize(p);
    else total += s.size;
  }
  return total;
}

function fmtBytes(n: number): string {
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${u[i]}`;
}

async function status(cfg: Config): Promise<void> {
  console.log("Housekeeper status:");
  for (const rel of cfg.targets) {
    const abs = path.join(ROOT, rel);
    const files = await dirFiles(abs);
    const size = await folderSize(abs);
    console.log(` - ${rel}: ${files.length} plików, ${fmtBytes(size)}`);
  }
  const trashRoot = path.join(ROOT, "data", ".trash");
  if (await fs.pathExists(trashRoot)) {
    const all: string[] = await fs.readdir(trashRoot);
    const batches = all.filter((n: string) => n !== ".gitkeep");
    console.log(` - trash: ${batches.length} paczek`);
  } else {
    console.log(" - trash: brak");
  }
}

async function cleanup(
  cfg: Config,
  targets: string[],
  keepDays: number,
  keepRecent: number
): Promise<void> {
  const trashBatch = path.join(ROOT, "data", ".trash", nowStamp());
  await fs.ensureDir(trashBatch);

  const manifest: MovedItem[] = [];
  const nowMs = Date.now();

  for (const rel of targets) {
    const dirAbs = path.join(ROOT, rel);
    await fs.ensureDir(dirAbs);

    const files = await dirFiles(dirAbs);
    const withMeta = await Promise.all(
      files.map(async (p) => {
        const st = await fs.stat(p);
        return { p, mtime: st.mtimeMs, size: st.size };
      })
    );
    // sort desc by mtime
    withMeta.sort((a, b) => b.mtime - a.mtime);

    // keep N newest and all newer than keepDays
    const keepSet = new Set<string>();
    for (let i = 0; i < Math.min(keepRecent, withMeta.length); i++)
      keepSet.add(withMeta[i].p);

    for (const it of withMeta) {
      const ageDays = (nowMs - it.mtime) / (1000 * 60 * 60 * 24);
      if (keepSet.has(it.p)) continue;
      if (ageDays < keepDays) continue;

      const base = path.basename(it.p);
      const dstName = rel.replace(/[\\/]/g, "_") + "__" + base;
      const dstRel = path.join(
        "data",
        ".trash",
        path.basename(trashBatch),
        dstName
      );
      const dstAbs = path.join(ROOT, dstRel);

      await fs.move(it.p, dstAbs, { overwrite: true });
      manifest.push({
        srcRel: path.relative(ROOT, it.p),
        dstRel,
        size: it.size,
        mtime: it.mtime,
      });
      console.log(`moved: ${rel}/${base}`);
    }
  }

  // zapisz manifest
  const manifestPath = path.join(trashBatch, "manifest.json");
  await fs.writeJSON(
    manifestPath,
    { createdAt: Date.now(), items: manifest },
    { spaces: 2 }
  );

  const totalSize = manifest.reduce((a, b) => a + b.size, 0);
  console.log(
    `OK: przeniesiono ${manifest.length} plików, ${fmtBytes(
      totalSize
    )} → ${pathToFileURL(trashBatch).toString()}`
  );
}

async function prune(cfg: Config): Promise<void> {
  const trashRoot = path.join(ROOT, "data", ".trash");
  if (!(await fs.pathExists(trashRoot))) {
    console.log("trash pusty");
    return;
  }
  const nowMs = Date.now();
  const batches = await fs.readdir(trashRoot);
  let removed = 0;
  let freed = 0;

  for (const b of batches) {
    const batchAbs = path.join(trashRoot, b);
    const st = await fs.stat(batchAbs);
    if (!st.isDirectory()) continue;
    const ageDays = (nowMs - st.mtimeMs) / (1000 * 60 * 60 * 24);
    if (ageDays > cfg.trashMaxDays) {
      const size = await folderSize(batchAbs);
      await fs.remove(batchAbs);
      removed++;
      freed += size;
      console.log(`prune: ${b} (${fmtBytes(size)})`);
    }
  }
  console.log(`OK: usunięto ${removed} paczek, zwolniono ${fmtBytes(freed)}`);
}

async function restoreLast(): Promise<void> {
  const trashRoot = path.join(ROOT, "data", ".trash");
  if (!(await fs.pathExists(trashRoot))) {
    console.error("Brak .trash");
    process.exit(1);
  }

  const names: string[] = await fs.readdir(trashRoot);
  const dirs: string[] = [];
  for (const n of names) {
    const st = await fs.stat(path.join(trashRoot, n));
    if (st.isDirectory()) dirs.push(n);
  }
  dirs.sort();
  if (dirs.length === 0) {
    console.error("Brak paczek do przywrócenia");
    process.exit(1);
  }

  const last = dirs[dirs.length - 1];
  const batchAbs = path.join(trashRoot, last);
  const manifestPath = path.join(batchAbs, "manifest.json");
  if (!(await fs.pathExists(manifestPath))) {
    console.error("Brak manifestu w ostatniej paczce");
    process.exit(1);
  }

  const manifest = (await fs.readJSON(manifestPath)) as { items: MovedItem[] };
  let restored = 0;
  for (const it of manifest.items) {
    const dstAbs = path.join(ROOT, it.dstRel);
    const origAbs = path.join(ROOT, it.srcRel);
    await fs.ensureDir(path.dirname(origAbs));
    if (await fs.pathExists(dstAbs)) {
      await fs.move(dstAbs, origAbs, { overwrite: false });
      restored++;
      console.log("restored:", it.srcRel);
    }
  }
  console.log(
    `OK: przywrócono ${restored}/${manifest.items.length} plików z paczki ${last}`
  );
}

function printHelp(cfg: Config): void {
  console.log(`Housekeeper
Usage:
  ts-node src/tools/housekeeper.ts [--status] [--run] [--prune] [--restore last]
Options:
  --targets a,b        Nadpisz cele (default: ${cfg.targets.join(",")})
  --keep-days N        Domyślnie ${cfg.keepDays}
  --keep-recent N      Domyślnie ${cfg.keepRecent}
Examples:
  hk:status            -> status
  hk:run               -> cleanup (safe move)
  hk:prune             -> usuń stare paczki trash (> ${cfg.trashMaxDays} dni)
  hk:restore last      -> przywróć ostatnią paczkę z manifestu
`);
}

(async function run() {
  await assertProjectRoot();
  const cli = parseCLI(process.argv);
  const cfg0 = await loadConfig();

  const cfg: Config = {
    targets: cli.targetsCsv
      ? cli.targetsCsv.split(",").map((s) => s.trim())
      : cfg0.targets,
    keepDays:
      typeof cli.keepDays === "number" && !Number.isNaN(cli.keepDays)
        ? cli.keepDays
        : cfg0.keepDays,
    keepRecent:
      typeof cli.keepRecent === "number" && !Number.isNaN(cli.keepRecent)
        ? cli.keepRecent
        : cfg0.keepRecent,
    trashMaxDays: cfg0.trashMaxDays,
  };

  if (!cli.run && !cli.prune && !cli.status && !cli.restore) {
    printHelp(cfg);
    return;
  }
  if (cli.status) {
    await status(cfg);
  }
  if (cli.run) {
    await cleanup(cfg, cfg.targets, cfg.keepDays, cfg.keepRecent);
  }
  if (cli.prune) {
    await prune(cfg);
  }
  if (cli.restore === "last") {
    await restoreLast();
  }
})().catch((err) => {
  console.error("Housekeeper error:", err);
  process.exit(1);
});
