// ============================================================
// cs_shared.js
// Shared data, state, and logic for Acolyte Dataslate
// Loaded by operative_tab.html and all cs_*.html sub-tabs
// ============================================================

// Marker so other files can confirm this loaded correctly
window.CS_SHARED_LOADED = true;

// ── CSS VARIABLES ──────────────────────────────────────────
// Injected as a <style> block so sub-tabs inherit the palette
// without needing their own :root declarations.
(function injectSharedStyles() {
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap';
  (document.head || document.documentElement).appendChild(link);

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --green:       #00ff41;
      --green-dim:   #00aa2b;
      --green-dark:  #003010;
      --green-faint: #000f05;
      --green-bright:#80ffaa;
      --green-mid:   #004a18;
      --red:         #ff3300;
      --red-dim:     #992200;
      --amber:       #ffb000;
      --amber-dim:   #aa7400;
      --black:       #020802;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--black);
      color: var(--green);
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      min-height: 100vh;
      overflow-x: hidden;
    }
    /* Scanlines */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent, transparent 2px,
        rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
      );
      pointer-events: none;
      z-index: 9999;
    }
    /* ── PANELS ── */
    .panel { border: 1px solid var(--green-mid); background: var(--green-faint); }
    .panel-header {
      font-family: 'VT323', monospace;
      font-size: 16px;
      letter-spacing: 2px;
      padding: 5px 10px;
      background: var(--green-dark);
      border-bottom: 1px solid var(--green-mid);
      color: var(--green-bright);
    }
    .panel-body { padding: 8px; }
    /* ── LAYOUT ── */
    .sheet-container { padding: 10px; max-width: 1400px; margin: 0 auto; }
    .sheet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .sheet-full { grid-column: 1 / -1; }
    @media (max-width: 768px) {
      .sheet-grid { grid-template-columns: 1fr; }
      .sheet-full { grid-column: 1; }
    }
    /* ── FIELDS ── */
    label { display: block; color: var(--green-dim); font-size: 11px; margin-bottom: 1px; letter-spacing: 1px; }
    input[type="text"], input[type="number"], select, textarea {
      width: 100%;
      background: var(--black);
      border: 1px solid var(--green-mid);
      color: var(--green);
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      padding: 3px 6px;
      outline: none;
    }
    input[type="text"]:focus, input[type="number"]:focus, select:focus, textarea:focus { border-color: var(--green); }
    select option { background: var(--black); }
    textarea { resize: vertical; min-height: 60px; }
    .field { margin-bottom: 6px; }
    .field-row { display: grid; gap: 6px; margin-bottom: 6px; }
    .field-row.cols-2 { grid-template-columns: 1fr 1fr; }
    .field-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .field-row.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
    /* ── TERMINAL BUTTONS ── */
    .plus-btn, .minus-btn, .adv-btn, .inf-btn {
      font-family: 'VT323', monospace;
      font-size: 15px;
      background: none; border: none;
      cursor: pointer; padding: 0 2px; line-height: 1;
      transition: color 0.1s, text-shadow 0.1s;
      user-select: none;
    }
    .plus-btn  { color: var(--green-dim); }
    .minus-btn { color: var(--green-dim); }
    .adv-btn   { color: var(--green-dim); }
    .inf-btn   { color: var(--green-dim); }
    .plus-btn:hover  { color: var(--green-bright); text-shadow: 0 0 6px var(--green); }
    .minus-btn:hover { color: var(--red);           text-shadow: 0 0 6px var(--red); }
    .adv-btn:hover   { color: var(--green-bright);  text-shadow: 0 0 6px var(--green); }
    .inf-btn:hover   { color: var(--green-bright);  text-shadow: 0 0 6px var(--green); }
    .temp-down:hover { color: var(--red); text-shadow: 0 0 6px var(--red); }
    /* Action buttons [ LABEL ] style */
    .action-btn {
      font-family: 'VT323', monospace; font-size: 13px;
      padding: 2px 8px; background: none; border: none;
      color: var(--green-dim); cursor: pointer; letter-spacing: 1px;
      transition: color 0.1s, text-shadow 0.1s;
    }
    .action-btn::before { content: '['; color: var(--green-dark); }
    .action-btn::after  { content: ']'; color: var(--green-dark); }
    .action-btn:hover { color: var(--amber); text-shadow: 0 0 6px var(--amber-dim); }
    .action-btn:hover::before, .action-btn:hover::after { color: var(--amber-dim); }
    .action-btn.danger:hover { color: var(--red); text-shadow: 0 0 6px var(--red-dim); }
    .action-btn.danger:hover::before, .action-btn.danger:hover::after { color: var(--red-dim); }
    /* Add-row button */
    .add-row-btn {
      font-family: 'VT323', monospace; font-size: 14px;
      padding: 4px 10px; background: none; border: none;
      border-top: 1px solid var(--green-dark);
      color: var(--green-dark); cursor: pointer;
      margin-top: 6px; width: 100%; letter-spacing: 2px; text-align: left;
      transition: color 0.1s, text-shadow 0.1s;
    }
    .add-row-btn:hover { color: var(--green); text-shadow: 0 0 8px var(--green-dim); border-top-color: var(--green-mid); }
    /* Remove button */
    .remove-btn {
      background: none; border: none;
      color: var(--green-dark); cursor: pointer;
      font-family: 'VT323', monospace; font-size: 14px;
      padding: 0 4px; transition: color 0.1s, text-shadow 0.1s;
    }
    .remove-btn:hover { color: var(--red); text-shadow: 0 0 6px var(--red-dim); }
    /* List items */
    .list-item {
      display: flex; gap: 6px; align-items: flex-start;
      margin-bottom: 4px; border: 1px solid var(--green-dark);
      padding: 4px; background: var(--black);
    }
    .list-item input, .list-item select { flex: 1; min-width: 0; }
    /* Warnings */
    .warn-critical { color: var(--red) !important; }
    .warn-amber    { color: var(--amber) !important; }
    /* Utilities */
    .flex-row { display: flex; gap: 6px; align-items: center; }
    .ml-auto  { margin-left: auto; }
    .text-dim    { color: var(--green-dim); }
    .text-amber  { color: var(--amber); }
    .text-red    { color: var(--red); }
    .text-bright { color: var(--green-bright); }
    .font-vt  { font-family: 'VT323', monospace; }
    .fs-big   { font-size: 20px; }
    .mt-6     { margin-top: 6px; }
    .mb-6     { margin-bottom: 6px; }
    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--green-mid); }
    ::-webkit-scrollbar-thumb:hover { background: var(--green-dim); }
  `;
  (document.head || document.documentElement).appendChild(style);
})();


// ============================================================
// DATA DEFINITIONS
// ============================================================

const CHARACTERISTICS = [
  { key:'ws',  name:'WS',  full:'Weapon Skill'    },
  { key:'bs',  name:'BS',  full:'Ballistic Skill'  },
  { key:'str', name:'STR', full:'Strength'         },
  { key:'tgh', name:'TGH', full:'Toughness'        },
  { key:'ag',  name:'AG',  full:'Agility'          },
  { key:'int', name:'INT', full:'Intelligence'     },
  { key:'per', name:'PER', full:'Perception'       },
  { key:'wil', name:'WIL', full:'Willpower'        },
  { key:'fel', name:'FEL', full:'Fellowship'       }
];

const CHAR_FULLNAMES = {
  ws:'WEAPON SKILL', bs:'BALLISTIC SKILL', str:'STRENGTH', tgh:'TOUGHNESS',
  ag:'AGILITY', int:'INTELLIGENCE', per:'PERCEPTION', wil:'WILLPOWER', fel:'FELLOWSHIP'
};

const SKILLS = [
  { key:'athletics',       name:'Athletics',       char:'str' },
  { key:'awareness',       name:'Awareness',       char:'per' },
  { key:'dexterity',       name:'Dexterity',       char:'ag'  },
  { key:'discipline',      name:'Discipline',      char:'wil' },
  { key:'fortitude',       name:'Fortitude',       char:'tgh' },
  { key:'intuition',       name:'Intuition',       char:'per' },
  { key:'linguistics',     name:'Linguistics',     char:'int' },
  { key:'logic',           name:'Logic',           char:'int' },
  { key:'lore',            name:'Lore',            char:'int' },
  { key:'medicae',         name:'Medicae',         char:'int' },
  { key:'melee',           name:'Melee',           char:'ws'  },
  { key:'navigation',      name:'Navigation',      char:'int' },
  { key:'piloting',        name:'Piloting',        char:'ag'  },
  { key:'presence',        name:'Presence',        char:'wil' },
  { key:'psychic_mastery', name:'Psychic Mastery', char:'wil' },
  { key:'ranged',          name:'Ranged',          char:'bs'  },
  { key:'rapport',         name:'Rapport',         char:'fel' },
  { key:'reflexes',        name:'Reflexes',        char:'ag'  },
  { key:'stealth',         name:'Stealth',         char:'ag'  },
  { key:'tech',            name:'Tech',            char:'int' }
];

const FACTIONS = [
  'Adeptus Astra Telepathica', 'Adeptus Mechanicus', 'Administratum',
  'Astra Militarum', 'Adeptus Ministorum', 'Inquisition',
  'Navis Imperialis', 'Rogue Trader Dynasties', 'Infractionists'
];

const INFLUENCE_ATTITUDES = {
  '5':'HONOURED', '4':'PRIZED', '3':'TRUSTED', '2':'LIKED', '1':'WELCOMED',
  '0':'NEUTRAL', '-1':'UNWELCOME', '-2':'DISTRUSTED', '-3':'DESPISED',
  '-4':'VILIFIED', '-5':'HUNTED'
};

// XP cost for each characteristic advance step, keyed by the value being advanced TO
function charAdvXP(newVal) {
  if (newVal <= 25) return 20;
  if (newVal <= 30) return 25;
  if (newVal <= 35) return 30;
  if (newVal <= 40) return 40;
  if (newVal <= 45) return 60;
  if (newVal <= 50) return 80;
  if (newVal <= 55) return 110;
  if (newVal <= 60) return 140;
  if (newVal <= 65) return 180;
  if (newVal <= 70) return 220;
  if (newVal <= 75) return 270;
  return 320;
}

// Skill advance XP costs indexed by advance number (1–4)
const SKILL_XP = [0, 50, 100, 150, 200];

// Level-up panel cost tables
const CHAR_ADVANCE_COSTS = [20, 25, 30, 40, 60, 80, 110, 140];
const SKILL_ADVANCE_COSTS_LU = [50, 100, 150, 200];

const TALENT_DATA = {
  'Ever Vigilant': 'You are always alert. You cannot be surprised. When you are ambushed, you may make a Reflexes Test; on a success you act normally in the first round.',
  'Drilled': 'You have undergone military conditioning. You may re-roll failed Discipline (Fear) Tests. Once per session you may spend a Fate point to have all allies in earshot re-roll a failed Discipline Test.',
  'Faithful (Imperial Cult)': 'Your faith in the God-Emperor is unwavering. Once per combat, when you or an ally within Short Range would fail a Discipline (Fear) Test, you may declare a rousing prayer — they may re-roll. You gain +1 SL on Tests to resist daemonic possession or corruption.',
  'Void Legs': 'You are accustomed to life in the void. You suffer no penalties in zero-gravity or vacuum environments and automatically succeed on Navigation (Void) Tests for standard travel.',
  'Dealmaker': 'You know how commerce really works. You gain +2 SL on all Rapport (Haggle) Tests and may treat Rare items as Scarce for the purpose of Availability Tests.',
  'Well-prepared': 'You always have what you need. Once per session, you may produce any Common item or tool as if you had it on your person.',
  'Data Delver': 'You excel at extracting information from records and networks. You gain +2 SL on Logic (Investigation) and Lore (Academics) Tests. You may make a Tech (Security) Test to access restricted data as if you had the appropriate clearance.',
  'Psyker': 'You are a psyker, sensitive to the warp. You may take Advances in Psychic Mastery and use psychic powers. Every use of a psychic power requires a Warp Charge Test with the risk of Perils of the Warp.',
  'Sanctioned Psyker': 'Requires: Psyker. You have been sanctioned by the Adeptus Astra Telepathica. You are less likely to draw unwanted attention when using psychic powers, and NPCs react to you as a licensed psyker rather than a rogue one.',
  'Blank': 'You carry the Pariah Gene and have no presence in the warp. You automatically succeed any Opposed Test to resist a psychic power. Ordinary humans find your presence disturbing. Fellowship Tests against warp-connected creatures are made at Disadvantage.',
  'Condemn the Witch': 'You can sense and suppress psykers. You may make a Challenging (+0) Willpower Test to force a psyker within Short Range to expend an additional Warp Charge when attempting to manifest a power.',
  'Mental Fortress': 'Your mind is a bastion against warp intrusion. You gain +2 SL on all Discipline (Psychic) Tests and may re-roll failures once.',
  'Fated': "The Emperor's hand guides you. You gain one additional Fate point (above the standard 3). If a Talent raises your maximum Fate, this Talent stacks.",
  'Tenacious': 'You refuse to fall. When you would be reduced to 0 Wounds or fewer, make a Challenging (+0) Fortitude (Pain) Test. On a success, you remain conscious at 1 Wound.',
  'Flagellant': 'Through pain you find clarity. When you voluntarily take damage (from flagellation or other self-mortification), you gain +1 SL on your next Discipline (Fear or Psychic) Test.',
  'Frenzy': 'You can enter a battle-rage. As a Free Action, declare Frenzy. While Frenzied: +2 SL on all Melee Tests, ignore all Fatigued penalties, immune to Fear. However: you must attack the nearest enemy and cannot use Ranged weapons or retreat.',
  'Hatred': 'Choose a specific group (e.g. heretics, mutants, xenos, a specific faction). Against this group, you gain +2 SL on all attack Tests and may re-roll failed Discipline (Fear) Tests when facing them. This Talent may be taken multiple times for different groups.',
  'Icon Bearer': 'You carry a holy standard or sigil. All allies within Short Range who can see the icon gain +1 SL on Discipline (Fear) Tests.',
  'Martyrdom': 'Your willingness to die for the cause inspires others. When you are critically wounded or reduced to zero wounds, all allies within Short Range immediately gain +1 Superiority.',
  'Acute Sense': 'One of your primary senses is extraordinarily developed. Choose a sense. You may make Perception Tests to detect details normally imperceptible with that sense.',
  'Adrenaline Acceleration': 'Your speed is Fast when Fleeing or being Pursued.',
  'Ambidextrous': 'You suffer no penalty for off-hand actions and may wield a one-handed melee weapon and a pistol simultaneously without penalty.',
  'Artistic': 'You have a developed artistic talent. Choose one: Literature (+2 SL to reading/writing Tests), Painting (+2 SL to painting/drawing), Music (+2 SL to singing/performing), Theatre (+2 SL to acting/performing).',
  'Eidetic Memory': 'You have total recall. You never forget anything you have experienced. You gain +2 SL on all Lore Tests to recall information you have personally encountered.',
  'Chirurgeon': 'Your medical skills are exceptional. You gain +2 SL on Medicae Tests and may attempt surgery without the penalty for improvised conditions.',
  'Burglar': 'You are skilled at unlawful entry. You gain +2 SL on Dexterity (Lock Picking) and Athletics (Climbing) Tests when breaking and entering.',
  'Skulker': 'You are an expert at moving unseen. You gain +2 SL on Stealth (Hide) and Stealth (Move Silently) Tests.',
  'Unremarkable': 'You blend into crowds effortlessly. Tests to identify you from a description or recall your appearance are made at Disadvantage by others.',
  'Secret Identity': 'You maintain a convincing alternate identity. Once established (requires downtime and GM approval), NPCs who encounter your alias will not connect it to your true identity without extraordinary evidence.',
  'Deadeye': 'You are a crack shot. When you target a specific location with the Target Location Action, you do not suffer the normal Disadvantage on the attack.',
  'Disarm': 'You can strip weapons from opponents. After winning a melee Opposed Test by 3+ SL, instead of dealing damage you may disarm your opponent.',
  'Duellist': 'You excel in one-on-one combat. When fighting a single opponent in melee with no other combatants Engaged with either of you, you gain +1 SL on all Melee Tests.',
  'Tactical Movement': 'You can move and fight simultaneously. You may move up to Short Range as part of a melee Attack Action (in addition to your normal move).',
  'Lawbringer': 'You are versed in Imperial law and have some authority to enforce it. You gain +2 SL on Presence (Interrogation) Tests and may invoke Imperial statutes to demand compliance from citizens.',
  'Gothic Gibberish': 'You can converse in technical, religious, or bureaucratic jargon so dense that opponents in social exchanges are confused. Once per scene, you may force an opponent to make a Challenging (+0) Intelligence Test or suffer Disadvantage on their next social Test against you.',
  'Distracting': 'You are adept at misdirection. When assisting an ally on a social or stealth Test, they gain +2 SL instead of the normal Advantage.',
  'Gallows Humour': 'Your dark wit steadies nerves. Once per combat, you may make a quip — all allies who can hear you may re-roll a failed Discipline (Fear) Test with a +10 bonus.',
  'Lickspittle': 'You know how to make yourself invaluable to powerful figures. You gain +2 SL on Rapport (Charm) and Rapport (Inquiry) Tests when dealing with individuals of higher social standing or Influence.',
  'Familiar Terrain': 'Choose a specific environment type (hive underhive, void stations, agri-worlds, etc.). In this environment you gain +2 SL on all Navigation and Awareness Tests.',
  'Read Lips': 'You can read lips at Close Range. With a successful Challenging (+0) Awareness Test you understand speech you cannot hear.',
  'Devoted Servant': "Your dedication to your Patron is absolute. Once per session, you may re-roll any Test made directly in service of your Patron's interests.",
  'Overseer': 'You are skilled at managing others. All characters under your direct command gain +1 SL on Extended Tests that you are overseeing.',
  'Briber': "You know how to make payments disappear. You may attempt to bribe NPCs using the Rapport (Haggle) Skill instead of requiring social finesse. On success, the NPC's attitude improves by 1 step.",
  'Inheritor': 'Requires: specific bloodline or GM approval. You are of the Navis Nobilite. You may take the Navigation (Warp) specialisation and survive in the warp without additional protections.',
  'Forbidden Knowledge': 'Choose a subject (aliens, psykers, Daemons, immaterium, etc.). You may take Lore (Forbidden) Advances in that subject. You gain +2 SL on all Tests involving that knowledge.',
  'Two-handed Cleave': 'When fighting with a two-handed weapon, a successful Melee Attack at +3 SL or more hits all enemies within Immediate Range simultaneously.'
};


// ============================================================
// STATE — active slot
// ============================================================

const LS_PREFIX      = 'dataslate_operative_';
const LS_ACTIVE_SLOT = 'dataslate_active_slot';
const SLOT_COUNT     = 5;

// Read active slot from localStorage; default to 0
let currentSlot = parseInt(localStorage.getItem(LS_ACTIVE_SLOT) || '0') || 0;

function setActiveSlot(i) {
  currentSlot = i;
  localStorage.setItem(LS_ACTIVE_SLOT, String(i));
}


// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================

function getSlotData(slot) {
  const raw = localStorage.getItem(LS_PREFIX + slot);
  if (!raw) return defaultSlotData();
  try { return JSON.parse(raw); } catch(e) { return defaultSlotData(); }
}

function saveSlotData(slot, data) {
  localStorage.setItem(LS_PREFIX + slot, JSON.stringify(data));
}

function defaultSlotData() {
  const chars = {};
  CHARACTERISTICS.forEach(c => { chars[c.key] = { base: 20, adv: 0, temp: 0 }; });
  const skills = {};
  SKILLS.forEach(s => { skills[s.key] = 0; });
  const inf = {};
  FACTIONS.forEach(f => { inf[f] = 0; });
  return {
    name: '', origin: '', faction: '', role: '',
    age: '', gender: '', build: '', hand: 'R',
    xp: 0,
    vitals: {
      wounds_cur: 0, wounds_max: 0,
      crit_cur: 0,   crit_max: 0,
      fate_cur: 3,   fate_max: 3,
      corruption: 0, speed: 'Normal',
      enc_cur: 0,    enc_max: 0,
      solars: 0,     initiative: 0,
      superiority: 0
    },
    warp_charge: 0,
    chars,
    skills,
    specs:       [],
    talents:     [],
    influence:   inf,
    weapons:     [],
    armour:      { head:0, body:0, larm:0, rarm:0, lleg:0, rleg:0 },
    equipment:   [],
    augmetics:   [],
    powers:      [],
    connections: [],
    goal_short: '', goal_long: '',
    background: '', notes: ''
  };
}

function currentData()        { return getSlotData(currentSlot); }
function saveCurrentData(d)   { saveSlotData(currentSlot, d); }


// ============================================================
// SAVE HELPERS  (write a single field or sub-field)
// ============================================================

function saveField(key, val) {
  const d = currentData();
  d[key] = val;
  saveCurrentData(d);
}

function saveVital(key, val) {
  const d = currentData();
  d.vitals[key] = isNaN(val) ? val : (val === '' ? 0 : Number(val));
  saveCurrentData(d);
}

function saveArmour(loc, val) {
  const d = currentData();
  if (!d.armour) d.armour = {};
  d.armour[loc] = Number(val) || 0;
  saveCurrentData(d);
}


// ============================================================
// PURE LOGIC (no DOM access)
// ============================================================

function getCharTotal(d, charKey) {
  const cd = d.chars?.[charKey] || { base:20, adv:0, temp:0 };
  return (Number(cd.base)||20) + (Number(cd.adv)||0) + (Number(cd.temp)||0);
}

function calcSpentXP(d) {
  let spent = 0;
  // Skill advances
  SKILLS.forEach(s => {
    const adv = d.skills?.[s.key] || 0;
    for (let i = 0; i < adv; i++) { spent += SKILL_XP[i + 1]; }
  });
  // Spec advances
  (d.specs || []).forEach(sp => {
    const adv = sp.adv || 0;
    for (let i = 0; i < adv; i++) { spent += SKILL_XP[i + 1]; }
  });
  // Talents — 100 XP each
  spent += (d.talents || []).length * 100;
  return spent;
}

function calcDerivedStats(d) {
  const strB = Math.floor(getCharTotal(d, 'str') / 10);
  const tghB = Math.floor(getCharTotal(d, 'tgh') / 10);
  const wilB = Math.floor(getCharTotal(d, 'wil') / 10);
  const perB = Math.floor(getCharTotal(d, 'per') / 10);
  const agB  = Math.floor(getCharTotal(d, 'ag')  / 10);
  return {
    wounds_max:  strB + (2 * tghB) + wilB,
    crit_max:    tghB,
    initiative:  perB + agB,
    enc_max:     strB + tghB
  };
}

function hasPsykerTalent(d) {
  return (d.talents || []).some(t => (t.name || '').toLowerCase() === 'psyker');
}


// ============================================================
// DOM UTILITY  (safe getElementById wrapper)
// ============================================================

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}
