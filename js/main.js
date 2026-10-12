(function () {
  "use strict";

  var PLACEHOLDER_COUNT = 3;
  var grid = document.getElementById("game-grid");
  var games = Array.isArray(window.GAMES) ? window.GAMES : [];

  document.getElementById("year").textContent = new Date().getFullYear();

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function gameCard(game) {
    var li = el("li");
    var link = el("a", "card");
    link.href = game.path;
    link.appendChild(el("span", "card-icon", game.emoji || "🎲"));
    link.appendChild(el("h3", "card-title", game.title));
    if (game.description) link.appendChild(el("p", "card-desc", game.description));
    li.appendChild(link);
    return li;
  }

  function placeholderCard() {
    var li = el("li");
    var card = el("div", "card card--placeholder");
    card.setAttribute("aria-hidden", "true");
    card.appendChild(el("span", "card-icon", "?"));
    card.appendChild(el("h3", "card-title", "Coming soon"));
    card.appendChild(el("p", "card-desc", "A new game is on its way."));
    li.appendChild(card);
    return li;
  }

  games.forEach(function (game) {
    grid.appendChild(gameCard(game));
  });

  if (games.length === 0) {
    for (var i = 0; i < PLACEHOLDER_COUNT; i++) grid.appendChild(placeholderCard());
    var note = el("p", "empty-note", "No games yet — check back soon!");
    grid.parentNode.insertBefore(note, grid);
  }
})();
