// One Word for Your Wi-Fi — picks the single word that best describes home Wi-Fi
// and writes it to /output/entry.txt (gate: UTF-8 text, 1-20 characters).
//
// Selection method: every candidate is scored 0-5 on the judge's own brief,
// most important first — (1) on-subject about Wi-Fi as lived, (2) funny at
// once with no explaining, (3) true to how home Wi-Fi actually behaves,
// (4) a fresh angle nobody else reaches for, (5) readable instantly as one
// word. The highest total wins; ties break toward the shorter word, because
// the leaderboard's own tie-break favours fewer bytes.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  word: string;
  // Scores in the judge's criterion order: subject, funny, true, fresh, clear.
  scores: [number, number, number, number, number];
  why: string;
};

const candidates: Candidate[] = [
  {
    word: "Gaslighting",
    scores: [5, 5, 5, 5, 5],
    why: "Full bars, 'Connected', nothing loads — the router insists everything is fine while you doubt your own device. The most universal home Wi-Fi betrayal, named in one word everyone already knows.",
  },
  {
    word: "Ghosting",
    scores: [5, 4, 4, 3, 5],
    why: "The signal vanishes mid-call without a word. True and funny, but 'ghosting' is the first joke everyone reaches for, so it loses on freshness.",
  },
  {
    word: "Moody",
    scores: [4, 3, 4, 2, 5],
    why: "Wi-Fi that works when it feels like it. Instantly readable, but too gentle — it describes a mood, not the betrayal, and it is a word everyone tries first.",
  },
  {
    word: "MoodSwings",
    scores: [4, 4, 4, 3, 4],
    why: "Fast at 3am, dead during your call. Funny, but two words glued together reads slower than one clean word.",
  },
  {
    word: "Flaky",
    scores: [4, 3, 4, 2, 5],
    why: "'Flaky connection' is the cliche itself — the judge's brief punishes the words everyone reaches for.",
  },
  {
    word: "Situationship",
    scores: [4, 4, 3, 4, 3],
    why: "Connected but never committed. A good modern joke, but it needs a beat to land and describes the relationship, not the Wi-Fi.",
  },
  {
    word: "Temperamental",
    scores: [4, 2, 4, 3, 4],
    why: "Accurate, but a long Latinate word is a description, not a laugh — it explains instead of hitting.",
  },
  {
    word: "Buffering",
    scores: [3, 2, 4, 1, 5],
    why: "True, but it names the loading spinner, not the Wi-Fi, and it is the single most obvious word in the field.",
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s) => sum + s, 0);
}

function pickBest(list: Candidate[]): Candidate {
  const ranked = [...list].sort((a, b) => {
    const byScore = total(b) - total(a);
    if (byScore !== 0) return byScore;
    return a.word.length - b.word.length; // shorter wins ties, like the leaderboard
  });
  return ranked[0];
}

function main(): void {
  const winner = pickBest(candidates);
  // Enforce the gate ourselves before writing: 1-20 characters, not blank.
  if (winner.word.length < 1 || winner.word.length > 20 || winner.word.trim().length === 0) {
    throw new Error(`picked word ${JSON.stringify(winner.word)} fails the 1-20 character gate`);
  }
  const outDir = "/output";
  const outFile = `${outDir}/entry.txt`;
  mkdirSync(outDir, { recursive: true });
  // Exactly one word, no trailing space; a single trailing newline is fine
  // because the gate counts characters of the text and trims whitespace-only
  // checks — but we write the bare word to keep the byte count minimal.
  writeFileSync(outFile, winner.word, "utf8");
  console.log(`word: ${winner.word} (${winner.word.length} chars, score ${total(winner)}/25)`);
  console.log(`why: ${winner.why}`);
  console.log(`wrote ${outFile}`);
}

main();
