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
    10. Initialise
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   1. WORD / HINT DATA POOL
   ─────────────────────────────────────────────────────────────
   Each entry: { word: "WORD", hints: ["ONE", "TWO", "THREE"] }
   Hints are single obvious words — the most natural everyday
   associations with the word. Close enough for the imposter to
   pick a plausible song, but one degree removed from the word
   itself so a real player's song choice will be more specific.
   50 entries per difficulty level.
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
  players:        [],
  difficulty:     "easy",
  round:          0,
  impostors:      [],
  assignments:    [],
  usedIndices:    { easy: new Set(), medium: new Set(), hard: new Set() },
  revealStep:     0,
  votes:          [],
  voteStep:       0,
  // cooldown[i] = round number when player i was last imposter.
  // They are blocked from being imposter again for 2 rounds after that.
  cooldown:       [],
};

/* ═══════════════════════════════════════════════════════════════
   3. UTILITY HELPERS
═══════════════════════════════════════════════════════════════ */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function avatarFor(name) {
  const emojis = ["🦊","🐺","🦁","🐸","🦄","🐙","🦋","🐧","🦅","🐉"];
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return emojis[code % emojis.length];
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  const target = document.getElementById(id);
  target.style.display = "flex";
  requestAnimationFrame(() => target.classList.add("active"));
}

/* ═══════════════════════════════════════════════════════════════
   4. LOBBY
═══════════════════════════════════════════════════════════════ */
const lobbyEls = {
  nameInput:  document.getElementById("player-name-input"),
  addBtn:     document.getElementById("add-player-btn"),
  playerList: document.getElementById("player-list"),
  startBtn:   document.getElementById("start-game-btn"),
  countLabel: document.getElementById("player-count-label"),
  hintText:   document.getElementById("lobby-hint"),
  diffBtns:   document.querySelectorAll(".diff-btn"),
};

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
  lobbyEls.playerList.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      STATE.players.splice(parseInt(btn.dataset.index), 1);
      renderPlayerList();
    });
  });
  updateLobbyUI();
}

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

function addPlayer() {
  const name = lobbyEls.nameInput.value.trim();
  if (!name || STATE.players.length >= 10) return;
  if (STATE.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    lobbyEls.nameInput.value = "";
    return;
  }
  STATE.players.push({ name, score: 0 });
  lobbyEls.nameInput.value = "";
  lobbyEls.nameInput.focus();
  renderPlayerList();
}

lobbyEls.addBtn.addEventListener("click", addPlayer);
lobbyEls.nameInput.addEventListener("keydown", e => { if (e.key === "Enter") addPlayer(); });

lobbyEls.diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    lobbyEls.diffBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    STATE.difficulty = btn.dataset.diff;
  });
});

document.getElementById("start-game-btn").addEventListener("click", () => {
  STATE.round = 0;
  STATE.cooldown = [];
  STATE.usedIndices = { easy: new Set(), medium: new Set(), hard: new Set() };
  startRound();
});

/* ═══════════════════════════════════════════════════════════════
   5. ROUND SETUP
═══════════════════════════════════════════════════════════════ */
function startRound() {
  STATE.round += 1;
  STATE.impostors   = [];
  STATE.assignments = [];
  STATE.votes       = [];
  STATE.revealStep  = 0;
  STATE.voteStep    = 0;

  const n             = STATE.players.length;
  const impostorCount = n > 7 ? 2 : 1;

  // Ensure cooldown array is sized to current player count
  while (STATE.cooldown.length < n) STATE.cooldown.push(0);

  // Build eligible pool: players not on cooldown (last imposter within 2 rounds)
  let eligible = [...Array(n).keys()].filter(
    i => STATE.round - STATE.cooldown[i] > 2
  );

  // Safety fallback: if cooldowns block too many players, use everyone
  if (eligible.length < impostorCount) eligible = [...Array(n).keys()];

  STATE.impostors = shuffle(eligible).slice(0, impostorCount);

  // Record the round each new imposter was last picked
  STATE.impostors.forEach(i => { STATE.cooldown[i] = STATE.round; });

  const pool = WORDS[STATE.difficulty];
  const used = STATE.usedIndices[STATE.difficulty];
  if (used.size >= pool.length) used.clear();

  let wordIndex;
  do { wordIndex = Math.floor(Math.random() * pool.length); }
  while (used.has(wordIndex));

  used.add(wordIndex);
  const { word: theWord, hints: theHints } = pool[wordIndex];

  for (let i = 0; i < n; i++) {
    const isImposter = STATE.impostors.includes(i);
    STATE.assignments.push({
      playerIndex: i,
      word:        theWord,
      isImposter,
      hint:        isImposter ? pickRandom(theHints) : null,
    });
  }

  showRevealScreen();
}

