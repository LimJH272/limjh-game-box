# LimJH's Game Box

A compendium of small browser minigames, hosted on GitHub Pages.

[Play them now!](https://limjh272.github.io/limjh-game-box/)

## Games

| Game | Description |
| --- | --- |
| GSSTHWRDS ([code](games/gssthwrds/) \| [play](https://limjh272.github.io/limjh-game-box/games/gssthwrds/)) | Guess words and phrases from their consonants alone. Party mode (self-scored) or Solo mode (type your guess). See the [game docs](games/gssthwrds/README.md). |

## Project structure

```
index.html          Landing page
css/style.css       Styles (light/dark adaptive)
js/games.js         Game registry (the list shown on the landing page)
js/main.js          Renders the game cards
games/<id>/         One folder per game, each with its own index.html and README.md
.github/workflows/  GitHub Pages deployment
```

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Adding a game

1. Create `games/<id>/index.html` (plus any assets it needs) and a `README.md`
   documenting how to play and how the code is organised.
2. Add an entry to `window.GAMES` in `js/games.js`:

   ```js
   { id: "snake", title: "Snake", description: "Eat, grow, don't bite yourself.", path: "games/snake/", emoji: "🐍", updated: "2026-10-13" }
   ```

Use **relative paths** everywhere (no leading `/`), since the site is served
from the `/limjh-game-box/` sub-path rather than the domain root.

`updated` (YYYY-MM-DD) is shown in the top-right corner of the card as "Updated 13 Oct 2026". Bump it whenever you change the game.

The landing page always shows two "Coming soon" placeholder cards after the real games.

## Deployment

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`.

One-time setup: in the repository, go to **Settings → Pages** and set
**Source** to **GitHub Actions**.

## Acknowledgement

The code for this game is mostly written by Claude Code with few manual edits.
