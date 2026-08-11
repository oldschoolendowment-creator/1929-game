# Project Rules

* Single HTML file (`index.html`) with plain JavaScript. No frameworks, no npm, no build step, no bundler, no TypeScript.
* Content lives in `rounds.js` as a `const ROUNDS = {...}` loaded by script tag. Never move content into `index.html`.
* No backend, no accounts, no localStorage, no external libraries, no CDN links.
* The user cannot read stack traces. Prefer boring, obvious code over clever code. Comment anything non-obvious in plain English.
* Build one small step at a time. Never write the whole feature at once. After each change, state in one sentence what the user should now see in the browser.
* If a request would require adding a dependency, a build step, or a second code file, stop and say so instead of doing it.
