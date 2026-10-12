// Registry of games shown on the landing page.
// To add a game, put it in games/<id>/index.html and add an entry here:
//
//   {
//     id: "snake",
//     title: "Snake",
//     description: "Eat, grow, don't bite yourself.",
//     path: "games/snake/",
//     emoji: "🐍",
//     updated: "2026-10-13"   // YYYY-MM-DD, shown on the card; bump it when you change the game
//   }
//
// Paths must be relative (no leading slash) so the site works under /limjh-game-box/.
window.GAMES = [
  {
    id: "gssthwrds",
    title: "GSSTHWRDS",
    description: "Guess the words from their consonants alone.",
    path: "games/gssthwrds/",
    emoji: "🔤",
    updated: "2026-10-13"
  }
];