/* ═══════════════════════════════════════════════════════════════
   6. REVEAL FLOW
═══════════════════════════════════════════════════════════════ */
const revealEls = {
  roundBadge: document.getElementById("reveal-round-badge"),
  playerName: document.getElementById("reveal-player-name"),
  cover:      document.getElementById("reveal-cover"),
  wordArea:   document.getElementById("reveal-word-area"),
  revealBtn:  document.getElementById("reveal-btn"),
  roleTag:    document.getElementById("reveal-role-tag"),
  wordCard:   document.getElementById("reveal-word-card"),
  wordText:   document.getElementById("reveal-word-text"),
  subText:    document.getElementById("reveal-sub-text"),
  nextBtn:    document.getElementById("reveal-next-btn"),
};

function showRevealScreen() {
  showScreen("screen-reveal");
  revealEls.roundBadge.textContent = `ROUND ${STATE.round}`;
  showRevealCover();
}

function showRevealCover() {
  const { playerIndex } = STATE.assignments[STATE.revealStep];
  revealEls.playerName.textContent = STATE.players[playerIndex].name;
  revealEls.cover.classList.remove("hidden");
  revealEls.wordArea.classList.add("hidden");
}

function revealWord() {
  const { isImposter, hint, word } = STATE.assignments[STATE.revealStep];

  if (isImposter) {
    revealEls.roleTag.textContent  = "🕵️ IMPOSTER — YOUR HINT";
    revealEls.roleTag.className    = "role-tag role-imposter";
    revealEls.wordCard.className   = "big-word-card hint-style";
    revealEls.wordText.textContent = hint;
    revealEls.subText.textContent  = "Use this clue to blend in. Don't give yourself away!";
  } else {
    revealEls.roleTag.textContent  = "✅ YOUR WORD";
    revealEls.roleTag.className    = "role-tag role-word";
    revealEls.wordCard.className   = "big-word-card word-style";
    revealEls.wordText.textContent = word;
    revealEls.subText.textContent  = "Remember your word. Choose a song that fits without making it too obvious!";
  }

  const isLast = STATE.revealStep === STATE.players.length - 1;
  revealEls.nextBtn.textContent = isLast ? "START VOTING →" : "NEXT PLAYER →";
  revealEls.cover.classList.add("hidden");
  revealEls.wordArea.classList.remove("hidden");
}

