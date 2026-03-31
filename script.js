/* ═══════════════════════════════════════════════════════════════
   IMPOSTER WORD — script.js
   ─────────────────────────────────────────────────────────────
   Structure:
     1. Word / hint data pool (Easy / Medium / Hard)
     2. Game state object
     3. Utility helpers
     4. Lobby (player entry, difficulty selection)
     5. Round setup (imposter assignment, word assignment)
     6. Reveal flow (per-player word/hint display)
     7. Voting flow (per-player ballot)
     8. Scoring & result screen
     9. Leaderboard screen
    10. Screen navigation helper
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   1. WORD / HINT DATA POOL
   ─────────────────────────────────────────────────────────────
   Structure:
     WORDS[difficulty] = [
       { word: "...", hints: ["...", "...", "..."] },
       ...
     ]
   Hints should be related to the word but NOT obvious.
   The imposter sees only ONE randomly chosen hint.
   Add more entries to each array (up to 100) as desired.
═══════════════════════════════════════════════════════════════ */
const WORDS = {

  easy: [
    { word: "PIZZA",      hints: ["It comes in slices", "Italy gave it to the world", "Delivery in 30 minutes"] },
    { word: "BEACH",      hints: ["Sandcastles are built here", "Seagulls steal your lunch", "You need sunscreen here"] },
    { word: "GUITAR",     hints: ["Six strings usually", "You strum it", "Used in rock bands"] },
    { word: "CHOCOLATE",  hints: ["Comes from cacao beans", "Valentine's Day staple", "Melts at body temperature"] },
    { word: "FOOTBALL",   hints: ["11 players per team", "Goals are the aim", "World Cup every 4 years"] },
    { word: "SWIMMING",   hints: ["Chlorine is involved", "Front crawl is a technique", "Lifeguards watch over it"] },
    { word: "BIRTHDAY",   hints: ["Candles are blown out", "It happens once a year", "Gifts are common"] },
    { word: "JUNGLE",     hints: ["Dense vegetation", "Jaguars roam here", "Tarzan's home"] },
    { word: "RAINBOW",    hints: ["Appears after rain", "Seven colours", "Pot of gold legend"] },
    { word: "LIBRARY",    hints: ["Silence is golden here", "Books are borrowed", "Librarians work here"] },
    { word: "VOLCANO",    hints: ["Lava flows from it", "Can be dormant", "Found on tectonic boundaries"] },
    { word: "PENGUIN",    hints: ["Flightless bird", "Tuxedo appearance", "Lives in the Antarctic"] },
    { word: "CIRCUS",     hints: ["Big top tent", "Acrobats perform here", "Clowns are common"] },
    { word: "TREASURE",   hints: ["Pirates seek it", "Buried in chests", "X marks the spot"] },
    { word: "CASTLE",     hints: ["Drawbridge and moat", "Knights lived here", "Turrets on top"] },
    { word: "CAMERA",     hints: ["Captures moments", "Lens is key", "Shutter clicks"] },
    { word: "FIREWORKS",  hints: ["Gunpowder lights the sky", "New Year's Eve tradition", "Colourful explosions"] },
    { word: "DINOSAUR",   hints: ["Extinct reptiles", "Jurassic era", "Palaeontologists study them"] },
    { word: "CONCERT",    hints: ["Live music event", "Stage and lights", "Crowd cheering"] },
    { word: "MIRROR",     hints: ["Reflects your image", "Snow White villain used one", "Made of glass and silver"] },
  ],

  medium: [
    { word: "SARCASM",    hints: ["Tone matters most", "Can seem sincere", "A form of irony"] },
    { word: "MARATHON",   hints: ["26.2 miles exactly", "Pheidippides ran the first", "Requires months of prep"] },
    { word: "TATTOO",     hints: ["Permanent ink on skin", "Needles are involved", "Parlours specialise in it"] },
    { word: "PASSPORT",   hints: ["Borders need it", "Stamped when you travel", "Issued by governments"] },
    { word: "AUCTION",    hints: ["Highest bidder wins", "Gavels are used", "Christie's is famous for it"] },
    { word: "COMPASS",    hints: ["Points to magnetic north", "Sailors rely on it", "Needle floats on liquid"] },
    { word: "ECLIPSE",    hints: ["Moon blocks the sun", "Rare celestial event", "Totality lasts seconds"] },
    { word: "RIDDLE",     hints: ["Answer is hidden in words", "Sphinx asked one", "Tests lateral thinking"] },
    { word: "BALLOT",     hints: ["Used in elections", "Secret by design", "Paper or electronic"] },
    { word: "MIRAGE",     hints: ["Appears in deserts", "Water that isn't there", "Heat causes it"] },
    { word: "ALIBI",      hints: ["Proves you were elsewhere", "Crime dramas use it", "Witnesses confirm it"] },
    { word: "CAPSULE",    hints: ["Time capsules are buried", "Can hold a pill", "Sometimes sent to space"] },
    { word: "SABOTAGE",   hints: ["Deliberate damage", "Wrenches in machinery", "War tactic"] },
    { word: "VERDICT",    hints: ["Jury delivers it", "Guilty or not guilty", "End of a trial"] },
    { word: "CURRENCY",   hints: ["Coins and notes", "Exchange rates apply", "Each country has its own"] },
    { word: "BANQUET",    hints: ["Grand feast", "Long tables of food", "Royalty once held them"] },
    { word: "ILLUSION",   hints: ["Tricks the mind", "Magicians create them", "Reality vs perception"] },
    { word: "CURFEW",     hints: ["Set by parents or law", "Time to be indoors", "Breaking it has consequences"] },
    { word: "QUARANTINE", hints: ["Isolation for health", "40 days originally", "Disease prevention"] },
    { word: "SILHOUETTE", hints: ["Dark shape on light", "Profile in shadow", "No details, just outline"] },
  ],

  hard: [
    { word: "PARADOX",      hints: ["Self-contradicting truth", "Russell discovered a famous one", "Logical impossibility"] },
    { word: "ENTROPY",      hints: ["Disorder increases over time", "Second law of thermodynamics", "Heat death of the universe"] },
    { word: "OLIGARCHY",    hints: ["Few rule the many", "Ancient Greek concept", "Opposite of democracy"] },
    { word: "SUBTEXT",      hints: ["Meaning beneath the words", "Theatre directors hunt for it", "Never stated directly"] },
    { word: "ANACHRONISM",  hints: ["Out of its time period", "Spotting them in films is a hobby", "Clocks in ancient Rome"] },
    { word: "MANIFESTO",    hints: ["Public declaration of intent", "Political parties publish them", "Marx wrote a famous one"] },
    { word: "PLACEBO",      hints: ["Sugar pill with real effects", "Mind over medicine", "Control groups receive it"] },
    { word: "ALLEGORY",     hints: ["Story with hidden meaning", "Animal Farm is one", "Characters represent ideas"] },
    { word: "SOVEREIGNTY",  hints: ["Supreme state authority", "Borders define it", "Wars are fought over it"] },
    { word: "CATHARSIS",    hints: ["Emotional purging", "Aristotle described it in tragedy", "Crying at films does it"] },
    { word: "QUORUM",       hints: ["Minimum members to vote", "Meetings need it", "Without it, no decision"] },
    { word: "ASYMMETRY",    hints: ["Imbalance by design", "Nature uses it often", "Opposite of mirror image"] },
    { word: "RHETORIC",     hints: ["Art of persuasion", "Politicians master it", "Aristotle wrote the manual"] },
    { word: "DYSTOPIA",     hints: ["Imagined oppressive future", "1984 depicts one", "Opposite of utopia"] },
    { word: "DICHOTOMY",    hints: ["A split into two", "Good vs evil is one", "Binary opposition"] },
    { word: "HEGEMONY",     hints: ["Dominant cultural power", "Gramsci theorised it", "Soft power, not armies"] },
    { word: "TAUTOLOGY",    hints: ["Saying the same thing twice", "'Free gift' is one", "Redundant by definition"] },
    { word: "EPIPHANY",     hints: ["Sudden revelation", "Joyce popularised the term", "Lightbulb moment"] },
    { word: "DIASPORA",     hints: ["People scattered from homeland", "Jewish history exemplifies it", "Cultural identity spreads"] },
    { word: "COGNITIVE",    hints: ["Relates to mental processes", "Bias affects it", "Psychology studies it"] },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   2. GAME STATE
═══════════════════════════════════════════════════════════════ */
const STATE = {
  players:        [],       // [{ name: "Alice", score: 0 }]
  difficulty:     "easy",
  round:          0,

  // Per-round data
  impostors:      [],       // indices into STATE.players
  assignments:    [],       // [{ playerIndex, word, isImposter, hint }]

  // Word pool exhaustion tracking
  usedIndices: { easy: new Set(), medium: new Set(), hard: new Set() },

  // Reveal flow
  revealStep:     0,        // which player is currently revealing

  // Vote flow
  votes:          [],       // [{ voterIndex, accusedIndex }]
  voteStep:       0,        // which player is currently voting
};

/* ═══════════════════════════════════════════════════════════════
   3. UTILITY HELPERS
═══════════════════════════════════════════════════════════════ */

/** Shuffle array in place (Fisher-Yates) */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick a random element from an array */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Get player initials/emoji avatar for voting */
function avatarFor(name) {
  const emojis = ["🦊","🐺","🦁","🐸","🦄","🐙","🦋","🐧","🦅","🐉"];
  // Deterministic per name based on char codes
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return emojis[code % emojis.length];
}

/** Transition to a named screen */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  const target = document.getElementById(id);
  target.style.display = "flex";
  // Force reflow then animate
  requestAnimationFrame(() => target.classList.add("active"));
}

/* ═══════════════════════════════════════════════════════════════
   4. LOBBY — player entry & difficulty selection
═══════════════════════════════════════════════════════════════ */
const lobbyEls = {
  nameInput:    document.getElementById("player-name-input"),
  addBtn:       document.getElementById("add-player-btn"),
  playerList:   document.getElementById("player-list"),
  startBtn:     document.getElementById("start-game-btn"),
  countLabel:   document.getElementById("player-count-label"),
  hintText:     document.getElementById("lobby-hint"),
  diffBtns:     document.querySelectorAll(".diff-btn"),
};

/** Re-render the player list in the lobby */
function renderPlayerList() {
  lobbyEls.playerList.innerHTML = "";
  STATE.players.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        <span class="player-num">#${i + 1}</span>
        ${p.name}
      </span>
      <button class="remove-btn" data-index="${i}" aria-label="Remove ${p.name}">✕</button>
    `;
    lobbyEls.playerList.appendChild(li);
  });

  // Remove-player handlers
  lobbyEls.playerList.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      STATE.players.splice(idx, 1);
      renderPlayerList();
      updateLobbyUI();
    });
  });

  updateLobbyUI();
}

/** Update count, start button, hint text */
function updateLobbyUI() {
  const n = STATE.players.length;
  lobbyEls.countLabel.textContent = `(${n})`;

  if (n < 3) {
    lobbyEls.startBtn.disabled = true;
    lobbyEls.hintText.textContent = `Add ${3 - n} more player${3 - n === 1 ? "" : "s"} to begin`;
  } else if (n > 10) {
    lobbyEls.startBtn.disabled = true;
    lobbyEls.hintText.textContent = "Maximum 10 players";
  } else {
    lobbyEls.startBtn.disabled = false;
    lobbyEls.hintText.textContent = `${n} player${n !== 1 ? "s" : ""} ready — let's go!`;
  }
}

