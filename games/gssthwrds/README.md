# GSSTHWRDS

*"Guess the words"*, with the vowels taken out.

Someone enters a list of words or phrases. The game strips out spaces,
punctuation and vowels, then shows what's left one at a time. Players try to
work out the original from the consonants alone.

```
Banana split   →   BNNSPLT
Guess the words →  GSSTHWRDS
```

Play it at `/limjh-game-box/games/gssthwrds/`, or from the Game Box landing page.

---

## How to play

### 1. Set up

1. **Pick a mode.** Use *Party* or *Solo* (see [Modes](#modes)). Each mode card has a
   **How to play** link that opens a step-by-step tutorial.
2. **Category (optional).** Add a short theme such as "Movies". If you fill it
   in, it's shown above the tiles during the game and on the results screen.
3. **Enter words or phrases, one per line.** Blank lines are ignored.
4. Press **Play**.

The words, category and mode are remembered in that browser for next time.

### 2. Play

Each line is shown as letter tiles, one line per screen.

| Area | What it does |
| --- | --- |
| Top left | Position: "Word 2 of 5". |
| Top middle | Score: correct guesses out of the total. |
| Top right ✕ | Exit to setup. Once you've taken a hint or revealed a word, an in-game popup asks you to confirm. |
| **Back** (bottom left) | Go to the previous word. Disabled on the first word. |
| **Hint** (bottom middle) | Show the next hint. The label counts usage, e.g. "Hint (1/3)". Disabled when hints run out or the word is revealed. |
| **Reveal / Next** (bottom right) | Shows **Reveal** until the word is revealed, then **Next**. Next on the last word opens the results. |

Every word remembers its own state: hints used, whether it's revealed, and
whether it was scored correct. Going **Back** shows each word exactly as you
left it.

### 3. Results

The final score, plus every word with ✓ or ✗ and its consonant version.

- **Play again:** same words, same mode, fresh state. The vowels filled in by
  hint 3 are re-picked at random.
- **Restart:** back to setup with your words kept, so you can edit them.

---

## Rules

### Turning a line into a puzzle

- Accents are stripped (`Éclair` → `ECLAIR`), then everything is uppercased.
- Spaces and punctuation are removed. Letters and digits are kept.
- Vowels are **A, E, I, O, U**. **Y is a consonant.**
- The puzzle is every letter and digit that isn't a vowel, in order.

### Which lines are allowed

Each line needs **at least one vowel and at least one consonant letter**.
Digits and symbols don't count towards either.

| Line | Allowed? | Why |
| --- | --- | --- |
| `Banana split`, `Catch-22`, `Route 66` | ✅ | Has vowels and consonants |
| `Rhythm`, `BCD123`, `Y2K` | ❌ | No vowels |
| `AEIOU`, `A1`, `AEI 2024` | ❌ | No consonant letters |
| `42`, `!!!` | ❌ | No letters at all |

Invalid lines are highlighted in red inside the text box. A message under the
box counts them, and **Play** stays disabled until they're fixed.

### Hints

Hints are revealed in order:

| # | Hint | Example (`Guess the words`) |
| --- | --- | --- |
| 1 | Number of vowels | "4 vowels" |
| 2 | Vowel spots: dashed empty tiles appear where the vowels go | `G__SSTH_W_RDS` |
| 3 | Half the vowels (rounded down, picked at random) are filled in, **and** the tiles are split into words where the spaces were | `G_ESS THE W_RDS` |

- A line with **one vowel** gets only hints 1 and 2, so its spaces are never shown.
- Lines with **two or more vowels** get all three hints.
- Only real spaces split words. Hyphens and other punctuation don't, so `Banana-split` is one word.
- The random pick for hint 3 is made once per word when the game starts, so it stays the same as you move back and forth.

### Scoring

Your score is the number of words marked correct, out of the total number of
words. How a word gets marked correct depends on the mode.

---

## Modes

### Party

For a group. One host enters the words, then everyone guesses out loud.

- Tap **Reveal** to show the answer. There's no confirmation in this mode.
- After revealing, tap **✓ Got it** or **✗ Missed**. Only "Got it" scores.
- A mark can be changed later by going **Back** to that word.

### Solo

For one player, with someone else entering the words.

- Type a guess and press **Enter** or **Guess**. Capitals, spaces and punctuation
  are ignored, so `guess the words` matches `Guess the words!`.
- **Correct guess:** reveals the answer and scores a point.
- **Wrong guess:** the box shakes, your guess stays in it, and you **automatically get the next hint**.
- **Wrong guess with every hint already showing:** reveals the answer and counts as a **miss**.
  This includes hints you took yourself with the Hint button.
- **Reveal** asks *"Are you sure?"* first, because revealing counts as a miss.
  The popup doesn't appear when the answer is revealed automatically after you run out of hints.

---

## For developers

Plain HTML, CSS and JavaScript, with no build step and no dependencies apart
from Google Fonts.

### Files

```
games/gssthwrds/
├── index.html   Markup for all three screens (setup, game, results) and the dialogs
├── style.css    Game-specific styles; builds on the shared tokens in ../../css/style.css
├── game.js      All game logic (a single IIFE, no globals)
└── README.md    This file
```

The game is registered on the landing page in `js/games.js`.

### Screens and dialogs

All three screens are `<section>`s in `index.html`. Only one is visible at a time,
switched by `show(name)`.

| Element | Purpose |
| --- | --- |
| `#setup` | Rules, mode picker, category, word list, Play |
| `#game` | Top bar, tiles, hints, answer, Solo guess box, Party marker, controls |
| `#results` | Final score, category, per-word summary, Play again / Restart |
| `#tutorial-party`, `#tutorial-solo` | "How to play" dialogs |
| `#confirm-reveal` | Solo "Are you sure?" before a manual reveal |
| `#confirm-exit` | "Quit this game?" when exiting with progress |

Dialogs use the native `<dialog>` element with `showModal()`. Any element with
`data-close` closes its dialog, and so does a click on the dimmed backdrop or Esc.

### State

`startGame()` turns each line into a round object with `makeRound(line)`:

```js
{
  original: "Guess the words!",   // the line as typed (trimmed)
  chars: ["G","U","E","S", ...],  // letters/digits only, uppercased, accents stripped
  vowelCount: 4,
  shownVowels: [2, 7],            // indexes into chars filled in by hint 3 (random, fixed per game)
  wordLengths: [5, 3, 5],         // letters per space-separated word, used to split tiles at hint 3
  hintCount: 3,                   // 2 if exactly one vowel, else 3
  hintsUsed: 0,
  revealed: false,
  correct: false
}
// Party mode also adds markedMiss: true/false the first time a word is marked.
```

`rounds` (an array of these), `index` (the current word), `mode` and `category`
are the whole game state. `render()` redraws the game screen from that state,
so every action just updates a round and calls `render()`.

`renderTiles()` only rebuilds the tiles when what they show changes (keyed on
word index, revealed and hints used). That keeps the pop-in animation from
replaying on every click.

### Key functions

| Function | What it does |
| --- | --- |
| `letters(text)` | Normalises a line: strips accents, uppercases, keeps only `\p{L}` / `\p{N}` |
| `isInvalid(line)` | True if the line has no vowels or no consonant letters |
| `highlightInvalid()` / `syncBackdrop()` | Draws the red highlight behind the textarea (see below) |
| `makeRound(line)` | Builds a round object |
| `giveHint()`, `reveal()`, `revealOrNext()`, `goBack()` | Bottom-bar actions |
| `submitGuess()` | Solo: checks the guess, auto-hints on a miss, auto-reveals when out of hints |
| `mark(correct)` | Party: Got it / Missed |
| `exitGame()` / `quitGame()` | ✕ button, with confirmation if there's progress |
| `showResults()` | Builds the results screen |

### Highlighting invalid lines

A `<textarea>` can't style individual lines. Instead, a `#words-backdrop` div
sits behind a transparent textarea. It mirrors the text (in transparent ink),
with each invalid line wrapped in a `<mark>`. `syncBackdrop()` keeps its size
and scroll position matched to the textarea's content box on input, scroll and
resize. If you change the textarea's font, padding or line height, change
`.words-backdrop` to match. They share one rule in `style.css`.

### Storage

The setup is saved to `localStorage` under the key `gssthwrds:setup` as
`{ words, category, mode }`. Game progress isn't saved, so reloading mid-game
returns to setup. All storage access is wrapped in `try/catch`, so the game
still works in private browsing or with storage blocked.

### Caching

`index.html` loads `style.css`, `game.js` and the shared stylesheet with a
`?v=N` query string. **Bump `N` whenever you change those files**, or browsers
may keep using cached copies for a while after a deploy.

### Testing changes

Serve the repository's parent folder so the site sits under the same sub-path
it has on GitHub Pages, then open the game:

```sh
cd ..   # the folder containing limjh-game-box/
python3 -m http.server 8000
# http://localhost:8000/limjh-game-box/games/gssthwrds/
```

Things worth checking after a change:

- Invalid lines are highlighted and block Play: `Rhythm`, `AEIOU`, `A1`, `!!!`.
- The hint sequence for a multi-word line, e.g. `Guess the words`, ends with spaces shown at hint 3.
- A one-vowel line, e.g. `Plum`, offers only 2 hints.
- Going Back keeps each word's hints, reveal and mark.
- Solo: wrong guesses add hints, then auto-reveal as a miss. Reveal asks for confirmation.
- Party: Reveal has no popup, and Got it / Missed updates the score.
- ✕ asks for confirmation only once you've made progress.
- Phone width (~375px) and dark mode.

## Acknowledgement

This game is inspired by short-form video content on Facebook/Instagram. I will link to a few examples once I find them again.

The code for this game is mostly written by Claude Code with few manual edits.