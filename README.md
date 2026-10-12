# LimJH's Game Box

A compendium of small browser minigames, hosted on GitHub Pages at
`https://<your-username>.github.io/limjh-game-box/`.

## Project structure

```
index.html          Landing page
css/style.css       Styles (light/dark adaptive)
js/games.js         Game registry (the list shown on the landing page)
js/main.js          Renders the game cards
games/<id>/         One folder per game, each with its own index.html
.github/workflows/  GitHub Pages deployment
```

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Adding a game

1. Create `games/<id>/index.html` (plus any assets it needs).
2. Add an entry to `window.GAMES` in `js/games.js`:

   ```js
   { id: "snake", title: "Snake", description: "Eat, grow, don't bite yourself.", path: "games/snake/", emoji: "🐍" }
   ```

Use **relative paths** everywhere (no leading `/`), since the site is served
from the `/limjh-game-box/` sub-path rather than the domain root.

While the registry is empty, the landing page shows "Coming soon" placeholder cards.

## Deployment

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`.

One-time setup: in the repository, go to **Settings → Pages** and set
**Source** to **GitHub Actions**.
