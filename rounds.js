// ROUNDS content data for "The Long Fall" (1929-1933).
// Loaded by index.html via a plain <script src="rounds.js"> tag. No build step.
//
// SCHEMA: CLAUDE.md holds the authoritative list. The eight effect keys are
// cash, debt, buy, sell, income, incomeMultiplier, path and flags. A choice may
// carry one "requires" gate: { debt: true }, { gold: true }, { flag: "name" }
// or { path: "job" | "business" }. A round may carry
// situationAppend: { job: "...", business: "..." }.
//
// Anything beyond that is a "specialRule" string here plus a matching one-off
// function in index.html, keyed by round id. Currently: r4 bounce price,
// r7 bank failure, r8 short time, r10 layoff.
//
// IMPORTANT: an effects key the engine does not know is ignored in silence.
// The game will play to the end with the effect simply missing and no error.
// If you add a key, add it to applyEffects in index.html in the same commit.
//
// historicalPrices and each round's asOfDate are a separate concern from all
// of the above: they drive the two REAL historical reference charts (Dow and
// gold, 1920-1933), not the game's own invented per-round prices in `market`.
// See the comment on historicalPrices below.

const ROUNDS = {
  "meta": {
    "title": "The Long Fall",
    "subtitle": "1929-1933",
    "version": "0.4",
    "designNote": "The core lesson: deflation inverts the rules of the 1920s. Cash quietly wins. Debt quietly kills. Every instinct that made money in 1928 destroys you by 1932. The scoring is deliberately built so the leveraged optimist loses and the boring cash-holder survives. Let the player discover this rather than telling them.",
    "sourcing": {
      "sourced": "Dow values in rounds 4, 5 and 10 (381.17, 198.60, 294.07, 41.22), annual inflation rates, unemployment rates, the $8.5bn margin loan figure, export collapse figures, and all named historical events are drawn from the Wikipedia Timeline of the Great Depression.",
      "invented": "Dow values in rounds 1, 2, 3, 6, 7, 8, 9, 11 and 12 are INTERPOLATIONS for playability, not historical data. Player incomes, expenses, starting cash and all choice effect numbers are invented for game balance. Verify against a primary source (e.g. FRED, Federal Reserve History) before presenting any of these as fact in-game.",
      "recommendation": "In the UI, mark historically sourced figures differently from invented ones. Honesty about which is which is itself part of the educational value.",
      "needsVerification": "Several new specifics were added in this revision (daily Dow percentage moves in Oct 1929, the 1,028-economist petition, Bank of England rate path, the 1934 gold revaluation to $35). These are from general knowledge, not from a checked primary source. Every one is marked [VERIFY] in the historicalNote and should be confirmed against FRED, Federal Reserve History or the Bank of England's own rate series before shipping."
    },
    "docsNote": "The full design document, including the derivation of the 1929 wage figures, the historical corrections and the unemployment design rationale, is rounds_2.json in the project folder. That file is documentation only and is NOT loaded by the game.",
    "historicalChartsNote": "historicalPrices and each round's asOfDate (below/throughout `rounds`) are unrelated to this revision — they're real Dow/gold data (not the game's own invented `market` figures) driving the two reference charts in index.html. Added in a separate Claude Code session; kept as-is across this content merge."
  },
  "config": {
    "startingCash": 2000,
    "startingDebt": 0,
    "startingStocks": 0,
    "startingGold": 0,
    "marginCallRule": "At the end of any round, if debt > (cash + stocksValue + goldValue), the player is wiped out: all holdings are seized, debt is cleared, and the RUINED ending fires immediately.",
    "goldPriceRule": "Gold is fixed at $20.67/oz throughout. This is deliberate: gold does not rise, it simply holds value while everything else falls. That IS the point, and r11 is where the state takes it away at that same fixed price.",
    "realValueRule": "Final score uses real purchasing power: nominalNetWorth / (priceLevel / 100). A player holding $2,000 cash in 1932 has roughly 32% more purchasing power than in 1929 despite the number not changing. Show this at the end. It is the whole lesson.",
    "startingIncome": 0,
    "incomeNote": "income is a NET per-round figure: living costs and business overheads are already subtracted, which is why the job path starts at 550 rather than at a full wage. The twenty-five dollars a week quoted in the r1 label is the realistic gross 1929 figure. See rounds_2.json for the derivation."
  },
  "market": {
    "r1":  { "dow": 300, "priceLevel": 100.0, "unemployment": 4,  "sourced": false },
    "r2":  { "dow": 300, "priceLevel": 100.0, "unemployment": 4,  "sourced": false },
    "r3":  { "dow": 350, "priceLevel": 100.0, "unemployment": 4,  "sourced": false },
    "r4":  { "dow": 198.6, "priceLevel": 100.0, "unemployment": 4, "sourced": true, "note": "Peak 381.17 on 3 Sept; bottom 198.60 on 13 Nov. Bounce window value of 260 used mid-round is invented but now aligned to the 30 October rally close of roughly 258. [VERIFY]" },
    "r5":  { "dow": 294.07, "priceLevel": 93.6, "unemployment": 9, "sourced": true, "note": "17 April 1930 bear market rally peak." },
    "r6":  { "dow": 230, "priceLevel": 93.6, "unemployment": 9,  "sourced": false },
    "r7":  { "dow": 165, "priceLevel": 93.6, "unemployment": 9,  "sourced": false },
    "r8":  { "dow": 130, "priceLevel": 84.9, "unemployment": 16, "sourced": false },
    "r9":  { "dow": 100, "priceLevel": 84.9, "unemployment": 16, "sourced": false },
    "r10": { "dow": 41.22, "priceLevel": 75.6, "unemployment": 25, "sourced": true, "note": "8 July 1932 low, an 89% fall from peak. Unemployment peaks at 25%." },
    "r11": { "dow": 55, "priceLevel": 75.6, "unemployment": 25, "sourced": false },
    "r12": { "dow": 99, "priceLevel": 76.4, "unemployment": 22, "sourced": false }
  },

  // Real historical monthly prices, 1920-1933, for the two reference charts
  // (separate from the game's own invented round-by-round prices in `market`
  // above). Each round below has an `asOfDate` field — the charts only ever
  // show data up to that date, so they reveal more of the real history as
  // the game progresses. The 1920-1928 portion means round 1 already shows
  // nine years of real context before the game's own story begins.
  //
  // Both are monthly, not daily — daily Dow/gold data from this era isn't
  // available from free sources. Dow is from the seaborn-data "dowjones.csv"
  // dataset (itself sourced from the NBER Macrohistory database). Gold is
  // from the datasets/gold-prices "monthly.csv" dataset. Gold was legally
  // fixed by the US government for most of this window, which is why it
  // only has a handful of distinct values across 168 months — that flatness
  // is real, not a data gap.
  "historicalPrices": {
    "source": "Dow: seaborn-data dowjones.csv (NBER Macrohistory). Gold: datasets/gold-prices monthly.csv.",
    "dow": [
      { "date": "1920-01", "price": 105.9 },  { "date": "1920-02", "price": 96.5 },
      { "date": "1920-03", "price": 97.95 },  { "date": "1920-04", "price": 99.45 },
      { "date": "1920-05", "price": 91.1 },   { "date": "1920-06", "price": 91.7 },
      { "date": "1920-07", "price": 90.7 },   { "date": "1920-08", "price": 85.25 },
      { "date": "1920-09", "price": 86.5 },   { "date": "1920-10", "price": 84.85 },
      { "date": "1920-11", "price": 79.3 },   { "date": "1920-12", "price": 72.2 },
      { "date": "1921-01", "price": 74.75 },  { "date": "1921-02", "price": 75.7 },
      { "date": "1921-03", "price": 75.05 },  { "date": "1921-04", "price": 77.0 },
      { "date": "1921-05", "price": 76.7 },   { "date": "1921-06", "price": 69.2 },
      { "date": "1921-07", "price": 68.6 },   { "date": "1921-08", "price": 66.95 },
      { "date": "1921-09", "price": 69.35 },  { "date": "1921-10", "price": 71.7 },
      { "date": "1921-11", "price": 75.7 },   { "date": "1921-12", "price": 79.8 },
      { "date": "1922-01", "price": 80.6 },   { "date": "1922-02", "price": 83.75 },
      { "date": "1922-03", "price": 87.2 },   { "date": "1922-04", "price": 91.3 },
      { "date": "1922-05", "price": 93.95 },  { "date": "1922-06", "price": 93.55 },
      { "date": "1922-07", "price": 95.0 },   { "date": "1922-08", "price": 98.5 },
      { "date": "1922-09", "price": 99.2 },   { "date": "1922-10", "price": 99.75 },
      { "date": "1922-11", "price": 95.75 },  { "date": "1922-12", "price": 97.0 },
      { "date": "1923-01", "price": 98.2 },   { "date": "1923-02", "price": 100.8 },
      { "date": "1923-03", "price": 103.9 },  { "date": "1923-04", "price": 100.55 },
      { "date": "1923-05", "price": 95.5 },   { "date": "1923-06", "price": 92.55 },
      { "date": "1923-07", "price": 89.3 },   { "date": "1923-08", "price": 90.45 },
      { "date": "1923-09", "price": 90.75 },  { "date": "1923-10", "price": 88.15 },
      { "date": "1923-11", "price": 90.65 },  { "date": "1923-12", "price": 94.1 },
      { "date": "1924-01", "price": 97.8 },   { "date": "1924-02", "price": 98.8 },
      { "date": "1924-03", "price": 95.6 },   { "date": "1924-04", "price": 91.95 },
      { "date": "1924-05", "price": 90.4 },   { "date": "1924-06", "price": 93.3 },
      { "date": "1924-07", "price": 99.25 },  { "date": "1924-08", "price": 103.55 },
      { "date": "1924-09", "price": 102.9 },  { "date": "1924-10", "price": 101.65 },
      { "date": "1924-11", "price": 107.65 }, { "date": "1924-12", "price": 115.45 },
      { "date": "1925-01", "price": 121.55 }, { "date": "1925-02", "price": 120.45 },
      { "date": "1925-03", "price": 120.35 }, { "date": "1925-04", "price": 119.7 },
      { "date": "1925-05", "price": 125.55 }, { "date": "1925-06", "price": 128.9 },
      { "date": "1925-07", "price": 133.9 },  { "date": "1925-08", "price": 138.85 },
      { "date": "1925-09", "price": 142.45 }, { "date": "1925-10", "price": 150.65 },
      { "date": "1925-11", "price": 153.8 },  { "date": "1925-12", "price": 154.55 },
      { "date": "1926-01", "price": 156.1 },  { "date": "1926-02", "price": 158.4 },
      { "date": "1926-03", "price": 144.25 }, { "date": "1926-04", "price": 140.55 },
      { "date": "1926-05", "price": 140.3 },  { "date": "1926-06", "price": 148.15 },
      { "date": "1926-07", "price": 156.8 },  { "date": "1926-08", "price": 163.5 },
      { "date": "1926-09", "price": 161.2 },  { "date": "1926-10", "price": 152.7 },
      { "date": "1926-11", "price": 153.95 }, { "date": "1926-12", "price": 159.3 },
      { "date": "1927-01", "price": 154.65 }, { "date": "1927-02", "price": 158.15 },
      { "date": "1927-03", "price": 160.1 },  { "date": "1927-04", "price": 164.05 },
      { "date": "1927-05", "price": 168.8 },  { "date": "1927-06", "price": 168.85 },
      { "date": "1927-07", "price": 175.35 }, { "date": "1927-08", "price": 183.85 },
      { "date": "1927-09", "price": 195.3 },  { "date": "1927-10", "price": 189.8 },
      { "date": "1927-11", "price": 189.95 }, { "date": "1927-12", "price": 198.0 },
      { "date": "1928-01", "price": 198.95 }, { "date": "1928-02", "price": 195.35 },
      { "date": "1928-03", "price": 204.5 },  { "date": "1928-04", "price": 212.45 },
      { "date": "1928-05", "price": 216.3 },  { "date": "1928-06", "price": 211.5 },
      { "date": "1928-07", "price": 210.85 }, { "date": "1928-08", "price": 227.25 },
      { "date": "1928-09", "price": 239.3 },  { "date": "1928-10", "price": 247.45 },
      { "date": "1928-11", "price": 274.9 },  { "date": "1928-12", "price": 278.65 },
      { "date": "1929-01", "price": 307.25 }, { "date": "1929-02", "price": 309.0 },
      { "date": "1929-03", "price": 308.85 }, { "date": "1929-04", "price": 309.2 },
      { "date": "1929-05", "price": 310.25 }, { "date": "1929-06", "price": 316.45 },
      { "date": "1929-07", "price": 341.45 }, { "date": "1929-08", "price": 359.15 },
      { "date": "1929-09", "price": 362.35 }, { "date": "1929-10", "price": 291.5 },
      { "date": "1929-11", "price": 228.2 },  { "date": "1929-12", "price": 247.2 },
      { "date": "1930-01", "price": 255.65 }, { "date": "1930-02", "price": 267.4 },
      { "date": "1930-03", "price": 278.25 }, { "date": "1930-04", "price": 285.5 },
      { "date": "1930-05", "price": 266.7 },  { "date": "1930-06", "price": 243.15 },
      { "date": "1930-07", "price": 229.8 },  { "date": "1930-08", "price": 228.8 },
      { "date": "1930-09", "price": 225.0 },  { "date": "1930-10", "price": 198.75 },
      { "date": "1930-11", "price": 180.95 }, { "date": "1930-12", "price": 172.15 },
      { "date": "1931-01", "price": 167.25 }, { "date": "1931-02", "price": 181.55 },
      { "date": "1931-03", "price": 180.05 }, { "date": "1931-04", "price": 158.0 },
      { "date": "1931-05", "price": 141.45 }, { "date": "1931-06", "price": 139.3 },
      { "date": "1931-07", "price": 145.35 }, { "date": "1931-08", "price": 139.8 },
      { "date": "1931-09", "price": 118.35 }, { "date": "1931-10", "price": 98.1 },
      { "date": "1931-11", "price": 103.4 },  { "date": "1931-12", "price": 82.8 },
      { "date": "1932-01", "price": 78.55 },  { "date": "1932-02", "price": 78.9 },
      { "date": "1932-03", "price": 81.05 },  { "date": "1932-04", "price": 64.05 },
      { "date": "1932-05", "price": 51.85 },  { "date": "1932-06", "price": 46.85 },
      { "date": "1932-07", "price": 47.75 },  { "date": "1932-08", "price": 64.4 },
      { "date": "1932-09", "price": 71.0 },   { "date": "1932-10", "price": 65.3 },
      { "date": "1932-11", "price": 62.2 },   { "date": "1932-12", "price": 58.85 },
      { "date": "1933-01", "price": 61.85 },  { "date": "1933-02", "price": 55.15 },
      { "date": "1933-03", "price": 57.75 },  { "date": "1933-04", "price": 66.7 },
      { "date": "1933-05", "price": 83.3 },   { "date": "1933-06", "price": 93.8 },
      { "date": "1933-07", "price": 98.55 },  { "date": "1933-08", "price": 98.85 },
      { "date": "1933-09", "price": 99.45 },  { "date": "1933-10", "price": 91.65 },
      { "date": "1933-11", "price": 95.45 },  { "date": "1933-12", "price": 99.05 }
    ],
    "gold": [
      { "date": "1920-01", "price": 20.68 }, { "date": "1920-02", "price": 20.68 },
      { "date": "1920-03", "price": 20.68 }, { "date": "1920-04", "price": 20.68 },
      { "date": "1920-05", "price": 20.68 }, { "date": "1920-06", "price": 20.68 },
      { "date": "1920-07", "price": 20.68 }, { "date": "1920-08", "price": 20.68 },
      { "date": "1920-09", "price": 20.68 }, { "date": "1920-10", "price": 20.68 },
      { "date": "1920-11", "price": 20.68 }, { "date": "1920-12", "price": 20.68 },
      { "date": "1921-01", "price": 20.58 }, { "date": "1921-02", "price": 20.58 },
      { "date": "1921-03", "price": 20.58 }, { "date": "1921-04", "price": 20.58 },
      { "date": "1921-05", "price": 20.58 }, { "date": "1921-06", "price": 20.58 },
      { "date": "1921-07", "price": 20.58 }, { "date": "1921-08", "price": 20.58 },
      { "date": "1921-09", "price": 20.58 }, { "date": "1921-10", "price": 20.58 },
      { "date": "1921-11", "price": 20.58 }, { "date": "1921-12", "price": 20.58 },
      { "date": "1922-01", "price": 20.66 }, { "date": "1922-02", "price": 20.66 },
      { "date": "1922-03", "price": 20.66 }, { "date": "1922-04", "price": 20.66 },
      { "date": "1922-05", "price": 20.66 }, { "date": "1922-06", "price": 20.66 },
      { "date": "1922-07", "price": 20.66 }, { "date": "1922-08", "price": 20.66 },
      { "date": "1922-09", "price": 20.66 }, { "date": "1922-10", "price": 20.66 },
      { "date": "1922-11", "price": 20.66 }, { "date": "1922-12", "price": 20.66 },
      { "date": "1923-01", "price": 21.32 }, { "date": "1923-02", "price": 21.32 },
      { "date": "1923-03", "price": 21.32 }, { "date": "1923-04", "price": 21.32 },
      { "date": "1923-05", "price": 21.32 }, { "date": "1923-06", "price": 21.32 },
      { "date": "1923-07", "price": 21.32 }, { "date": "1923-08", "price": 21.32 },
      { "date": "1923-09", "price": 21.32 }, { "date": "1923-10", "price": 21.32 },
      { "date": "1923-11", "price": 21.32 }, { "date": "1923-12", "price": 21.32 },
      { "date": "1924-01", "price": 20.69 }, { "date": "1924-02", "price": 20.69 },
      { "date": "1924-03", "price": 20.69 }, { "date": "1924-04", "price": 20.69 },
      { "date": "1924-05", "price": 20.69 }, { "date": "1924-06", "price": 20.69 },
      { "date": "1924-07", "price": 20.69 }, { "date": "1924-08", "price": 20.69 },
      { "date": "1924-09", "price": 20.69 }, { "date": "1924-10", "price": 20.69 },
      { "date": "1924-11", "price": 20.69 }, { "date": "1924-12", "price": 20.69 },
      { "date": "1925-01", "price": 20.64 }, { "date": "1925-02", "price": 20.64 },
      { "date": "1925-03", "price": 20.64 }, { "date": "1925-04", "price": 20.64 },
      { "date": "1925-05", "price": 20.64 }, { "date": "1925-06", "price": 20.64 },
      { "date": "1925-07", "price": 20.64 }, { "date": "1925-08", "price": 20.64 },
      { "date": "1925-09", "price": 20.64 }, { "date": "1925-10", "price": 20.64 },
      { "date": "1925-11", "price": 20.64 }, { "date": "1925-12", "price": 20.64 },
      { "date": "1926-01", "price": 20.63 }, { "date": "1926-02", "price": 20.63 },
      { "date": "1926-03", "price": 20.63 }, { "date": "1926-04", "price": 20.63 },
      { "date": "1926-05", "price": 20.63 }, { "date": "1926-06", "price": 20.63 },
      { "date": "1926-07", "price": 20.63 }, { "date": "1926-08", "price": 20.63 },
      { "date": "1926-09", "price": 20.63 }, { "date": "1926-10", "price": 20.63 },
      { "date": "1926-11", "price": 20.63 }, { "date": "1926-12", "price": 20.63 },
      { "date": "1927-01", "price": 20.64 }, { "date": "1927-02", "price": 20.64 },
      { "date": "1927-03", "price": 20.64 }, { "date": "1927-04", "price": 20.64 },
      { "date": "1927-05", "price": 20.64 }, { "date": "1927-06", "price": 20.64 },
      { "date": "1927-07", "price": 20.64 }, { "date": "1927-08", "price": 20.64 },
      { "date": "1927-09", "price": 20.64 }, { "date": "1927-10", "price": 20.64 },
      { "date": "1927-11", "price": 20.64 }, { "date": "1927-12", "price": 20.64 },
      { "date": "1928-01", "price": 20.66 }, { "date": "1928-02", "price": 20.66 },
      { "date": "1928-03", "price": 20.66 }, { "date": "1928-04", "price": 20.66 },
      { "date": "1928-05", "price": 20.66 }, { "date": "1928-06", "price": 20.66 },
      { "date": "1928-07", "price": 20.66 }, { "date": "1928-08", "price": 20.66 },
      { "date": "1928-09", "price": 20.66 }, { "date": "1928-10", "price": 20.66 },
      { "date": "1928-11", "price": 20.66 }, { "date": "1928-12", "price": 20.66 },
      { "date": "1929-01", "price": 20.63 }, { "date": "1929-02", "price": 20.63 },
      { "date": "1929-03", "price": 20.63 }, { "date": "1929-04", "price": 20.63 },
      { "date": "1929-05", "price": 20.63 }, { "date": "1929-06", "price": 20.63 },
      { "date": "1929-07", "price": 20.63 }, { "date": "1929-08", "price": 20.63 },
      { "date": "1929-09", "price": 20.63 }, { "date": "1929-10", "price": 20.63 },
      { "date": "1929-11", "price": 20.63 }, { "date": "1929-12", "price": 20.63 },
      { "date": "1930-01", "price": 20.65 }, { "date": "1930-02", "price": 20.65 },
      { "date": "1930-03", "price": 20.65 }, { "date": "1930-04", "price": 20.65 },
      { "date": "1930-05", "price": 20.65 }, { "date": "1930-06", "price": 20.65 },
      { "date": "1930-07", "price": 20.65 }, { "date": "1930-08", "price": 20.65 },
      { "date": "1930-09", "price": 20.65 }, { "date": "1930-10", "price": 20.65 },
      { "date": "1930-11", "price": 20.65 }, { "date": "1930-12", "price": 20.65 },
      { "date": "1931-01", "price": 17.06 }, { "date": "1931-02", "price": 17.06 },
      { "date": "1931-03", "price": 17.06 }, { "date": "1931-04", "price": 17.06 },
      { "date": "1931-05", "price": 17.06 }, { "date": "1931-06", "price": 17.06 },
      { "date": "1931-07", "price": 17.06 }, { "date": "1931-08", "price": 17.06 },
      { "date": "1931-09", "price": 17.06 }, { "date": "1931-10", "price": 17.06 },
      { "date": "1931-11", "price": 17.06 }, { "date": "1931-12", "price": 17.06 },
      { "date": "1932-01", "price": 20.69 }, { "date": "1932-02", "price": 20.69 },
      { "date": "1932-03", "price": 20.69 }, { "date": "1932-04", "price": 20.69 },
      { "date": "1932-05", "price": 20.69 }, { "date": "1932-06", "price": 20.69 },
      { "date": "1932-07", "price": 20.69 }, { "date": "1932-08", "price": 20.69 },
      { "date": "1932-09", "price": 20.69 }, { "date": "1932-10", "price": 20.69 },
      { "date": "1932-11", "price": 20.69 }, { "date": "1932-12", "price": 20.69 },
      { "date": "1933-01", "price": 26.33 }, { "date": "1933-02", "price": 26.33 },
      { "date": "1933-03", "price": 26.33 }, { "date": "1933-04", "price": 26.33 },
      { "date": "1933-05", "price": 26.33 }, { "date": "1933-06", "price": 26.33 },
      { "date": "1933-07", "price": 26.33 }, { "date": "1933-08", "price": 26.33 },
      { "date": "1933-09", "price": 26.33 }, { "date": "1933-10", "price": 26.33 },
      { "date": "1933-11", "price": 26.33 }, { "date": "1933-12", "price": 26.33 }
    ]
  },

  "rounds": [
    {
      "id": "r1",
      "date": "January 1929",
      "asOfDate": "1929-01-31",
      "headline": "PROFITS UP 36 PER CENT AS BOOM ROLLS ON",
      "situation": "You are twenty-eight years old with $2,000 in the Farmers and Merchants Savings Bank. It took nine years of a fitter's wages to put it there. Every number in the newspaper says leaving it there has been a mistake: 536 manufacturers report profits up 36.6 per cent on last year, the steel mills are running at capacity, and the railroads have never hauled more freight. Closer to home, your town is putting up forty new houses this summer, and every one of them will need hinges, nails, paint, guttering and a stove. Nobody within fifty miles sells those things properly. The money is not really the decision. The next ten years are the decision.",
      "historicalNote": "The combined net profits of 536 manufacturing and trading companies rose 36.6% over the same period in 1928. Unemployment sat around 4%. [SOURCED]",
      "choices": [
        {
          "id": "r1a",
          "label": "Take the job at the tire plant. Twenty-five dollars a week, and the risk belongs to somebody else.",
          "effects": { "path": "job", "income": 550 },
          "outcome": "Your foreman calls it the sensible thing. Your brother-in-law, who bought two hundred shares of Radio Corporation on margin in the autumn and has not stopped mentioning it since, calls it something else. Twenty-five dollars a week is a decent wage and it has been twenty-five dollars a week for three years, while every man he drinks with has doubled his money on paper without lifting anything. You will hear about this at every family dinner between now and Christmas."
        },
        {
          "id": "r1b",
          "label": "Open the hardware store. Borrow $1,500 to fill the shelves properly.",
          "effects": { "path": "business", "debt": 1500, "income": 700 },
          "outcome": "The bank manager signs before you have finished reading him your figures. Money is cheap and every bank in the county is lending against next year. A full store beats a half-empty one for a reason every shopkeeper knows: a customer who cannot find a four-inch bolt does not come back for the paint either. So now there are goods on every shelf and a number on the wrong side of your ledger. Against a growing trade, a fixed debt is the cheapest thing you will ever buy. Everybody says so, and for the last ten years everybody has been right."
        },
        {
          "id": "r1c",
          "label": "Open the hardware store on savings alone. Half the shelves, none of the debt.",
          "effects": { "path": "business", "cash": -1500, "income": 550 },
          "outcome": "You spend $1,500 and keep $500 back for nothing in particular. Half the racks stand bare and you find yourself telling customers to come back Thursday, which some of them will not. Your neighbours think you are timid, and by every standard anybody is using in 1929 they are correct. You own every nail in the building."
        }
      ]
    },

    {
      "id": "r2",
      "date": "25 March 1929",
      "asOfDate": "1929-03-25",
      "headline": "FEDERAL RESERVE WARNS ON SPECULATION",
      "situation": "The Federal Reserve says out loud what it has been circling for months: far too much borrowed money is going into shares. The market drops hard, and the overnight rate brokers pay to fund their customers' margin accounts spikes towards twenty per cent. Then Charles Mitchell of National City Bank announces his bank will put $25 million of credit into the market regardless of what Washington thinks, and by the end of the week the whole episode is a joke at the barber's. There is now more money lent against shares in America, over $8.5 billion, than there is currency in circulation in the entire country. The lesson everybody draws is not that the Fed was wrong about the danger. It is that the Fed can be overruled by anyone with enough money and enough nerve.",
      "historicalNote": "A mini-crash occurred on 25 March 1929 after the Federal Reserve warned of excessive speculation, averted two days later when National City Bank injected $25 million. Over $8.5 billion of margin loans were outstanding, worth more than all currency circulating in the United States. [SOURCED. The call money rate near 20% is from general knowledge, VERIFY.]",
      "choices": [
        {
          "id": "r2a",
          "label": "Buy on margin. $500 down controls $1,500 of shares.",
          "effects": { "cash": -500, "debt": 1000, "buy": { "asset": "stock", "amount": 1500 } },
          "outcome": "Your broker takes a third down from customers he likes, and this year he likes everybody. The arithmetic is beautiful in one direction: a twenty per cent rise triples what you put in. He does not walk you through the other direction and you do not ask him to. By Friday you are up eleven dollars and you have started reading the closing prices before you read anything else."
        },
        {
          "id": "r2b",
          "label": "Buy $500 of shares outright. No borrowing.",
          "effects": { "cash": -500, "buy": { "asset": "stock", "amount": 500 } },
          "outcome": "A modest position, honestly owned, every share of it yours. Your broker points out, not unkindly, that the same $500 could have controlled three times as much and that you are leaving money on the table. In March 1929 he is describing the situation accurately."
        },
        {
          "id": "r2c",
          "label": "Stay out. Leave the cash where it is.",
          "effects": {},
          "outcome": "Nothing happens. You feel mildly foolish at the barber's, which is the going rate for staying out of something everyone else is in. Nothing happening will turn out to be a strategy, though it will be four years before anybody thanks you for it."
        },
        {
          "id": "r2d",
          "label": "Put every spare dollar against the loan.",
          "requires": { "debt": true },
          "effects": { "cash": -400, "debt": -400 },
          "outcome": "Dull work with nothing to show for it. The number gets smaller. Nobody at the barber's asks how your debt is coming along."
        }
      ]
    },

    {
      "id": "r3",
      "date": "August 1929",
      "asOfDate": "1929-08-31",
      "headline": "STEEL OUTPUT SLIPS, MOTOR SALES OFF",
      "situation": "The front page is about the market, which has gained twenty per cent since May. The figures on page eleven say something else entirely. Steel production is falling. Car sales are falling. Housebuilding has stalled and the lumber yards have gone quiet. The Federal Reserve has pushed its rate from four to six per cent trying to cool the speculation, which has mostly succeeded in making credit dearer for everybody who was not speculating in the first place. Nobody on Main Street reads page eleven. For ten years, nobody has needed to.",
      "historicalNote": "A minor recession began in August 1929, two months before the crash. Steel production and automobile and house sales notably declined while construction stagnated. The Fed had raised rates from 4% to 6% to combat speculation. [SOURCED]",
      "choices": [
        {
          "id": "r3a",
          "label": "Take every hour of overtime while the line is still running.",
          "requires": { "path": "job" },
          "effects": { "cash": 300 },
          "outcome": "Twelve hour shifts, six days a week. You are clearing a backlog of tires for a car maker whose dealers are already sitting on unsold vehicles nobody has come in to look at. The money in your hand is real. The order book behind it is not."
        },
        {
          "id": "r3b",
          "label": "Take the supplier's bulk discount. A year of inventory, bought on credit.",
          "requires": { "path": "business" },
          "effects": { "debt": 600, "income": 200 },
          "outcome": "Thirty per cent off list if you take the year in one delivery, and the storeroom is full to the rafters. Inventory is an asset while people are buying. When they stop, it becomes a pile of unsold iron sitting in a building you are still paying for, bought at 1929 prices, which is the detail that decides everything later."
        },
        {
          "id": "r3c",
          "label": "Cut costs and bank the difference. Something is off.",
          "effects": { "cash": 200, "income": -50 },
          "outcome": "You cannot explain the feeling to your wife, your foreman or yourself. You have read page eleven twice and you have started keeping the paper."
        },
        {
          "id": "r3d",
          "label": "The market is still climbing. Buy more shares.",
          "effects": { "cash": -400, "buy": { "asset": "stock", "amount": 400 } },
          "outcome": "Up twenty per cent since May, and every month you hesitated has cost you money. What you cannot see from here is that the productive economy turned in June and the prices will not turn until September. There is no bell. There is only a three month gap between the thing and the news of the thing."
        }
      ]
    },

    {
      "id": "r4",
      "date": "September - November 1929",
      "asOfDate": "1929-11-30",
      "headline": "BLACK TUESDAY",
      "situation": "The Dow peaked at 381.17 on the third of September. On the twentieth, London collapsed when Clarence Hatry's companies turned out to be built on forged certificates, and British money started coming home. On Thursday the twenty-fourth, New York opened eleven per cent down; a group of bankers walked onto the floor in full view and bought steel shares at above-market prices, and by the close the market had almost recovered. It had not recovered. Monday the twenty-eighth falls about thirteen per cent. Tuesday the twenty-ninth falls about twelve more on sixteen million shares, and the ticker runs so far behind that for most of the day nobody in America knows what they own. Then on Wednesday the thirtieth the market jumps roughly twelve per cent in a single session and the papers call it the turn. It is not the turn. It is your last exit above 250 for a very long time.",
      "historicalNote": "The Dow peaked at 381.17 on 3 September 1929 and would not regain that level until 23 November 1954. The London Stock Exchange crashed on 20 September after the Hatry Group collapse wiped out £24 million. The market bottomed at 198.60 on 13 November. [SOURCED.] Daily percentage moves for 28, 29 and 30 October and the bankers' pool intervention on 24 October are from general knowledge and should be [VERIFIED] against a daily Dow series before shipping.",
      "specialRule": "Choices are resolved at a bounce price of 260, representing the 30 October rally, then all remaining shares are revalued to 198.60 at round end. Run the margin call check after revaluation.",
      "choices": [
        {
          "id": "r4a",
          "label": "Sell everything into Wednesday's rally.",
          "effects": { "sell": { "asset": "stock", "fraction": 1 } },
          "outcome": "You take 260 for shares that were 381 in September. Your broker tells you that you have panicked at the exact bottom, that the bankers are in, that Rockefeller himself is buying. He will still be explaining this in 1932, from a different chair, in a different building."
        },
        {
          "id": "r4b",
          "label": "Hold. This is a correction, not a collapse.",
          "effects": {},
          "outcome": "By the thirteenth of November your holding is worth 198.60, roughly half its September value. Every respectable voice in the country agrees this is temporary. They will go on agreeing, without interruption, for another three years."
        },
        {
          "id": "r4c",
          "label": "Buy the fall. Borrow to do it.",
          "effects": { "debt": 1000, "buy": { "asset": "stock", "amount": 1000 } },
          "outcome": "You buy at 260 into a market that ends the round at 198.60. Your collateral has fallen faster than your loan, and that is the one piece of arithmetic in this entire game that cannot be waited out. The broker's telegram wants more money by noon."
        },
        {
          "id": "r4d",
          "label": "Sell half. Split the difference.",
          "effects": { "sell": { "asset": "stock", "fraction": 0.5 } },
          "outcome": "Half the regret and half the relief, which is the choice most people actually made. It is also the only one that leaves you holding both a position and a decision when April comes."
        }
      ]
    },

    {
      "id": "r5",
      "date": "17 April 1930",
      "asOfDate": "1930-04-17",
      "headline": "MARKET REGAINS EARLY-1929 LEVELS",
      "situation": "The Dow closes at 294.07, back where it stood in January of last year. The crash is being discussed in the past tense. The forecasters who predicted a rebound feel vindicated, the word in every paper is recovery, and the President has said the worst will be behind us within sixty days. What almost nobody is putting on the front page: 1,350 banks failed last year, unemployment has gone from four per cent to nine, and prices have begun to fall. Falling prices sound like good news and are the most dangerous thing in this game. A dollar in your pocket is quietly getting stronger. So is every dollar you owe.",
      "historicalNote": "The Dow reached a bear market rally peak of 294.07 on 17 April 1930, matching early-1929 levels but 30% below the September peak. Forecasters throughout 1930 optimistically predicted a rebound in 1931 and felt vindicated by the spring rally. 1930 saw GDP contract 8.5%, inflation of -6.4%, unemployment of 9%, and 1,350 bank failures. [SOURCED]",
      "choices": [
        {
          "id": "r5a",
          "label": "Get back in. You have seen the bottom and this is the recovery.",
          "effects": { "cash": -800, "buy": { "asset": "stock", "amount": 800 } },
          "outcome": "This is the most expensive choice available anywhere in the game, and it will feel like the shrewdest one for roughly eleven months. From 294, the road runs to 41."
        },
        {
          "id": "r5b",
          "label": "Sell into the rally. Take what you can get.",
          "effects": { "sell": { "asset": "stock", "fraction": 1 } },
          "outcome": "You will spend the next two years being told you sold too early by men who held on. You did not sell too early. You sold seven times higher than the bottom."
        },
        {
          "id": "r5c",
          "label": "Kill the debt. Every spare dollar against the loan.",
          "requires": { "debt": true },
          "effects": { "cash": -1000, "debt": -1000 },
          "outcome": "The dullest button on the board. Prices are falling and your debt is not, so every month you carry it, it grows heavier without anybody adding a cent to it. No statement will ever show you this happening. It is happening."
        },
        {
          "id": "r5d",
          "label": "Sit in cash and wait to understand what this is.",
          "effects": {},
          "outcome": "By December your dollars buy 6.4 per cent more than they did in January. You did nothing to earn that. Doing nothing has now outperformed the stock market, your bank and your own trade, and it will keep doing so for three more years."
        }
      ]
    },

    {
      "id": "r6",
      "date": "17 June 1930",
      "asOfDate": "1930-06-17",
      "headline": "SMOOT-HAWLEY TARIFF SIGNED",
      "situation": "More than a thousand economists sign a public petition asking the President not to sign it. He signs it. Duties rise on thousands of imported goods and within months Canada, France and a dozen others answer in kind. The first casualty is the farm export trade, and the second casualty is every country bank that lent against a farm, which is most of the banks in America. Exports will fall from $5.2 billion in 1929 to $1.7 billion by 1933. The effect reaches you two ways at once: the line at the plant that makes machinery for foreign buyers, and the half of your shelves that arrived on a ship.",
      "historicalNote": "Exports fell from $5.2 billion in 1929 to $1.7 billion in 1933. Economists generally hold that Smoot-Hawley did not cause the Depression but worsened it and stunted recovery after 1933. [SOURCED.] The petition of economists urging a veto is real and I believe was signed by 1,028 economists, but treat that figure as [VERIFY] before printing it.",
      "choices": [
        {
          "id": "r6a",
          "label": "Ask for a transfer off the export line onto domestic work.",
          "requires": { "path": "job" },
          "effects": { "income": -150, "flags": ["income_protected"] },
          "outcome": "Lower pay, and the foreman writes you down as difficult, which is a thing that gets remembered when the lists are drawn up. The export line runs another eleven months and then stops forever."
        },
        {
          "id": "r6b",
          "label": "Stay on the export line. It pays better and it always has.",
          "requires": { "path": "job" },
          "effects": { "income": 150, "flags": ["income_exposed"] },
          "outcome": "It pays better this year for precisely the reason it will not exist next year. The money is good and you have a family, and those two facts are how nearly everybody made this decision."
        },
        {
          "id": "r6c",
          "label": "Half your inventory is imported. Switch to domestic suppliers at higher cost.",
          "requires": { "path": "business" },
          "effects": { "cash": -300, "flags": ["domestic_supply"] },
          "outcome": "Thinner margins, full shelves, and goods bought at prices nobody will be willing to pay in two years. Full shelves are about to stop being an asset and start being a bill."
        },
        {
          "id": "r6d",
          "label": "Absorb the tariff yourself. Hold your prices and keep the customers.",
          "requires": { "path": "business" },
          "effects": { "income": -200, "flags": ["loyal_customers"] },
          "outcome": "You lose a little on every sale, and the customers notice, which is worth something only if they still have wages in 1932. A quarter of them will not. The rest will remember, and in a town this size, remembering turns out to be worth more than the margin was."
        }
      ]
    },

    {
      "id": "r7",
      "date": "December 1930",
      "asOfDate": "1930-12-31",
      "headline": "BANK OF UNITED STATES CLOSES ITS DOORS",
      "situation": "Caldwell and Company went down in November and took most of the small banks in Tennessee and Kentucky with it. Now the Bank of United States has failed in New York holding more than $160 million of deposits belonging to something like four hundred thousand people, a great many of whom chose it because the name sounded official. It was not a government bank. There is no deposit insurance anywhere in America; that is three years away and nobody in this queue knows it is coming. Over three hundred banks fail this month. This morning there is a line outside your own bank made up of people who each, individually and reasonably, believe they are being prudent.",
      "historicalNote": "1,350 banks failed in 1930. Over 300 failed in December alone. The Bank of United States held over $160 million in deposits and its failure is widely considered the moment the banking collapse hit critical mass. There was no deposit insurance until 1933. [SOURCED.] The roughly 400,000 depositors figure and the point about the misleading name are from general knowledge, [VERIFY].",
      "specialRule": "Roll or set a flag: the player's bank fails at the end of this round. Any cash left on deposit is reduced by 60%. Players who withdrew keep their money but take a small 'cash at home' risk in a later round.",
      "choices": [
        {
          "id": "r7a",
          "label": "Join the queue. Take out everything and keep it in the house.",
          "effects": { "flags": ["cash_at_home"] },
          "outcome": "Four hours in the cold, and you walk home with your savings in a boot box feeling like a hysteric. Your bank suspends payments on the eleventh. The boot box goes under the floorboards and stays there, earning nothing, protecting everything."
        },
        {
          "id": "r7b",
          "label": "Leave it. Your bank is sound, and runs are what destroy sound banks.",
          "effects": { "flags": ["deposits_exposed"] },
          "outcome": "Correct in general and fatal in particular. Sound describes the loan book. It does not describe what happens when four hundred people want cash across the same counter on the same Tuesday."
        },
        {
          "id": "r7c",
          "label": "Withdraw half and leave half.",
          "effects": { "flags": ["cash_at_home", "deposits_exposed_half"] },
          "outcome": "You split the difference and lose sixty per cent of the half you left behind. Hedging is never free. It simply spreads the cost thinly enough that you cannot point at where it went."
        }
      ]
    },

    {
      "id": "r8",
      "date": "May - June 1931",
      "asOfDate": "1931-06-30",
      "headline": "CREDITANSTALT FAILS, EUROPE FOLLOWS",
      "situation": "Austria's largest bank, holding assets worth about a sixth of the country's entire economy, is insolvent. The failure runs into Germany, and from Germany into Britain. Closer to home, of the 193 state-chartered banks around Chicago in 1929, most are already gone. Prices are now falling more than nine per cent a year, and you should read that as an interest rate, because that is exactly what it is. Money sitting in a drawer is earning nine per cent, untaxed, for doing nothing. Every debt in America is growing by the same nine per cent without a single payment being missed. This is the round where the rules of the last decade finish inverting.",
      "situationAppend": {
        "job": "At the plant they are calling it the six-hour day, and the company is being praised in the newspapers for it: four shifts instead of three, so the available work is spread across more men and nobody has to be turned off. Your pay falls by a quarter. You keep the job, which this year is worth keeping. You also now know that the plant does not have enough work to need you for eight hours, and that whatever they call it, that is what the arrangement is.",
        "business": "Your customers have started asking whether you can put it on account, and you have started saying yes, because the alternative is no sale at all. Half your ledger is now money owed to you by men whose own hours have just been cut."
      },
      "historicalNote": "Creditanstalt represented 16% of Austria's GDP and became insolvent on 11 May 1931. Of 193 state-chartered banks in the Chicago area in 1929, only 35 survived to the end of 1933. 1931 saw 2,294 US bank failures, 28,285 business failures, unemployment at 16%, and inflation of -9.3%. [SOURCED.] The six-hour day is a real Akron detail: I believe Goodyear moved to a six-hour, four-shift day around 1931 specifically to share available work rather than lay men off, and was widely praised for it. Confidence moderate, [VERIFY] before presenting it as fact.",
      "specialRule": "SHORT TIME. Any player on the job path has income reduced by 40% from this round onward. Players carrying the income_exposed flag from r6 do not go on short time; they are laid off outright here, income 0, and arrive at r10 having already been out of work for fourteen months. (Text corrected during the v0.5 merge — the flag is income_exposed, matching the actual r6b effect; the design doc's original draft called it export_exposed.)",
      "choices": [
        {
          "id": "r8a",
          "label": "Convert savings into gold at $20.67 an ounce.",
          "effects": { "buy": { "asset": "gold", "fraction": 0.6 } },
          "outcome": "Gold does not go up. It sits exactly where it is while everything around it falls, which in a deflation amounts to the same thing. Worth noticing, though nobody notices it in 1931: that $20.67 is a price fixed by the government, and what a government fixes it can also unfix, or come and collect."
        },
        {
          "id": "r8c",
          "label": "Do nothing at all. Hold cash.",
          "effects": {},
          "outcome": "Your money buys nine per cent more than it did last year and you did nothing whatsoever to earn it. It is the highest safe return available anywhere in the United States, and it will never appear in your accounts as income, which is why almost nobody believes it is happening."
        },
        {
          "id": "r8d",
          "label": "Buy shares. They cannot go much lower than this.",
          "effects": { "cash": -500, "buy": { "asset": "stock", "amount": 500 } },
          "outcome": "They can, and they will, by another two thirds. It cannot go lower is a statement about the limits of your imagination, not about the limits of the market."
        }
      ]
    },

    {
      "id": "r9",
      "date": "21 September 1931",
      "asOfDate": "1931-09-21",
      "headline": "BRITAIN ABANDONS THE GOLD STANDARD",
      "situation": "Sterling falls roughly a quarter against the dollar and the predicted catastrophe simply does not arrive. British exports get cheaper, British prices stop falling, and within nine months the Bank of England has cut its rate to two per cent and left it there. Sweden, Norway and Denmark follow Britain off gold within weeks, and every one of them begins recovering ahead of the countries that stayed. The Federal Reserve does the exact opposite: to defend the dollar's link to gold it raises its rate from 1.5 to 3.5 per cent, in the third year of a depression. With prices falling nine per cent a year, the real cost of borrowing in America is now somewhere north of twelve per cent. There is no phrase for this yet. There is just the fact of it, working on everyone you know.",
      "historicalNote": "Britain left the gold standard on 21 September 1931. Norway, Sweden, Denmark and Finland followed within weeks and all recovered earlier than countries that stayed on gold. The Fed raised from 1.50% to 3.50% to maintain the gold standard, worsening the Depression. As deflation intensified, real interest rates were magnified and rewarded those who held money. [SOURCED.] CORRECTION FROM v0.1: the Bank of England did not cut immediately. Best understanding is that Bank Rate was RAISED to 6% on 21 September 1931 to defend sterling, then cut in stages during 1932 to 2% by roughly June. [VERIFY against the Bank of England official Bank Rate series.]",
      "choices": [
        {
          "id": "r9b",
          "label": "Buy more gold. The dollar is next.",
          "effects": { "buy": { "asset": "gold", "fraction": 0.5 } },
          "outcome": "A sound inference from the evidence in front of you, and you are right about the direction. Make a note of the date, and see what the government does about it in April 1933."
        },
        {
          "id": "r9c",
          "label": "Hold dollars and let it play out.",
          "effects": { "flags": ["deflation_beneficiary"] },
          "outcome": "The Fed has just raised rates into a depression to defend a peg. Every month that policy continues makes your cash stronger and every debtor in America weaker. You are on the right side of a decision you did not make, cannot see, and would not have been consulted about."
        },
        {
          "id": "r9d",
          "label": "Borrow now, while rates are still low, and buy assets cheap.",
          "effects": { "debt": 800, "cash": 800 },
          "outcome": "Rates went from 1.5 to 3.5 last month and prices are falling more than nine per cent a year, so you have just borrowed at something close to thirteen per cent in real terms in order to buy assets that fall for another ten months. Every part of that sentence would have been good advice in 1926."
        }
      ]
    },

    {
      "id": "r10",
      "date": "8 July 1932",
      "asOfDate": "1932-07-08",
      "headline": "DOW CLOSES AT 41.22",
      "situation": "Eighty-nine per cent below the September 1929 peak, and the lowest close the century will ever record. One American worker in four has no job. Two million people are homeless and moving. Industrial output is half what it was in 1929, national income has fallen from $105 billion to $57 billion, and in June the government raised income tax, corporation tax and sales taxes in order to balance the budget. This is the bottom. Nothing you can see today tells you that, and it will not be obvious for years. The only question that matters now is whether you have anything left to buy it with, and that question was answered by what you did in October 1929.",
      "situationAppend": {
        "job": "The plant posts a list in the first week of July. Yours is on it, along with four hundred others, and the foreman reading it out has not been told when anybody is coming back, because nobody has told him either. You empty your locker in under ten minutes. Whatever you decide from here, you decide it without wages, which is the position one American worker in four is now in. Nothing you did put you on that list, and that is the part that takes longest to accept.",
        "business": "Your takings are down two thirds on 1929 and half of what leaves the shop now goes on account, which at this point is a polite word for a gift. You are not competing with the other hardware store. You are competing with the fact that people have stopped replacing things and started mending them."
      },
      "historicalNote": "The Dow bottomed at 41.22 on 8 July 1932, an 89% loss from the 1929 peak and the lowest level recorded in the 20th century. Unemployment peaked at 25%. Two million were homeless. The Revenue Act of 1932 raised personal, corporate and sales taxes on 6 June. US nominal GDP bottomed at $57 billion, down from $105 billion in 1929. [SOURCED]",
      "specialRule": "LAYOFF. Every remaining job-path player loses their employment when this round is entered, before any income is credited. Not avoidable and not a punishment for a prior mistake — at 25% unemployment it is the base rate. income_protected (r6a) means two days a week on the domestic line, income 150, rather than 0. income_exposed (r6b) players were already laid off at r8 and simply carry that forward. Business-path players are unaffected by this rule. (Text corrected during the v0.5 merge — flag name was safer_department in an earlier draft; the shipped flag is income_protected.)",
      "choices": [
        {
          "id": "r10a",
          "label": "Buy shares at 41. Everything you have left.",
          "effects": { "cash": -1200, "buy": { "asset": "stock", "amount": 1200 } },
          "outcome": "The correct move, made by almost nobody, for the simple reason that almost nobody still had cash to make it with. Every dollar you spend here buys what seven dollars bought in 1929. Being right about the bottom was never the difficult part. Arriving at it with money was."
        },
        {
          "id": "r10b",
          "label": "Cut everything to the bone and get through the year.",
          "effects": { "income": 100 },
          "outcome": "One room heated, meat twice a week, the same boots resoled twice. You are still trading, which is more than 28,285 businesses managed last year."
        },
        {
          "id": "r10c",
          "label": "Go on the relief rolls. Take whatever the county is handing out.",
          "requires": { "path": "job" },
          "effects": { "income": 300, "flags": ["on_relief"] },
          "outcome": "Three hundred dollars a year and work your father would not have recognised as work. You queue with men you used to give orders to. It is money coming in, and almost nothing is money coming in, and the shame of it wears off faster than you expect, which is its own kind of information about the year."
        },
        {
          "id": "r10e",
          "label": "Stay off the rolls. Live on savings and take day work where you can find it.",
          "requires": { "path": "job" },
          "effects": { "income": 100, "flags": ["kept_off_relief"] },
          "outcome": "A hundred dollars for hauling, digging and painting, paid in cash by people nearly as short as you are. You are eating your savings to do it. What nobody can see, including you, is that the savings you are eating buy more every month you hold them, so the meter is running slower than it feels. Whether that is worth the difference is a question about pride, and pride is not in the scoring."
        },
        {
          "id": "r10d",
          "label": "Close the store. Sell the inventory for whatever it fetches.",
          "requires": { "path": "business" },
          "effects": { "cash": 400, "incomeMultiplier": 0.3, "flags": ["business_closed"] },
          "outcome": "Forty cents on the dollar for goods you paid full price for in 1929. The lease ends, the sign comes down, and the loan sits exactly where it was, unchanged, patient, indifferent to whether the shop exists."
        }
      ]
    },

    {
      "id": "r11",
      "date": "February - April 1933",
      "asOfDate": "1933-04-30",
      "headline": "THE BANKS ARE SHUT",
      "situation": "Michigan closes its banks on the fourteenth of February. Within three weeks thirty-eight states have done the same, and on the sixth of March the President shuts every bank in the country for a week. When they reopen, more than four thousand of them do not: $3.6 billion of deposits are simply gone. The banks that do reopen have been examined and declared sound by the Treasury, and for the first time in American history the deposits inside them are going to be insured. Then on the fifth of April, Executive Order 6102 makes it illegal for a private citizen to hold gold coin or bullion. You have until the first of May to hand yours in at $20.67 an ounce.",
      "historicalNote": "Michigan declared the first indefinite bank holiday on 14 February 1933. By 6 March, 38 states had followed and all banking was suspended for a week. The Emergency Banking Act of 9 March closed over 4,000 irreparably insolvent banks holding $3.6 billion in deposits, while banks controlling 90% of activity reopened by 15 March. Executive Order 6102 forbade hoarding of gold coin, bullion and certificates from 1 May 1933. [SOURCED.] The January 1934 revaluation of gold to $35/oz under the Gold Reserve Act, and the return of legal private gold ownership at the end of 1974, are from general knowledge, [VERIFY].",
      "choices": [
        {
          "id": "r11a",
          "label": "Hand in the gold as required. Take the $20.67.",
          "requires": { "gold": true },
          "effects": { "sell": { "asset": "gold", "fraction": 1 } },
          "outcome": "In January 1934 the government revalues gold at $35 an ounce, a gain of about sixty-nine per cent, and keeps every cent of it. Your hedge held against the market and did not hold against the state. This is the lesson the round exists to teach: private prudence has a ceiling, and somebody else decides where it sits."
        },
        {
          "id": "r11b",
          "label": "Keep it hidden. Say nothing to anyone.",
          "requires": { "gold": true },
          "effects": { "flags": ["gold_hidden"] },
          "outcome": "It is under the coal in the cellar. You cannot spend it, bank it, insure it, sell it openly or borrow against it, and lawful private ownership does not return until the end of 1974. It has stopped being money and become a story you are not able to tell."
        },
        {
          "id": "r11c",
          "label": "Redeposit the boot box now the deposits are insured.",
          "requires": { "flag": "cash_at_home" },
          "effects": { "flags": ["redeposited"] },
          "outcome": "Over a billion dollars of hoarded cash goes back into the banking system in the last fortnight of March, and yours is part of it. The credit machine starts turning again. You left early and came back early, and those two decisions, three years apart, are the whole game."
        },
        {
          "id": "r11d",
          "label": "Wait. You have been wrong about what counts as safe before.",
          "effects": {},
          "outcome": "Defensible after what you have watched. It also means you miss the first leg of the recovery, and in every recovery the first leg is the steepest."
        }
      ]
    },

    {
      "id": "r12",
      "date": "December 1933",
      "asOfDate": "1933-12-31",
      "headline": "PRODUCTION UP 57 PER CENT SINCE MARCH",
      "situation": "Industrial output has climbed from 54.3 in March to 85.5 in July. Deposits are insured. Commercial banking has been forcibly separated from the securities business. Four million people are drawing wages from the Civil Works Administration, and prices have finally stopped falling. Prohibition ended three weeks ago and the bars are legal for the first time since you were nineteen. The Dow stands at 99, which is a hundred and forty per cent above the July 1932 low and seventy-four per cent below the September 1929 peak. Everyone you know measures 1933 from the bottom, because measuring it from the top is unbearable. The bottom is not the measurement that decides who is still standing. Here is yours.",
      "historicalNote": "The Federal Reserve industrial production index rebounded to 85.5 in July 1933, a 57% increase over March's 54.3. The 1933 Banking Act of 16 June created the FDIC and separated commercial from investment banking under Glass-Steagall. The Civil Works Administration created 8 November employed over 4 million people. Prohibition was repealed nationally on 5 December. Inflation turned positive at 1%. [SOURCED]",
      "isEnding": true,
      "choices": []
    }
  ],

  "endings": [
    {
      "id": "ruined",
      "trigger": "Margin call fired at any point, or final net worth below zero.",
      "title": "WIPED OUT",
      "text": "You were not unlucky. You were leveraged. A debt is a fixed number in a world where every other number was falling, and that arithmetic beat you before you understood you were in a fight with it."
    },
    {
      "id": "survived_poorer",
      "trigger": "Final real net worth below starting real net worth, but positive.",
      "title": "STILL HERE",
      "text": "You lost money and you kept your feet. Between 1929 and 1933 roughly nine thousand banks failed and a quarter of the country was out of work. Still being here was the median good outcome, and most people did not get it."
    },
    {
      "id": "preserved",
      "trigger": "Final real net worth within 20% of starting real net worth, no debt.",
      "title": "INTACT",
      "text": "You did nothing clever. You stayed out of debt, you got out of the banks, and you sat in cash while the prices fell around you. Your dollars bought roughly a third more in 1933 than they did in 1929. Doing nothing, correctly, was the highest-returning strategy available in America, and there was no year in which it felt like one."
    },
    {
      "id": "thrived",
      "trigger": "Final real net worth above 150% of starting, requires cash held through 1932 and a purchase at or near the bottom.",
      "title": "ON THE OTHER SIDE",
      "text": "You bought at 41.22 because you still had cash at 41.22, and you still had cash because of something you decided in October 1929. Finding the bottom was never the hard part. Arriving there solvent was."
    }
  ]
};
