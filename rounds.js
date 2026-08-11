// ROUNDS content data for "The Long Fall" (1929-1933).
// Loaded by index.html via a plain <script src="rounds.js"> tag. No build step.
//
// SCHEMA NOTE — every choice's "effects" object may only use these six keys,
// plus a single "requires" gate on the choice itself:
//
//   cash    — number. Immediate dollar change to cash on hand. Negative = spend.
//   debt    — number. Immediate dollar change to debt owed. Negative = pay down.
//   buy     — { asset: "stock" | "gold", amount: N }   spend a fixed $N to acquire
//                 that much value of the asset at the round's market price.
//             OR { asset: "stock" | "gold", fraction: F }   convert that fraction
//                 (0-1) of CURRENT CASH into the asset. Used only where the source
//                 material described a percentage of savings, not a fixed dollar figure.
//   sell    — { asset: "stock" | "gold", fraction: F }   sell that fraction (0-1) of
//                 CURRENTLY HELD units of the asset at the round's market price.
//                 Proceeds are added to cash automatically — not listed separately.
//   income  — number. Change to the player's ongoing per-round income baseline,
//                 starting the following round. Running total starts at 0
//                 (see config.startingIncome) and is built up by choices in round 1.
//   flags   — array of strings. Recorded permanently, no numeric effect on their own.
//
//   requires — optional gate on a choice, one of:
//                 { debt: true }        — only offered if current debt > 0
//                 { gold: true }        — only offered if current gold holding > 0
//                 { flag: "some_flag" } — only offered if that flag was previously set
//
// Anything a round needs beyond this (special pricing, bank-failure math, etc.) is
// left as plain "specialRule" text for whoever writes the game logic later — it is
// NOT mechanically enforced by the effects above. See the ambiguities list delivered
// alongside this file for exactly which rounds need that custom handling.

