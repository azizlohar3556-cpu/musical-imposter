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
 
  /* ── EASY ──────────────────────────────────────────────────
     Familiar everyday things everyone knows songs about.      */
  easy: [
    { word: "RAIN",        hints: ["WET",       "UMBRELLA",  "PUDDLE"]     },
    { word: "FIRE",        hints: ["HOT",       "FLAMES",    "BURNING"]    },
    { word: "BEACH",       hints: ["SAND",      "WAVES",     "SUNNY"]      },
    { word: "DOG",         hints: ["BARK",      "LOYAL",     "FETCH"]      },
    { word: "DANCING",     hints: ["MOVES",     "RHYTHM",    "FLOOR"]      },
    { word: "SUNSHINE",    hints: ["BRIGHT",    "WARM",      "YELLOW"]     },
    { word: "BIRTHDAY",    hints: ["CAKE",      "CANDLES",   "PRESENTS"]   },
    { word: "KISS",        hints: ["LIPS",      "CLOSE",     "TENDER"]     },
    { word: "STARS",       hints: ["NIGHT",     "SHINING",   "WISHES"]     },
    { word: "HONEY",       hints: ["SWEET",     "BEE",       "STICKY"]     },
    { word: "ROAD",        hints: ["LONG",      "DRIVING",   "AHEAD"]      },
    { word: "HOME",        hints: ["FAMILY",    "SAFE",      "COMFORT"]    },
    { word: "NIGHT",       hints: ["DARK",      "LATE",      "QUIET"]      },
    { word: "BABY",        hints: ["TINY",      "CRY",       "SOFT"]       },
    { word: "SUMMER",      hints: ["HOT",       "HOLIDAY",   "LONG"]       },
    { word: "DIAMOND",     hints: ["RING",      "SPARKLE",   "EXPENSIVE"]  },
    { word: "OCEAN",       hints: ["WAVES",     "DEEP",      "SALTY"]      },
    { word: "HEART",       hints: ["LOVE",      "BEAT",      "CHEST"]      },
    { word: "GOLD",        hints: ["SHINY",     "VALUABLE",  "MEDAL"]      },
    { word: "ANGEL",       hints: ["WINGS",     "HEAVEN",    "HALO"]       },
    { word: "THUNDER",     hints: ["LOUD",      "STORM",     "RUMBLE"]     },
    { word: "ROSE",        hints: ["RED",       "THORNS",    "ROMANTIC"]   },
    { word: "MOON",        hints: ["NIGHT",     "ROUND",     "GLOW"]       },
    { word: "RIVER",       hints: ["FLOWING",   "BANKS",     "WATER"]      },
    { word: "SNOW",        hints: ["WHITE",     "COLD",      "FALLING"]    },
    { word: "CANDY",       hints: ["SWEET",     "SUGAR",     "COLOURFUL"]  },
    { word: "PARTY",       hints: ["LOUD",      "FRIENDS",   "CELEBRATE"]  },
    { word: "SMILE",       hints: ["HAPPY",     "TEETH",     "WARM"]       },
    { word: "DREAM",       hints: ["SLEEPING",  "FLOATING",  "IMAGINE"]    },
    { word: "CLOUD",       hints: ["FLUFFY",    "SKY",       "FLOATING"]   },
    { word: "BUTTERFLY",   hints: ["WINGS",     "COLOURFUL", "FLUTTER"]    },
    { word: "CHRISTMAS",   hints: ["PRESENTS",  "SNOW",      "TREE"]       },
    { word: "CLOCK",       hints: ["TICKING",   "TIME",      "HANDS"]      },
    { word: "MONEY",       hints: ["CASH",      "RICH",      "SPEND"]      },
    { word: "FRIENDS",     hints: ["TOGETHER",  "LAUGH",     "LOYAL"]      },
    { word: "SUNRISE",     hints: ["MORNING",   "PINK",      "BEGINNING"]  },
    { word: "RAINBOW",     hints: ["COLOURS",   "RAIN",      "ARCH"]       },
    { word: "GUITAR",      hints: ["STRINGS",   "STRUM",     "ROCK"]       },
    { word: "WEDDING",     hints: ["BRIDE",     "RINGS",     "VOWS"]       },
    { word: "FREEDOM",     hints: ["FREE",      "OPEN",      "FLYING"]     },
    { word: "BROKEN",      hints: ["SHATTERED", "PIECES",    "HURT"]       },
    { word: "LONELY",      hints: ["ALONE",     "EMPTY",     "QUIET"]      },
    { word: "RUNNING",     hints: ["FAST",      "BREATHLESS","CHASE"]      },
    { word: "WAITING",     hints: ["PATIENT",   "HOPING",    "SLOW"]       },
    { word: "FALLING",     hints: ["DROPPING",  "HELPLESS",  "DOWN"]       },
    { word: "FOREVER",     hints: ["ALWAYS",    "ENDLESS",   "PROMISE"]    },
    { word: "LULLABY",     hints: ["SLEEPY",    "GENTLE",    "ROCKING"]    },
    { word: "WINGS",       hints: ["FLY",       "FEATHERS",  "SOAR"]       },
    { word: "TREASURE",    hints: ["VALUABLE",  "BURIED",    "PRECIOUS"]   },
    { word: "MAGIC",       hints: ["SPELL",     "WONDER",    "TRICK"]      },
  ],
 
  /* ── MEDIUM ────────────────────────────────────────────────
     Slightly more abstract but still very song-friendly.      */
  medium: [
    { word: "JEALOUSY",    hints: ["GREEN",     "ENVY",      "BITTER"]     },
    { word: "REVENGE",     hints: ["PAYBACK",   "COLD",      "SCORE"]      },
    { word: "MEMORIES",    hints: ["PAST",      "FADED",     "REMEMBER"]   },
    { word: "MIDNIGHT",    hints: ["DARK",      "CLOCK",     "LATE"]       },
    { word: "SECRETS",     hints: ["HIDDEN",    "WHISPER",   "PRIVATE"]    },
    { word: "KARMA",       hints: ["DESERVE",   "COMES",     "AROUND"]     },
    { word: "FADING",      hints: ["DISAPPEAR", "SLOWLY",    "GONE"]       },
    { word: "LOST",        hints: ["DIRECTION", "WANDERING", "CONFUSED"]   },
    { word: "BLEEDING",    hints: ["WOUND",     "RED",       "HURTING"]    },
    { word: "HAUNTED",     hints: ["GHOST",     "PAST",      "LINGERING"]  },
    { word: "SURRENDER",   hints: ["GIVE UP",   "WHITE FLAG","YIELD"]      },
    { word: "DEVOTION",    hints: ["LOYAL",     "WORSHIP",   "DEDICATED"]  },
    { word: "TEMPTATION",  hints: ["RESIST",    "DESIRE",    "FORBIDDEN"]  },
    { word: "OBSESSION",   hints: ["FIXATED",   "CONSUMED",  "INTENSE"]    },
    { word: "ILLUSION",    hints: ["FAKE",      "TRICK",     "APPEAR"]     },
    { word: "REDEMPTION",  hints: ["FORGIVEN",  "SECOND",    "SAVED"]      },
    { word: "HOLLOW",      hints: ["EMPTY",     "INSIDE",    "NUMB"]       },
    { word: "RECKLESS",    hints: ["WILD",      "CARELESS",  "FAST"]       },
    { word: "STRANGER",    hints: ["UNKNOWN",   "UNFAMILIAR","ALONE"]      },
    { word: "SILENCE",     hints: ["QUIET",     "STILL",     "NOTHING"]    },
    { word: "SCARS",       hints: ["HEALED",    "MARKS",     "PAST"]       },
    { word: "WOLVES",      hints: ["PACK",      "HOWL",      "WILD"]       },
    { word: "POISON",      hints: ["TOXIC",     "DANGEROUS", "SLOW"]       },
    { word: "LIGHTNING",   hints: ["FLASH",     "FAST",      "STRIKE"]     },
    { word: "WARRIOR",     hints: ["STRONG",    "FIGHT",     "BRAVE"]      },
    { word: "SINKING",     hints: ["DROWNING",  "DEEP",      "HELPLESS"]   },
    { word: "NUMB",        hints: ["FEEL",      "COLD",      "EMPTY"]      },
    { word: "ECHO",        hints: ["REPEAT",    "HOLLOW",    "FADING"]     },
    { word: "GRAVITY",     hints: ["PULL",      "DOWN",      "FORCE"]      },
    { word: "HURRICANE",   hints: ["SPINNING",  "CHAOS",     "STORM"]      },
    { word: "INVISIBLE",   hints: ["UNSEEN",    "IGNORED",   "TRANSPARENT"]},
    { word: "KINGDOM",     hints: ["RULER",     "THRONE",    "POWER"]      },
    { word: "LIES",        hints: ["DISHONEST", "COVER",     "DECEIVE"]    },
    { word: "MISSING",     hints: ["GONE",      "ABSENT",    "SEARCHING"]  },
    { word: "PANIC",       hints: ["SCARED",    "BREATHLESS","RUSH"]       },
    { word: "QUEEN",       hints: ["CROWN",     "POWERFUL",  "ROYAL"]      },
    { word: "REBEL",       hints: ["RULES",     "DEFIANT",   "AGAINST"]    },
    { word: "SAVAGE",      hints: ["WILD",      "FIERCE",    "RAW"]        },
    { word: "TRAGEDY",     hints: ["SAD",       "LOSS",      "PAINFUL"]    },
    { word: "VILLAIN",     hints: ["EVIL",      "DARK",      "ENEMY"]      },
    { word: "WICKED",      hints: ["BAD",       "TWISTED",   "DARK"]       },
    { word: "YOUTH",       hints: ["YOUNG",     "CAREFREE",  "ENERGY"]     },
    { word: "CHASING",     hints: ["RUNNING",   "AFTER",     "CATCHING"]   },
    { word: "CRUEL",       hints: ["MEAN",      "COLD",      "HEARTLESS"]  },
    { word: "DESPERATE",   hints: ["PLEADING",  "LAST",      "NEED"]       },
    { word: "UNBREAKABLE", hints: ["STRONG",    "SURVIVE",   "RESILIENT"]  },
    { word: "NOSTALGIA",   hints: ["PAST",      "LONGING",   "WARM"]       },
    { word: "HUNGER",      hints: ["EMPTY",     "CRAVING",   "NEED"]       },
    { word: "NOWHERE",     hints: ["LOST",      "EMPTY",     "ROAD"]       },
    { word: "BLINDING",    hints: ["BRIGHT",    "UNABLE",    "LIGHTS"]     },
  ],
 
  /* ── HARD ──────────────────────────────────────────────────
     More abstract feelings and states — still song-friendly
     but require more thought from the imposter.               */
  hard: [
    { word: "EUPHORIA",     hints: ["HIGH",      "BLISS",     "RUSH"]      },
    { word: "MELANCHOLY",   hints: ["SAD",       "SLOW",      "HEAVY"]     },
    { word: "CATHARSIS",    hints: ["RELEASE",   "CRY",       "RELIEF"]    },
    { word: "SOLITUDE",     hints: ["ALONE",     "PEACEFUL",  "QUIET"]     },
    { word: "PARANOIA",     hints: ["WATCHING",  "TRUST",     "FEAR"]      },
    { word: "DELUSION",     hints: ["BELIEVE",   "FALSE",     "MIND"]      },
    { word: "RENAISSANCE",  hints: ["REBIRTH",   "NEW",       "RISING"]    },
    { word: "DYSTOPIA",     hints: ["DARK",      "CONTROLLED","BROKEN"]    },
    { word: "APATHY",       hints: ["INDIFFERENT","NUMB",     "CARING"]    },
    { word: "FACADE",       hints: ["MASK",      "PRETEND",   "SURFACE"]   },
    { word: "HYSTERIA",     hints: ["CHAOS",     "SCREAMING", "WILD"]      },
    { word: "JADED",        hints: ["TIRED",     "BITTER",    "WORN"]      },
    { word: "MARTYRDOM",    hints: ["SACRIFICE", "SUFFER",    "CAUSE"]     },
    { word: "OBLIVION",     hints: ["FORGOTTEN", "DARKNESS",  "GONE"]      },
    { word: "PRETENDER",    hints: ["FAKE",      "ACT",       "HIDING"]    },
    { word: "RENEGADE",     hints: ["OUTCAST",   "REBEL",     "ALONE"]     },
    { word: "SYMPATHY",     hints: ["FEEL",      "SORRY",     "UNDERSTAND"]},
    { word: "TORMENT",      hints: ["PAIN",      "SUFFERING", "RELENTLESS"]},
    { word: "UTOPIA",       hints: ["PERFECT",   "IDEAL",     "DREAM"]     },
    { word: "WANDERLUST",   hints: ["TRAVEL",    "RESTLESS",  "EXPLORE"]   },
    { word: "ABSOLUTION",   hints: ["FORGIVEN",  "FREE",      "CLEAN"]     },
    { word: "BETRAYAL",     hints: ["TRUST",     "STAB",      "BACK"]      },
    { word: "CORRUPTION",   hints: ["DIRTY",     "POWER",     "ROTTEN"]    },
    { word: "DUALITY",      hints: ["TWO",       "OPPOSITE",  "SIDES"]     },
    { word: "ENIGMA",       hints: ["MYSTERIOUS","UNKNOWN",   "PUZZLE"]    },
    { word: "FRAGILE",      hints: ["DELICATE",  "HANDLE",    "BREAK"]     },
    { word: "GLORY",        hints: ["TRIUMPH",   "SHINE",     "VICTORY"]   },
    { word: "IMMORTAL",     hints: ["NEVER",     "FOREVER",   "UNDYING"]   },
    { word: "LEGACY",       hints: ["LEFT",      "REMEMBER",  "AFTER"]     },
    { word: "MASQUERADE",   hints: ["MASK",      "HIDING",    "BALL"]      },
    { word: "NEMESIS",      hints: ["ENEMY",     "RIVAL",     "DOWNFALL"]  },
    { word: "ODYSSEY",      hints: ["JOURNEY",   "LONG",      "EPIC"]      },
    { word: "PHANTOM",      hints: ["GHOST",     "UNSEEN",    "HAUNTING"]  },
    { word: "CONSEQUENCE",  hints: ["RESULT",    "AFTER",     "PRICE"]     },
    { word: "GASLIGHT",     hints: ["MANIPULATE","DOUBT",     "MIND"]      },
    { word: "PURGATORY",    hints: ["WAITING",   "BETWEEN",   "STUCK"]     },
    { word: "VULNERABILITY",hints: ["EXPOSED",   "OPEN",      "FRAGILE"]   },
    { word: "ZEALOUS",      hints: ["PASSIONATE","INTENSE",   "DRIVEN"]    },
    { word: "NIHILISM",     hints: ["NOTHING",   "POINTLESS", "EMPTY"]     },
    { word: "EXISTENTIAL",  hints: ["PURPOSE",   "WHY",       "MEANING"]   },
    { word: "HEGEMONY",     hints: ["CONTROL",   "DOMINANT",  "POWER"]     },
    { word: "JUDGMENT",     hints: ["VERDICT",   "JUDGED",    "WEIGHED"]   },
    { word: "IMPOSTER",     hints: ["FAKE",      "PRETENDING","CAUGHT"]    },
    { word: "GRAVITY",      hints: ["PULL",      "WEIGHT",    "GROUND"]    },
    { word: "DEVOTION",     hints: ["WORSHIP",   "SURRENDER", "COMPLETE"]  },
    { word: "WRATH",        hints: ["RAGE",      "FURY",      "ANGER"]     },
    { word: "ENVY",         hints: ["WANTING",   "JEALOUS",   "GREEN"]     },
    { word: "GLUTTONY",     hints: ["EXCESS",    "TOO MUCH",  "CONSUME"]   },
    { word: "SLOTH",        hints: ["LAZY",      "SLOW",      "SLEEP"]     },
    { word: "PRIDE",        hints: ["ARROGANT",  "BOASTFUL",  "EGO"]       },
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