/** Add a player from the input */
function addPlayer() {
  const name = lobbyEls.nameInput.value.trim();
  if (!name) return;
  if (STATE.players.length >= 10) return;
  if (STATE.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    lobbyEls.nameInput.value = "";
    return; // Skip duplicates silently
  }
  STATE.players.push({ name, score: 0 });
  lobbyEls.nameInput.value = "";
  lobbyEls.nameInput.focus();
  renderPlayerList();
}

lobbyEls.addBtn.addEventListener("click", addPlayer);
lobbyEls.nameInput.addEventListener("keydown", e => { if (e.key === "Enter") addPlayer(); });

// Difficulty selection
lobbyEls.diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    lobbyEls.diffBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    STATE.difficulty = btn.dataset.diff;
  });
});

// Start game
document.getElementById("start-game-btn").addEventListener("click", () => {
  STATE.round = 0;
  // Reset used-word tracking when a new game begins
  STATE.usedIndices = { easy: new Set(), medium: new Set(), hard: new Set() };
  startRound();
});

/* ═══════════════════════════════════════════════════════════════
   5. ROUND SETUP
   ─────────────────────────────────────────────────────────────
   - Increment round counter
   - Randomly select impostor(s)
   - Pick a word (avoiding repeats until pool exhausted)
   - Assign each player their word or a single random hint
═══════════════════════════════════════════════════════════════ */
function startRound() {
  STATE.round += 1;
  STATE.impostors  = [];
  STATE.assignments = [];
  STATE.votes      = [];
  STATE.revealStep = 0;
  STATE.voteStep   = 0;

  const n = STATE.players.length;

  /* ── Imposter count ─────────────────────── */
  const impostorCount = n > 7 ? 2 : 1;

  /* ── Pick imposter indices (random, no repeats) ── */
  const shuffledIndices = shuffle([...Array(n).keys()]);
  STATE.impostors = shuffledIndices.slice(0, impostorCount);

  /* ── Pick a word from the pool ──────────── */
  const pool     = WORDS[STATE.difficulty];
  const used     = STATE.usedIndices[STATE.difficulty];

  // If all words used, reset pool
  if (used.size >= pool.length) used.clear();

  // Pick a random unused index
  let wordIndex;
  do { wordIndex = Math.floor(Math.random() * pool.length); }
  while (used.has(wordIndex));

  used.add(wordIndex);
  const entry = pool[wordIndex];
  const theWord  = entry.word;
  const theHints = entry.hints;

  /* ── Assign to each player ──────────────── */
  for (let i = 0; i < n; i++) {
    const isImposter = STATE.impostors.includes(i);
    STATE.assignments.push({
      playerIndex: i,
      word:        theWord,
      isImposter,
      hint:        isImposter ? pickRandom(theHints) : null,
    });
  }

  /* ── Begin reveal flow ──────────────────── */
  showRevealScreen();
}