function advanceReveal() {
  STATE.revealStep += 1;
  if (STATE.revealStep >= STATE.players.length) {
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
═══════════════════════════════════════════════════════════════ */
const voteEls = {
  roundBadge:  document.getElementById("vote-round-badge"),
  coverName:   document.getElementById("vote-cover-name"),
  cover:       document.getElementById("vote-player-cover"),
  ballot:      document.getElementById("vote-ballot"),
  voterName:   document.getElementById("ballot-voter-name"),
  optionsList: document.getElementById("vote-options-list"),
  submitBtn:   document.getElementById("submit-vote-btn"),
  revealBtn:   document.getElementById("vote-reveal-btn"),
};

let currentVoteChoice = null;

function showVoteScreen() {
  showScreen("screen-vote");
  voteEls.roundBadge.textContent = `ROUND ${STATE.round}`;
  showVoteCover();
}

function showVoteCover() {
  voteEls.coverName.textContent = STATE.players[STATE.voteStep].name;
  voteEls.cover.classList.remove("hidden");
  voteEls.ballot.classList.add("hidden");
}

function showBallot() {
  const voterIdx = STATE.voteStep;
  voteEls.voterName.textContent = STATE.players[voterIdx].name;
  currentVoteChoice = null;
  voteEls.submitBtn.disabled = true;
  voteEls.optionsList.innerHTML = "";

  STATE.players.forEach((p, i) => {
    if (i === voterIdx) return;
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="vote-option" data-accused="${i}">
        <span class="vote-avatar">${avatarFor(p.name)}</span>
        ${p.name}
      </button>
    `;
    voteEls.optionsList.appendChild(li);
  });

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
   8. SCORING & RESULT
═══════════════════════════════════════════════════════════════ */
function calculateResult() {
  const tally      = new Array(STATE.players.length).fill(0);
  STATE.votes.forEach(v => tally[v.accusedIndex]++);
  const maxVotes   = Math.max(...tally);
  const topAccused = tally.map((v, i) => ({ i, v })).filter(x => x.v === maxVotes).map(x => x.i);
  const caughtAll  = STATE.impostors.every(imp => topAccused.includes(imp));

  const emojiEl  = document.getElementById("result-emoji");
  const titleEl  = document.getElementById("result-title");
  const detailEl = document.getElementById("result-detail");

  if (caughtAll) {
    emojiEl.textContent  = "🎉";
    titleEl.textContent  = "Imposters Caught!";
    detailEl.textContent = `The group correctly identified the imposter${STATE.impostors.length > 1 ? "s" : ""}. No points this round.`;
  } else {
    STATE.impostors.forEach(imp => { STATE.players[imp].score += 1; });
    emojiEl.textContent  = "🕵️";
    titleEl.textContent  = "Imposters Escaped!";
    const names = STATE.impostors.map(i => STATE.players[i].name).join(" & ");
    detailEl.textContent = `${names} fooled everyone and gained ${STATE.impostors.length > 1 ? "1 point each" : "1 point"}!`;
  }

  document.getElementById("imposter-names-display").innerHTML =
    STATE.impostors.map(i => `<span class="imposter-name-chip">${STATE.players[i].name}</span>`).join(" ");
  document.getElementById("result-real-word").textContent = STATE.assignments[0].word;

  showScreen("screen-result");
}

document.getElementById("result-leaderboard-btn").addEventListener("click", showLeaderboard);

/* ═══════════════════════════════════════════════════════════════
   9. LEADERBOARD
═══════════════════════════════════════════════════════════════ */
function showLeaderboard() {
  document.getElementById("lb-round-badge").textContent = `AFTER ROUND ${STATE.round}`;

  const sorted = [...STATE.players]
    .map((p, i) => ({ ...p, i }))
    .sort((a, b) => b.score - a.score);

  const list = document.getElementById("lb-list");
  list.innerHTML = "";
  sorted.forEach((p, rank) => {
    const rankNum = rank + 1;
    const medal   = rankNum === 1 ? "🥇" : rankNum === 2 ? "🥈" : rankNum === 3 ? "🥉" : rankNum;
    const li      = document.createElement("li");
    li.className  = `lb-entry rank-${rankNum <= 3 ? rankNum : ""}`;
    li.style.animationDelay = `${rank * 0.06}s`;
    li.innerHTML  = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${p.name}</span>
      <span>
        <div class="lb-score">${p.score}</div>
        <div class="lb-score-label">pts</div>
      </span>
    `;
    list.appendChild(li);
  });

  showScreen("screen-leaderboard");
}

document.getElementById("next-round-btn").addEventListener("click", startRound);

document.getElementById("new-game-btn").addEventListener("click", () => {
  STATE.players.forEach(p => { p.score = 0; });
  STATE.round = 0;
  STATE.cooldown = [];
  STATE.usedIndices = { easy: new Set(), medium: new Set(), hard: new Set() };
  renderPlayerList();
  showScreen("screen-lobby");
});

/* ═══════════════════════════════════════════════════════════════
   10. INITIALISE
═══════════════════════════════════════════════════════════════ */
showScreen("screen-lobby");
renderPlayerList();