const ROUNDS = {
  meta: {
    title: "The Long Fall",
    subtitle: "1929-1933",
    version: "0.2",
    designNote: "The core lesson: deflation inverts the rules of the 1920s. Cash quietly wins. Debt quietly kills. Every instinct that made money in 1928 destroys you by 1932. The scoring is deliberately built so the leveraged optimist loses and the boring cash-holder survives. Let the player discover this rather than telling them.",
    sourcing: {
      sourced: "Dow values in rounds 4, 5 and 10 (381.17, 198.60, 294.07, 41.22), annual inflation rates, unemployment rates, the $8.5bn margin loan figure, export collapse figures, and all named historical events are drawn from the Wikipedia Timeline of the Great Depression.",
      invented: "Dow values in rounds 1, 2, 3, 6, 7, 8, 9, 11 and 12 are MY INTERPOLATIONS for playability, not historical data. Player incomes, expenses, starting cash and all choice effect numbers are invented for game balance. Verify against a primary source (e.g. FRED, Federal Reserve History) before presenting any of these as fact in-game.",
      recommendation: "In the UI, mark historically sourced figures differently from invented ones. Honesty about which is which is itself part of the educational value."
    }
  },

  config: {
    startingCash: 2000,
    startingDebt: 0,
    startingStocks: 0,
    startingGold: 0,
    startingIncome: 0, // running per-round income baseline; built up by round 1 choices
    marginCallRule: "At the end of any round, if debt > (cash + stocksValue + goldValue), the player is wiped out: all holdings are seized, debt is cleared, and the RUINED ending fires immediately.",
    goldPriceRule: "Gold is fixed at $20.67/oz until round 11. This is deliberate: gold does not rise, it simply holds value while everything else falls. That IS the point.",
    realValueRule: "Final score uses real purchasing power: nominalNetWorth / (priceLevel / 100). A player holding $2,000 cash in 1932 has roughly 32% more purchasing power than in 1929 despite the number not changing. Show this at the end. It is the whole lesson."
  },

  market: {
    r1:  { dow: 300, priceLevel: 100.0, unemployment: 4,  sourced: false },
    r2:  { dow: 300, priceLevel: 100.0, unemployment: 4,  sourced: false },
    r3:  { dow: 350, priceLevel: 100.0, unemployment: 4,  sourced: false },
    r4:  { dow: 198.60, priceLevel: 100.0, unemployment: 4, sourced: true, note: "Peak 381.17 on 3 Sept; bottom 198.60 on 13 Nov. The mid-round bounce price of 260 referenced in this round's flavor text is invented and is NOT mechanically applied — see ambiguities list." },
    r5:  { dow: 294.07, priceLevel: 93.6, unemployment: 9, sourced: true, note: "17 April 1930 bear market rally peak." },
    r6:  { dow: 230, priceLevel: 93.6, unemployment: 9,  sourced: false },
    r7:  { dow: 165, priceLevel: 93.6, unemployment: 9,  sourced: false },
    r8:  { dow: 130, priceLevel: 84.9, unemployment: 16, sourced: false },
    r9:  { dow: 100, priceLevel: 84.9, unemployment: 16, sourced: false },
    r10: { dow: 41.22, priceLevel: 75.6, unemployment: 25, sourced: true, note: "8 July 1932 low, an 89% fall from peak. Unemployment peaks at 25%." },
    r11: { dow: 55, priceLevel: 75.6, unemployment: 25, sourced: false },
    r12: { dow: 99, priceLevel: 76.4, unemployment: 22, sourced: false }
  },

  // Real historical monthly prices, 1929-1933, for the two reference
  // charts (separate from the game's own invented round-by-round
  // prices in `market` above). Each round has an `asOfDate` field —
  // the charts only ever show data up to that date, so they reveal
  // more of the real history as the game progresses.
  //
  // Both are monthly, not daily — daily Dow/gold data from this era
  // isn't available from free sources. Dow is from the seaborn-data
  // "dowjones.csv" dataset (itself sourced from the NBER Macrohistory
  // database). Gold is from the datasets/gold-prices "monthly.csv"
  // dataset. Gold was legally fixed by the US government for most of
  // this window, which is why it only has 5 distinct values across
  // 60 months — that flatness is real, not a data gap.
  historicalPrices: {
    source: "Dow: seaborn-data dowjones.csv (NBER Macrohistory). Gold: datasets/gold-prices monthly.csv.",
    dow: [
      { date: "1929-01", price: 307.25 }, { date: "1929-02", price: 309.0 },
      { date: "1929-03", price: 308.85 }, { date: "1929-04", price: 309.2 },
      { date: "1929-05", price: 310.25 }, { date: "1929-06", price: 316.45 },
      { date: "1929-07", price: 341.45 }, { date: "1929-08", price: 359.15 },
      { date: "1929-09", price: 362.35 }, { date: "1929-10", price: 291.5 },
      { date: "1929-11", price: 228.2 },  { date: "1929-12", price: 247.2 },
      { date: "1930-01", price: 255.65 }, { date: "1930-02", price: 267.4 },
      { date: "1930-03", price: 278.25 }, { date: "1930-04", price: 285.5 },
      { date: "1930-05", price: 266.7 },  { date: "1930-06", price: 243.15 },
      { date: "1930-07", price: 229.8 },  { date: "1930-08", price: 228.8 },
      { date: "1930-09", price: 225.0 },  { date: "1930-10", price: 198.75 },
      { date: "1930-11", price: 180.95 }, { date: "1930-12", price: 172.15 },
      { date: "1931-01", price: 167.25 }, { date: "1931-02", price: 181.55 },
      { date: "1931-03", price: 180.05 }, { date: "1931-04", price: 158.0 },
      { date: "1931-05", price: 141.45 }, { date: "1931-06", price: 139.3 },
      { date: "1931-07", price: 145.35 }, { date: "1931-08", price: 139.8 },
      { date: "1931-09", price: 118.35 }, { date: "1931-10", price: 98.1 },
      { date: "1931-11", price: 103.4 },  { date: "1931-12", price: 82.8 },
      { date: "1932-01", price: 78.55 },  { date: "1932-02", price: 78.9 },
      { date: "1932-03", price: 81.05 },  { date: "1932-04", price: 64.05 },
      { date: "1932-05", price: 51.85 },  { date: "1932-06", price: 46.85 },
      { date: "1932-07", price: 47.75 },  { date: "1932-08", price: 64.4 },
      { date: "1932-09", price: 71.0 },   { date: "1932-10", price: 65.3 },
      { date: "1932-11", price: 62.2 },   { date: "1932-12", price: 58.85 },
      { date: "1933-01", price: 61.85 },  { date: "1933-02", price: 55.15 },
      { date: "1933-03", price: 57.75 },  { date: "1933-04", price: 66.7 },
      { date: "1933-05", price: 83.3 },   { date: "1933-06", price: 93.8 },
      { date: "1933-07", price: 98.55 },  { date: "1933-08", price: 98.85 },
      { date: "1933-09", price: 99.45 },  { date: "1933-10", price: 91.65 },
      { date: "1933-11", price: 95.45 },  { date: "1933-12", price: 99.05 }
    ],
    gold: [
      { date: "1929-01", price: 20.63 }, { date: "1929-02", price: 20.63 },
      { date: "1929-03", price: 20.63 }, { date: "1929-04", price: 20.63 },
      { date: "1929-05", price: 20.63 }, { date: "1929-06", price: 20.63 },
      { date: "1929-07", price: 20.63 }, { date: "1929-08", price: 20.63 },
      { date: "1929-09", price: 20.63 }, { date: "1929-10", price: 20.63 },
      { date: "1929-11", price: 20.63 }, { date: "1929-12", price: 20.63 },
      { date: "1930-01", price: 20.65 }, { date: "1930-02", price: 20.65 },
      { date: "1930-03", price: 20.65 }, { date: "1930-04", price: 20.65 },
      { date: "1930-05", price: 20.65 }, { date: "1930-06", price: 20.65 },
      { date: "1930-07", price: 20.65 }, { date: "1930-08", price: 20.65 },
      { date: "1930-09", price: 20.65 }, { date: "1930-10", price: 20.65 },
      { date: "1930-11", price: 20.65 }, { date: "1930-12", price: 20.65 },
      { date: "1931-01", price: 17.06 }, { date: "1931-02", price: 17.06 },
      { date: "1931-03", price: 17.06 }, { date: "1931-04", price: 17.06 },
      { date: "1931-05", price: 17.06 }, { date: "1931-06", price: 17.06 },
      { date: "1931-07", price: 17.06 }, { date: "1931-08", price: 17.06 },
      { date: "1931-09", price: 17.06 }, { date: "1931-10", price: 17.06 },
      { date: "1931-11", price: 17.06 }, { date: "1931-12", price: 17.06 },
      { date: "1932-01", price: 20.69 }, { date: "1932-02", price: 20.69 },
      { date: "1932-03", price: 20.69 }, { date: "1932-04", price: 20.69 },
      { date: "1932-05", price: 20.69 }, { date: "1932-06", price: 20.69 },
      { date: "1932-07", price: 20.69 }, { date: "1932-08", price: 20.69 },
      { date: "1932-09", price: 20.69 }, { date: "1932-10", price: 20.69 },
      { date: "1932-11", price: 20.69 }, { date: "1932-12", price: 20.69 },
      { date: "1933-01", price: 26.33 }, { date: "1933-02", price: 26.33 },
      { date: "1933-03", price: 26.33 }, { date: "1933-04", price: 26.33 },
      { date: "1933-05", price: 26.33 }, { date: "1933-06", price: 26.33 },
      { date: "1933-07", price: 26.33 }, { date: "1933-08", price: 26.33 },
      { date: "1933-09", price: 26.33 }, { date: "1933-10", price: 26.33 },
      { date: "1933-11", price: 26.33 }, { date: "1933-12", price: 26.33 }
    ]
  },

  rounds: [
    {
      id: "r1",
      date: "Spring 1929",
      // Cutoff for the real historical price charts — see historicalPrices
      // below. "Spring" is vague, so this uses late May as a reasonable
      // reading of it.
      asOfDate: "1929-05-31",
      headline: "RECORD PROFITS AS BOOM CONTINUES",
      situation: "Steel is setting records. Retail sales, construction starts and railroad revenues break every previous mark. You have $2,000 saved and a decision to make about the rest of your life.",
      historicalNote: "The combined net profits of 536 manufacturing and trading companies rose 36.6% over the same period in 1928. Unemployment sat around 4%. [SOURCED]",
      choices: [
        {
          id: "r1a",
          label: "Take the steady job at the tyre plant. $800 a season, no risk.",
          effects: { income: 550 },
          outcome: "Your foreman calls you sensible. Your brother-in-law, who just bought two hundred shares of RCA on margin, calls you something else."
        },
        {
          id: "r1b",
          label: "Open a hardware store. Borrow $1,500 to stock it properly.",
          effects: { debt: 1500, income: 700 },
          outcome: "The bank manager barely looks at your figures. Money is cheap and everyone is lending. Your shelves are full and your ledger has a number on the wrong side of it."
        },
        {
          id: "r1c",
          label: "Open a hardware store with savings only. Smaller stock, no debt.",
          effects: { cash: -1500, income: 550 },
          outcome: "Half the shelves are empty and your neighbours think you are timid. You own every nail in the building."
        }
      ]
    },

    {
      id: "r2",
      date: "25 March 1929",
      asOfDate: "1929-03-25",
      headline: "FEDERAL RESERVE WARNS ON SPECULATION",
      situation: "The market drops sharply on the Fed's warning. Two days later National City Bank pumps $25 million of credit into the market and the panic evaporates. Everyone concludes the Fed can be safely ignored.",
      historicalNote: "A mini-crash occurred on 25 March 1929 after the Federal Reserve warned of excessive speculation, averted two days later when National City Bank injected $25 million. Over $8.5 billion of margin loans were outstanding, worth more than all currency circulating in the United States. [SOURCED]",
      choices: [
        {
          id: "r2a",
          label: "Buy on margin. Put $500 down, control $1,500 of stock.",
          effects: { cash: -500, debt: 1000, buy: { asset: "stock", amount: 1500 } },
          outcome: "Your broker shakes your hand. On paper you are already up eleven dollars by Friday."
        },
        {
          id: "r2b",
          label: "Buy $500 of stock. Cash only, no borrowing.",
          effects: { cash: -500, buy: { asset: "stock", amount: 500 } },
          outcome: "A modest position. Your broker suggests you are leaving money on the table."
        },
        {
          id: "r2c",
          label: "Ignore the market entirely. Hold your cash.",
          effects: {},
          outcome: "Nothing happens. Nothing happening will turn out to be a strategy."
        },
        {
          id: "r2d",
          label: "Put every spare dollar against your debt.",
          requires: { debt: true },
          effects: { cash: -400, debt: -400 },
          outcome: "Dull work. The number gets smaller."
        }
      ]
    },

    {
      id: "r3",
      date: "August 1929",
      asOfDate: "1929-08-31",
      headline: "STEEL AND MOTOR SALES SLIP",
      situation: "Something is wrong underneath. Steel production is down. Car sales are down. Housebuilding has stalled. The stock market, meanwhile, has gained twenty per cent since May and nobody is reading the production figures.",
      historicalNote: "A minor recession began in August 1929, two months before the crash. Steel production and automobile and house sales notably declined while construction stagnated. The Fed had raised rates from 4% to 6% to combat speculation. [SOURCED]",
      choices: [
        {
          id: "r3a",
          label: "Push harder while the good times last. Take on extra work, stock up on credit.",
          effects: { debt: 600, income: 200 },
          outcome: "The hours are long and the stockroom is full to the ceiling. Both feel like assets right now."
        },
        {
          id: "r3b",
          label: "Cut costs and bank the difference. Something feels off.",
          effects: { cash: 200, income: -50 },
          outcome: "You cannot explain the feeling to anyone, including yourself."
        },
        {
          id: "r3c",
          label: "The market is still climbing. Buy more.",
          effects: { cash: -400, buy: { asset: "stock", amount: 400 } },
          outcome: "Twenty per cent since May. Why would you not?"
        }
      ]
    },

    {
      id: "r4",
      date: "September - November 1929",
      asOfDate: "1929-11-30",
      headline: "BLACK TUESDAY",
      situation: "The Dow peaked at 381.17 on 3 September. London collapsed on the 20th when the Hatry group went down on fraud charges. On 24 October the market opened down eleven per cent. On the 29th it closed down twelve. There is a brief, convincing recovery on the 25th to the 27th. That window is your last clean exit.",
      historicalNote: "The Dow peaked at 381.17 on 3 September 1929 and would not regain that level until 23 November 1954. The London Stock Exchange crashed on 20 September after the Hatry Group collapse wiped out £24 million. There was a brief recovery 25-27 October. The market bottomed at 198.60 on 13 November. [SOURCED. The 260 bounce-window price referenced in the flavor text is invented and not mechanically applied.]",
      specialRule: "Source material resolved these choices at an intraday bounce price of 260, then revalued remaining holdings at the round-end price of 198.60. The six-key effects below cannot express a mid-round price override, so all choices are assumed to transact at the round's listed market price. This is a simplification — see ambiguities list.",
      choices: [
        {
          id: "r4a",
          label: "Sell everything into the bounce.",
          effects: { sell: { asset: "stock", fraction: 1 } },
          outcome: "Your broker tells you that you have panicked and will regret it. He will still be saying this in 1932, from a different job."
        },
        {
          id: "r4b",
          label: "Hold. This is a correction, not a collapse.",
          effects: {},
          outcome: "By 13 November your holding is worth roughly half what it was in September. Everyone respectable agrees this is temporary."
        },
        {
          id: "r4c",
          label: "Buy the dip. Borrow to do it.",
          effects: { debt: 1000, buy: { asset: "stock", amount: 1000 } },
          outcome: "You bought in believing the worst was over. It closed the round lower still. The broker's telegram arrives on a Tuesday."
        },
        {
          id: "r4d",
          label: "Sell half. Split the difference.",
          effects: { sell: { asset: "stock", fraction: 0.5 } },
          outcome: "Half your regret, half your relief. This is the choice most people actually made."
        }
      ]
    },

    {
      id: "r5",
      date: "17 April 1930",
      asOfDate: "1930-04-17",
      headline: "MARKET RECOVERS TO EARLY-1929 LEVELS",
      situation: "The Dow closes at 294.07. Back to where it was in January of last year. Economic forecasters are confidently predicting a rebound in 1931 and feel vindicated. The word being used everywhere is 'recovery'.",
      historicalNote: "The Dow reached a bear market rally peak of 294.07 on 17 April 1930, matching early-1929 levels but 30% below the September peak. Forecasters throughout 1930 optimistically predicted a rebound in 1931 and felt vindicated by the spring rally. 1930 saw GDP contract 8.5%, inflation of −6.4%, unemployment of 9%, and 1,350 bank failures. [SOURCED]",
      choices: [
        {
          id: "r5a",
          label: "Get back in. You have seen the bottom.",
          effects: { cash: -800, buy: { asset: "stock", amount: 800 } },
          outcome: "This is the single most expensive decision available in the entire game. It will not feel like it for another eighteen months."
        },
        {
          id: "r5b",
          label: "Sell into the rally. Take what you can get.",
          effects: { sell: { asset: "stock", fraction: 1 } },
          outcome: "You will spend two years being told you sold too early. You did not."
        },
        {
          id: "r5c",
          label: "Kill the debt. Everything spare, against the loan.",
          requires: { debt: true },
          effects: { cash: -1000, debt: -1000 },
          outcome: "Prices are falling at six per cent a year. Your debt is not. Every month you carry it, it gets heavier in real terms. You cannot see this happening. It is happening."
        },
        {
          id: "r5d",
          label: "Sit in cash and wait.",
          effects: {},
          outcome: "Prices fell 6.4% this year. Your dollars bought more in December than they did in January without you doing anything at all."
        }
      ]
    },

    {
      id: "r6",
      date: "17 June 1930",
      asOfDate: "1930-06-17",
      headline: "SMOOT-HAWLEY TARIFF SIGNED",
      situation: "Tariffs go up. Other countries respond in kind within months. Farm exports are the first to go, which strains every bank that lent to farmers, which is most of them.",
      historicalNote: "Exports fell from $5.2 billion in 1929 to $1.7 billion in 1933. Economists generally hold that Smoot-Hawley did not cause the Depression but worsened it and stunted recovery after 1933. Falling trade in manufactured goods led to layoffs and reduced corporate profits. [SOURCED]",
      choices: [
        {
          id: "r6a",
          label: "Move to safer, lower-paying ground before the export collapse hits.",
          effects: { income: -150, flags: ["income_protected"] },
          outcome: "Lower pay, and people note you as difficult or over-cautious. Either way, you are not the one holding the export line when it shuts."
        },
        {
          id: "r6b",
          label: "Stay exposed to the export trade. The money is good for now.",
          effects: { income: 150, flags: ["income_exposed"] },
          outcome: "The money is good this year."
        }
      ]
    },

    {
      id: "r7",
      date: "December 1930",
      asOfDate: "1930-12-31",
      headline: "BANK OF UNITED STATES CLOSES ITS DOORS",
      situation: "Caldwell and Company went down in November and took every small bank in Tennessee and Kentucky with it. Now the Bank of United States, the fourth largest in the country, has failed with $160 million of deposits inside it. There are queues in the street outside your own bank this morning.",
      historicalNote: "1,350 banks failed in 1930. Over 300 failed in December alone. The Bank of United States held over $160 million in deposits and its failure is widely considered the moment the banking collapse hit critical mass. There was no deposit insurance until 1933. [SOURCED]",
      specialRule: "Source material: the player's own bank fails at the end of this round. Any cash left \"on deposit\" (i.e. not withdrawn via the cash_at_home flag) is reduced by 60%. This depends on total current cash at round end, not a fixed per-choice number, so it cannot be expressed as a choice effect above — it needs custom end-of-round logic later.",
      choices: [
        {
          id: "r7a",
          label: "Queue up. Withdraw everything. Keep it in the house.",
          effects: { flags: ["cash_at_home"] },
          outcome: "You stand in the cold for four hours and walk home with your savings in a boot box. You feel foolish. Your bank closes on the 11th."
        },
        {
          id: "r7b",
          label: "Leave it. Your bank is sound and panic is what causes runs.",
          effects: { flags: ["deposits_exposed"] },
          outcome: "Your reasoning is correct in general and fatal in particular. There is no deposit insurance. That is three years away."
        },
        {
          id: "r7c",
          label: "Withdraw half.",
          effects: { flags: ["cash_at_home", "deposits_exposed_half"] },
          outcome: "You hedge. Hedging costs you sixty per cent of half."
        }
      ]
    },

    {
      id: "r8",
      date: "May - June 1931",
      asOfDate: "1931-06-30",
      headline: "CREDITANSTALT FAILS, EUROPE FOLLOWS",
      situation: "Austria's largest bank goes under and takes central Europe with it. In Chicago, banks that lent against real estate through the twenties are failing in rows. Prices are now falling more than nine per cent a year. The thing about a deflation is that doing nothing is a position.",
      historicalNote: "Creditanstalt represented 16% of Austria's GDP and became insolvent on 11 May 1931. Of 193 state-chartered banks in the Chicago area in 1929, only 35 survived to the end of 1933. 1931 saw 2,294 US bank failures, 28,285 business failures, unemployment at 16%, and inflation of −9.3%. [SOURCED]",
      choices: [
        {
          id: "r8a",
          label: "Convert savings to gold at $20.67 an ounce.",
          effects: { buy: { asset: "gold", fraction: 0.6 } },
          outcome: "Gold does not go up. It simply does not go down while everything else does. That turns out to be enough. For eighteen months."
        },
        {
          id: "r8b",
          label: "Do nothing. Hold cash.",
          effects: {},
          outcome: "Your money bought nine per cent more this year than last. You did nothing to earn that. It is the best return available in the country."
        },
        {
          id: "r8c",
          label: "Buy stocks. They cannot go much lower.",
          effects: { cash: -500, buy: { asset: "stock", amount: 500 } },
          outcome: "They can. They will go to 41."
        }
      ]
    },

    {
      id: "r9",
      date: "21 September 1931",
      asOfDate: "1931-09-21",
      headline: "BRITAIN ABANDONS THE GOLD STANDARD",
      situation: "Sterling falls twenty-five per cent overnight. Everyone predicted catastrophe. Instead British exports get cheaper, the Bank of England cuts rates from six per cent to two, and Britain begins to recover. The Federal Reserve, defending the dollar's gold peg, does the exact opposite and raises rates from 1.5% to 3.5%.",
      historicalNote: "Britain left the gold standard on 21 September 1931. The Bank of England cut rates from 6.00% to 2.00%. Norway, Sweden, Denmark and Finland followed within weeks and all recovered earlier than countries that stayed on gold. The Fed raised from 1.50% to 3.50% to maintain the gold standard, worsening the Depression. As deflation intensified, real interest rates were magnified and rewarded those who held money. [SOURCED]",
      choices: [
        {
          id: "r9a",
          label: "Buy more gold. The dollar is next.",
          effects: { buy: { asset: "gold", fraction: 0.5 } },
          outcome: "A reasonable inference. Note it for 1933."
        },
        {
          id: "r9b",
          label: "Hold dollars and wait.",
          effects: { flags: ["deflation_beneficiary"] },
          outcome: "The Fed just raised rates into a depression to protect the gold peg. Every month of that policy makes your cash worth more and every debtor in America poorer. You are on the right side of it by accident."
        },
        {
          id: "r9c",
          label: "Borrow while rates are still low and buy assets.",
          effects: { debt: 800, cash: 800 },
          outcome: "Rates just went from 1.50% to 3.50% and prices are falling nine per cent a year. Your real interest rate is somewhere near thirteen per cent. Nobody uses that phrase yet."
        }
      ]
    },

    {
      id: "r10",
      date: "8 July 1932",
      asOfDate: "1932-07-08",
      headline: "DOW CLOSES AT 41.22",
      situation: "Eighty-nine per cent below the September 1929 peak. One in four Americans is out of work. Two million are homeless. Industrial production is half what it was in 1929. Taxes have just gone up.",
      historicalNote: "The Dow bottomed at 41.22 on 8 July 1932, an 89% loss from the 1929 peak and the lowest level recorded in the 20th century. Unemployment peaked at 25%. Two million were homeless. The Revenue Act of 1932 raised personal, corporate and sales taxes on 6 June. US nominal GDP bottomed at $57 billion, down from $105 billion in 1929. [SOURCED]",
      specialRule: "Source material: if the player carries the income_exposed flag from round 6, their income drops to 0 this round regardless of choice. If they carry income_protected, income continues unaffected. This depends on a flag set eight rounds earlier, not on this round's choice, so it cannot be expressed as a choice effect above — it needs custom logic later.",
      choices: [
        {
          id: "r10a",
          label: "Buy stocks at the bottom. Everything you have.",
          effects: { cash: -1200, buy: { asset: "stock", amount: 1200 } },
          outcome: "This is the correct move and almost nobody made it, because almost nobody had cash left. Whether you can make it now was decided in 1929."
        },
        {
          id: "r10b",
          label: "Cut everything to the bone and survive the year.",
          effects: { income: 100 },
          outcome: "You eat worse and heat one room. You are still standing, which puts you ahead of twenty-eight thousand businesses that failed last year."
        },
        {
          id: "r10c",
          label: "Take whatever work or relief is going, and sell off what you can.",
          effects: { cash: 200, income: 150, flags: ["making_do"] },
          outcome: "It is not what you pictured doing five years ago. It is money coming in, which very little is."
        }
      ]
    },

    {
      id: "r11",
      date: "February - April 1933",
      asOfDate: "1933-04-30",
      headline: "THE BANKS ARE SHUT",
      situation: "Michigan declares a bank holiday on 14 February. Within three weeks thirty-eight states have followed. On 6 March all banking in the country stops for a week. When it reopens, four thousand banks with $3.6 billion of deposits are simply gone forever. Then on 5 April the President makes private gold holding illegal.",
      historicalNote: "Michigan declared the first indefinite bank holiday on 14 February 1933. By 6 March, 38 states had followed and Executive Order 2009 suspended all banking for a week. The Emergency Banking Act of 9 March closed over 4,000 irreparably insolvent banks holding $3.6 billion in deposits, while banks controlling 90% of activity reopened by 15 March. Executive Order 6102 forbade hoarding of gold coin, bullion and certificates from 1 May 1933. [SOURCED]",
      choices: [
        {
          id: "r11a",
          label: "Surrender your gold as required. Take the $20.67.",
          requires: { gold: true },
          effects: { sell: { asset: "gold", fraction: 1 } },
          outcome: "The safe haven was safe from the market and not from the government. This is the lesson the round exists to teach: private prudence has a ceiling set by policy."
        },
        {
          id: "r11b",
          label: "Keep it hidden. Say nothing.",
          requires: { gold: true },
          effects: { flags: ["gold_hidden"] },
          outcome: "It is in the coal cellar. You cannot spend it, deposit it, or borrow against it. It is worth exactly nothing until 1975."
        },
        {
          id: "r11c",
          label: "Redeposit your boot-box cash now that the banks are guaranteed.",
          requires: { flag: "cash_at_home" },
          effects: { flags: ["redeposited"] },
          outcome: "Over $1.1 billion in hoarded cash went back into the banking system by the end of March. Yours was part of it. The credit machine starts turning again."
        },
        {
          id: "r11d",
          label: "Wait. You have been wrong about safety before.",
          effects: {},
          outcome: "Reasonable. It also means you miss the first leg of the recovery."
        }
      ]
    },

    {
      id: "r12",
      date: "December 1933",
      asOfDate: "1933-12-31",
      headline: "PRODUCTION UP 57 PER CENT SINCE MARCH",
      situation: "Industrial production has climbed from 54.3 in March to 85.5 in July. Deposit insurance now exists. Investment banking has been split from commercial banking. Four million people are working for the Civil Works Administration. Prohibition ended three weeks ago.",
      historicalNote: "The Federal Reserve industrial production index rebounded to 85.5 in July 1933, a 57% increase over March's 54.3. The 1933 Banking Act of 16 June created the FDIC and separated commercial from investment banking under Glass-Steagall. The Civil Works Administration created 8 November employed over 4 million people. Prohibition was repealed nationally on 5 December. Inflation turned positive at 1%. [SOURCED]",
      isEnding: true,
      choices: []
    }
  ],

  endings: [
    {
      id: "ruined",
      trigger: "Margin call fired at any point, or final net worth below zero.",
      title: "WIPED OUT",
      text: "You were not unlucky. You were leveraged. Debt is a fixed number in a world where every other number was falling, and that arithmetic beat you before you understood you were in a fight."
    },
    {
      id: "survived_poorer",
      trigger: "Final real net worth below starting real net worth, but positive.",
      title: "STILL HERE",
      text: "You lost money and kept your feet. Between 1929 and 1933 roughly nine thousand banks failed and a quarter of the country was out of work. Still being here was the median good outcome."
    },
    {
      id: "preserved",
      trigger: "Final real net worth within 20% of starting real net worth, no debt.",
      title: "INTACT",
      text: "You did nothing clever. You avoided debt, you got out of the banks, and you sat in cash while prices fell around you. Your dollars bought roughly a third more in 1933 than in 1929. Doing nothing, correctly, was the highest-return strategy available in America."
    },
    {
      id: "thrived",
      trigger: "Final real net worth above 150% of starting, requires cash held through 1932 and a purchase at or near the bottom.",
      title: "ON THE OTHER SIDE",
      text: "You bought at 41.22 because you still had cash at 41.22, and you still had cash because of a decision you made in October 1929. The bottom was not the hard part. Arriving at it solvent was."
    }
  ]
};