/* ═══════════════════════════════════════════════════════════════
   6. REVEAL FLOW
═══════════════════════════════════════════════════════════════ */
const revealEls = {
  roundBadge:   document.getElementById("reveal-round-badge"),
  playerName:   document.getElementById("reveal-player-name"),
  cover:        document.getElementById("reveal-cover"),
  wordArea:     document.getElementById("reveal-word-area"),
  revealBtn:    document.getElementById("reveal-btn"),
  roleTag:      document.getElementById("reveal-role-tag"),
  wordCard:     document.getElementById("reveal-word-card"),
  wordText:     document.getElementById("reveal-word-text"),
  subText:      document.getElementById("reveal-sub-text"),
  nextBtn:      document.getElementById("reveal-next-btn"),
};

function showRevealScreen() {
  showScreen("screen-reveal");
  revealEls.roundBadge.textContent = `ROUND ${STATE.round}`;
  showRevealCover();
}

/** Show the "look away" cover for the current player */
function showRevealCover() {
  const assignment = STATE.assignments[STATE.revealStep];
  const player     = STATE.players[assignment.playerIndex];

  revealEls.playerName.textContent = player.name;
  revealEls.cover.classList.remove("hidden");
  revealEls.wordArea.classList.add("hidden");
}

/** Reveal the word or hint to the current player */
function revealWord() {
  const assignment = STATE.assignments[STATE.revealStep];
  const isImposter = assignment.isImposter;

  // Role tag
  if (isImposter) {
    revealEls.roleTag.textContent  = "🕵️ IMPOSTER — YOUR HINT";
    revealEls.roleTag.className    = "role-tag role-imposter";
    revealEls.wordCard.className   = "big-word-card hint-style";
    revealEls.wordText.textContent = assignment.hint;
    revealEls.subText.textContent  = "Use this clue to blend in. Don't give yourself away!";
  } else {
    revealEls.roleTag.textContent  = "✅ YOUR WORD";
    revealEls.roleTag.className    = "role-tag role-word";
    revealEls.wordCard.className   = "big-word-card word-style";
    revealEls.wordText.textContent = assignment.word;
    revealEls.subText.textContent  = "Remember your word. Describe it without saying it directly!";
  }

  // Determine next-button label
  const isLast = STATE.revealStep === STATE.players.length - 1;
  revealEls.nextBtn.textContent = isLast ? "START VOTING →" : "NEXT PLAYER →";

  revealEls.cover.classList.add("hidden");
  revealEls.wordArea.classList.remove("hidden");
}

