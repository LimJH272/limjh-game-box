(function () {
  "use strict";

  var STORAGE_KEY = "gssthwrds:setup";
  var VOWELS = "AEIOU";

  var $ = function (id) { return document.getElementById(id); };
  var screens = { setup: $("setup"), game: $("game"), results: $("results") };

  var wordsInput = $("words");
  var playBtn = $("play");

  var mode = "party";
  var rounds = [];
  var index = 0;

  // ---------- Text processing ----------

  // Uppercase, strip accents, and keep only letters and digits.
  function letters(text) {
    return text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toUpperCase()
      .replace(/[^\p{L}\p{N}]/gu, "");
  }

  function isVowel(ch) {
    return VOWELS.indexOf(ch) !== -1;
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  function makeRound(line) {
    var chars = letters(line).split("");
    var vowelSlots = [];
    chars.forEach(function (ch, i) { if (isVowel(ch)) vowelSlots.push(i); });

    // Pick the half of the vowels that hint 3 will show, once, so it stays stable.
    var shown = shuffle(vowelSlots.slice()).slice(0, Math.floor(vowelSlots.length / 2));

    var hintCount = vowelSlots.length === 0 ? 1 : vowelSlots.length === 1 ? 2 : 3;

    return {
      original: line,
      chars: chars,
      vowelCount: vowelSlots.length,
      shownVowels: shown,
      hintCount: hintCount,
      hintsUsed: 0,
      revealed: false,
      correct: false
    };
  }

  function lines() {
    return wordsInput.value
      .split("\n")
      .map(function (l) { return l.trim(); })
      .filter(function (l) { return letters(l).length > 0; });
  }

  // ---------- Setup ----------

  function selectedMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function saveSetup() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ words: wordsInput.value, mode: selectedMode() }));
    } catch (e) { /* storage unavailable */ }
  }

  function loadSetup() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved) return;
      wordsInput.value = saved.words || "";
      var radio = document.querySelector('input[name="mode"][value="' + saved.mode + '"]');
      if (radio) radio.checked = true;
    } catch (e) { /* storage unavailable */ }
  }

  function updatePlayButton() {
    playBtn.disabled = lines().length === 0;
  }

  function show(name) {
    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== name; });
    window.scrollTo(0, 0);
  }

  function startGame() {
    mode = selectedMode();
    rounds = lines().map(makeRound);
    if (rounds.length === 0) return;
    index = 0;
    $("tiles").dataset.key = "";
    saveSetup();
    show("game");
    render();
  }

  // ---------- Game ----------

  function score() {
    return rounds.filter(function (r) { return r.correct; }).length;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderTiles(round) {
    var tiles = $("tiles");
    var showSlots = round.revealed || round.hintsUsed >= 2;

    // Only rebuild when what's shown changes, so tiles don't re-animate on every click.
    var key = index + ":" + round.revealed + ":" + Math.min(round.hintsUsed, 3);
    if (tiles.dataset.key === key) return;
    tiles.dataset.key = key;
    tiles.textContent = "";

    var visible = round.chars.filter(function (ch) { return showSlots || !isVowel(ch); });
    tiles.style.setProperty("--count", Math.max(visible.length, 4));

    if (visible.length === 0) {
      tiles.appendChild(el("span", "tiles-empty", "No consonants!"));
      return;
    }

    round.chars.forEach(function (ch, i) {
      if (!isVowel(ch)) {
        tiles.appendChild(el("span", "tile", ch));
      } else if (round.revealed) {
        tiles.appendChild(el("span", "tile tile-vowel", ch));
      } else if (showSlots) {
        var filled = round.hintsUsed >= 3 && round.shownVowels.indexOf(i) !== -1;
        tiles.appendChild(el("span", filled ? "tile tile-vowel" : "tile tile-slot", filled ? ch : ""));
      }
    });
  }

  function renderHints(round) {
    var list = $("hints");
    list.textContent = "";
    if (round.hintsUsed >= 1) {
      var n = round.vowelCount;
      list.appendChild(el("li", null, n + (n === 1 ? " vowel" : " vowels")));
    }
    if (round.hintsUsed >= 2) list.appendChild(el("li", null, "Vowel spots shown"));
    if (round.hintsUsed >= 3) list.appendChild(el("li", null, round.shownVowels.length + " of " + round.vowelCount + " vowels filled in"));
  }

  function render() {
    var round = rounds[index];

    $("score").textContent = score();
    $("total").textContent = rounds.length;
    $("position").textContent = "Word " + (index + 1) + " of " + rounds.length;

    renderTiles(round);
    renderHints(round);

    var answer = $("answer");
    answer.hidden = !round.revealed;
    answer.textContent = round.original;

    var guessForm = $("guess-form");
    guessForm.hidden = mode !== "solo" || round.revealed;
    $("guess").value = "";
    $("guess").classList.remove("wrong");

    var marker = $("marker");
    marker.hidden = mode !== "party" || !round.revealed;
    $("mark-yes").setAttribute("aria-pressed", String(round.revealed && round.correct));
    $("mark-no").setAttribute("aria-pressed", String(round.revealed && round.markedMiss === true));

    $("back").disabled = index === 0;

    var hintBtn = $("hint");
    var hintsLeft = round.hintCount - round.hintsUsed;
    hintBtn.disabled = round.revealed || hintsLeft === 0;
    hintBtn.textContent = "Hint (" + round.hintsUsed + "/" + round.hintCount + ")";

    $("reveal").textContent = round.revealed ? "Next" : "Reveal";
  }

  function giveHint() {
    var round = rounds[index];
    if (round.revealed || round.hintsUsed >= round.hintCount) return;
    round.hintsUsed++;
    render();
  }

  function revealOrNext() {
    var round = rounds[index];
    if (!round.revealed) {
      round.revealed = true;
      render();
      return;
    }
    if (index < rounds.length - 1) {
      index++;
      render();
      if (mode === "solo" && !rounds[index].revealed) $("guess").focus();
    } else {
      showResults();
    }
  }

  function goBack() {
    if (index === 0) return;
    index--;
    render();
  }

  function submitGuess(event) {
    event.preventDefault();
    var round = rounds[index];
    var input = $("guess");
    var guess = letters(input.value);
    if (!guess) return;

    if (guess === round.chars.join("")) {
      round.correct = true;
      round.revealed = true;
      render();
    } else {
      input.classList.remove("wrong");
      void input.offsetWidth; // restart the shake animation
      input.classList.add("wrong");
      input.select();
    }
  }

  function mark(correct) {
    var round = rounds[index];
    round.correct = correct;
    round.markedMiss = !correct;
    render();
  }

  function exitGame() {
    var started = rounds.some(function (r) { return r.revealed || r.hintsUsed > 0; });
    if (started && !window.confirm("Quit this game? Your progress will be lost.")) return;
    show("setup");
  }

  // ---------- Results ----------

  function showResults() {
    $("final-score").textContent = score();
    $("final-total").textContent = rounds.length;

    var summary = $("summary");
    summary.textContent = "";
    rounds.forEach(function (round) {
      var item = el("li", round.correct ? "is-correct" : "is-missed");
      item.appendChild(el("span", "summary-mark", round.correct ? "✓" : "✗"));
      item.appendChild(el("span", "summary-word", round.original));
      item.appendChild(el("span", "summary-clue", round.chars.filter(function (c) { return !isVowel(c); }).join("")));
      summary.appendChild(item);
    });

    show("results");
  }

  // ---------- Wiring ----------

  loadSetup();
  updatePlayButton();

  wordsInput.addEventListener("input", function () { updatePlayButton(); saveSetup(); });
  document.querySelectorAll('input[name="mode"]').forEach(function (radio) {
    radio.addEventListener("change", saveSetup);
  });

  playBtn.addEventListener("click", startGame);
  $("hint").addEventListener("click", giveHint);
  $("reveal").addEventListener("click", revealOrNext);
  $("back").addEventListener("click", goBack);
  $("exit").addEventListener("click", exitGame);
  $("guess-form").addEventListener("submit", submitGuess);
  $("mark-yes").addEventListener("click", function () { mark(true); });
  $("mark-no").addEventListener("click", function () { mark(false); });
  $("again").addEventListener("click", startGame);
  $("edit").addEventListener("click", function () { show("setup"); wordsInput.focus(); });
})();
