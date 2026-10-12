(function () {
  "use strict";

  var PLACEHOLDER_COUNT = 2;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var grid = document.getElementById("game-grid");
  var games = Array.isArray(window.GAMES) ? window.GAMES : [];

  document.getElementById("year").textContent = new Date().getFullYear();

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // "2026-10-13" -> "13 Oct 2026". Parsed by hand so the date never shifts with the viewer's time zone.
  function formatDate(iso) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!parts) return "";
    return Number(parts[3]) + " " + MONTHS[Number(parts[2]) - 1] + " " + parts[1];
  }

  function gameCard(game) {
    var li = el("li");
    var link = el("a", "card");
    link.href = game.path;
    var updated = formatDate(game.updated);
    if (updated) {
      var time = el("time", "card-updated", "Updated " + updated);
      time.dateTime = game.updated;
      link.appendChild(time);
    }
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

  for (var i = 0; i < PLACEHOLDER_COUNT; i++) grid.appendChild(placeholderCard());
})();