/** Advance to the next player or to voting */
function advanceReveal() {
  STATE.revealStep += 1;
  if (STATE.revealStep >= STATE.players.length) {
    // All players have seen their word — start voting
    showVoteScreen();
  } else {
    revealEls.wordArea.classList.add("hidden");
    revealEls.cover.classList.remove("hidden");
    showRevealCover();
  }
}

revealEls.revealBtn.addEventListener("click", revealWord);
revealEls.nextBtn.addEventListener("click",   advanceReveal);

/* ═══════════════════════════════════════════════════════════════
   7. VOTING FLOW
   ─────────────────────────────────────────────────────────────
   Each player gets a private ballot in turn.
   Players cannot vote for themselves.
   After all votes are submitted, calculate result.
═══════════════════════════════════════════════════════════════ */
const voteEls = {
  roundBadge:   document.getElementById("vote-round-badge"),
  coverName:    document.getElementById("vote-cover-name"),
  cover:        document.getElementById("vote-player-cover"),
  ballot:       document.getElementById("vote-ballot"),
  voterName:    document.getElementById("ballot-voter-name"),
  optionsList:  document.getElementById("vote-options-list"),
  submitBtn:    document.getElementById("submit-vote-btn"),
  revealBtn:    document.getElementById("vote-reveal-btn"),
};

