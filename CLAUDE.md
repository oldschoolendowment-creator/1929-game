# Project Rules

* Single HTML file (`index.html`) with plain JavaScript. No frameworks, no npm, no build step, no bundler, no TypeScript.
* Content lives in `rounds.js` as a `const ROUNDS = {...}` loaded by script tag. Never move content into `index.html`.
* No backend, no accounts, no localStorage.
* External libraries and CDN links are allowed (lifted once the MVP was built — see git history around the analytics/charts work for when and why).
* The user cannot read stack traces. Prefer boring, obvious code over clever code. Comment anything non-obvious in plain English.
* Build one small step at a time. Never write the whole feature at once. After each change, state in one sentence what the user should now see in the browser.
* If a request would require a build step or a second code file, stop and say so instead of doing it.

# Content schema (rounds.js)

Content lives in `rounds.js` as `const ROUNDS = {...}`. Never `.json` — browsers
block local file reads over `file://`, so a JSON content file fails silently with
no error to read.

A choice's `effects` object may use these eight keys:

* `cash` — number. Dollar change to cash on hand. Negative = spend.
* `debt` — number. Dollar change to debt owed. Negative = pay down.
* `buy` — `{ asset: "stock"|"gold", amount: N }` or `{ asset, fraction: F }`.
* `sell` — `{ asset: "stock"|"gold", fraction: F }`. Proceeds are added to cash automatically.
* `income` — number. Change to the ongoing per-round earnings baseline, from the following round.
* `incomeMultiplier` — number. Scales the earnings baseline instead of adding to it. Applied after `income`.
* `path` — `"job"` or `"business"`. Only round 1 sets this. Everything after reads it.
* `flags` — array of strings. Recorded permanently, no numeric effect on their own.

A choice may carry one `requires` gate: `{ debt: true }`, `{ gold: true }`,
`{ flag: "name" }`, or `{ path: "job"|"business" }`.

A round may carry `situationAppend: { job: "...", business: "..." }`. The matching
paragraph is appended to the shared `situation` text with a blank line between.

Anything beyond this is a `specialRule` string in `rounds.js` and a matching
one-off function in `index.html`, keyed by round id. Currently: round 4 bounce
price, round 7 bank failure, round 8 short time, round 10 layoff.

**If you add a key here, add it to `applyEffects` in the same commit.** An unknown
key is ignored silently and the game plays to the end with the effect missing.

`historicalPrices` (real Dow/gold data, 1920-1933) and each round's `asOfDate`
are a separate concern from the eight effect keys above — they drive the two
real historical reference charts in `index.html`, not gameplay. If you add a
round or change a round's `date`, add a matching `asOfDate` too, or that
round's charts will silently stop advancing.