let currentVoteChoice = null; // index of accused player

function showVoteScreen() {
  showScreen("screen-vote");
  voteEls.roundBadge.textContent = `ROUND ${STATE.round}`;
  showVoteCover();
}

function showVoteCover() {
  const voter = STATE.players[STATE.voteStep];
  voteEls.coverName.textContent = voter.name;
  voteEls.cover.classList.remove("hidden");
  voteEls.ballot.classList.add("hidden");
}

function showBallot() {
  const voterIdx = STATE.voteStep;
  const voter    = STATE.players[voterIdx];

  voteEls.voterName.textContent = voter.name;
  currentVoteChoice = null;
  voteEls.submitBtn.disabled = true;

  // Build options — cannot vote for yourself
  voteEls.optionsList.innerHTML = "";
  STATE.players.forEach((p, i) => {
    if (i === voterIdx) return; // skip self
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="vote-option" data-accused="${i}">
        <span class="vote-avatar">${avatarFor(p.name)}</span>
        ${p.name}
      </button>
    `;
    voteEls.optionsList.appendChild(li);
  });

  // Option click handlers
  voteEls.optionsList.querySelectorAll(".vote-option").forEach(btn => {
    btn.addEventListener("click", () => {
      voteEls.optionsList.querySelectorAll(".vote-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      currentVoteChoice = parseInt(btn.dataset.accused);
      voteEls.submitBtn.disabled = false;
    });
  });

  voteEls.cover.classList.add("hidden");
  voteEls.ballot.classList.remove("hidden");
}

function submitVote() {
  if (currentVoteChoice === null) return;
  STATE.votes.push({ voterIndex: STATE.voteStep, accusedIndex: currentVoteChoice });

  STATE.voteStep += 1;
  if (STATE.voteStep >= STATE.players.length) {
    // All votes in — calculate result
    calculateResult();
  } else {
    voteEls.ballot.classList.add("hidden");
    voteEls.cover.classList.remove("hidden");
    showVoteCover();
  }
}

voteEls.revealBtn.addEventListener("click", showBallot);
voteEls.submitBtn.addEventListener("click", submitVote);

/* ═══════════════════════════════════════════════════════════════
   8. SCORING & RESULT SCREEN
   ─────────────────────────────────────────────────────────────
   Scoring rule:
   - Count votes against each player
   - The most-voted player is "the accused"
   - If ALL imposters are among the most-voted → imposters are caught → 0 pts
   - Otherwise → imposters escape → each imposter gets +1 pt
═══════════════════════════════════════════════════════════════ */
const resultEls = {
  emoji:          document.getElementById("result-emoji"),
  title:          document.getElementById("result-title"),
  detail:         document.getElementById("result-detail"),
  imposterNames:  document.getElementById("imposter-names-display"),
  realWord:       document.getElementById("result-real-word"),
  lbBtn:          document.getElementById("result-leaderboard-btn"),
};

function calculateResult() {
  /* ── Tally votes ────────────────────────── */
  const tally = new Array(STATE.players.length).fill(0);
  STATE.votes.forEach(v => tally[v.accusedIndex]++);

  // Find max vote count
  const maxVotes = Math.max(...tally);

  // Players with the most votes (could be a tie)
  const topAccused = tally
    .map((v, i) => ({ i, v }))
    .filter(x => x.v === maxVotes)
    .map(x => x.i);

  /* ── Check if imposters caught ──────────── */
  // All imposters must be in the topAccused for them to be "caught"
  const caughtAll = STATE.impostors.every(imp => topAccused.includes(imp));

  if (caughtAll) {
    // Imposters caught — nobody scores
    resultEls.emoji.textContent = "🎉";
    resultEls.title.textContent = "Imposters Caught!";
    resultEls.detail.textContent =
      `The group correctly identified the imposter${STATE.impostors.length > 1 ? "s" : ""}. No points awarded this round.`;
  } else {
    // Imposters escape — each imposter gets +1
    STATE.impostors.forEach(imp => { STATE.players[imp].score += 1; });
    resultEls.emoji.textContent = "🕵️";
    resultEls.title.textContent = "Imposters Escaped!";
    const escapedNames = STATE.impostors.map(i => STATE.players[i].name).join(" & ");
    resultEls.detail.textContent =
      `${escapedNames} fooled everyone and gained ${STATE.impostors.length > 1 ? "1 point each" : "1 point"}!`;
  }

  /* ── Display imposter names & real word ─── */
  const realWord = STATE.assignments[0].word;
  resultEls.imposterNames.innerHTML = STATE.impostors
    .map(i => `<span class="imposter-name-chip">${STATE.players[i].name}</span>`)
    .join(" ");
  resultEls.realWord.textContent = realWord;

  showScreen("screen-result");
}

document.getElementById("result-leaderboard-btn").addEventListener("click", showLeaderboard);

/* ═══════════════════════════════════════════════════════════════
   9. LEADERBOARD
═══════════════════════════════════════════════════════════════ */
const lbEls = {
  roundBadge: document.getElementById("lb-round-badge"),
  list:       document.getElementById("lb-list"),
};

function showLeaderboard() {
  lbEls.roundBadge.textContent = `AFTER ROUND ${STATE.round}`;

  // Sort players by score descending
  const sorted = [...STATE.players]
    .map((p, origIdx) => ({ ...p, origIdx }))
    .sort((a, b) => b.score - a.score);

  lbEls.list.innerHTML = "";

  sorted.forEach((p, rank) => {
    const li  = document.createElement("li");
    const rankNum = rank + 1;
    li.className = `lb-entry rank-${rankNum <= 3 ? rankNum : ""}`;
    li.style.animationDelay = `${rank * 0.06}s`;

    const medal = rankNum === 1 ? "🥇" : rankNum === 2 ? "🥈" : rankNum === 3 ? "🥉" : rankNum;

    li.innerHTML = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${p.name}</span>
      <span>
        <div class="lb-score">${p.score}</div>
        <div class="lb-score-label">pts</div>
      </span>
    `;
    lbEls.list.appendChild(li);
  });

  showScreen("screen-leaderboard");
}

/* ── Next round ───────────────────────────────────────── */
document.getElementById("next-round-btn").addEventListener("click", () => {
  // Allow changing difficulty before next round (handled by lobby diff selector)
  startRound();
});

/* ── New game (return to lobby, keep player names) ─────── */
document.getElementById("new-game-btn").addEventListener("click", () => {
  // Reset scores and round counter but keep player list
  STATE.players.forEach(p => { p.score = 0; });
  STATE.round = 0;
  STATE.usedIndices = { easy: new Set(), medium: new Set(), hard: new Set() };
  renderPlayerList();
  showScreen("screen-lobby");
});

/* ═══════════════════════════════════════════════════════════════
   10. INITIALISE
═══════════════════════════════════════════════════════════════ */
// Make the lobby visible first
showScreen("screen-lobby");
renderPlayerList();
