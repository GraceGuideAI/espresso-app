const form = document.getElementById("dialin-form");
const guidanceList = document.getElementById("guidance");
const nextAdjustment = document.getElementById("next-adjustment");
const getGuidanceButton = document.getElementById("get-guidance");
const resetButton = document.getElementById("reset");
const shareButton = document.getElementById("share");
const outputCard = document.getElementById("output-card");

const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const viewLinks = Array.from(document.querySelectorAll("[data-view-target]"));
const views = Array.from(document.querySelectorAll(".app-view"));

const recipesForm = document.getElementById("recipes-form");
const generateDrinksButton = document.getElementById("generate-drinks");
const drinksStatus = document.getElementById("drinks-status");
const drinksGrid = document.getElementById("drinks-grid");
const recipeDetail = document.getElementById("recipe-detail");
const recipeTitle = document.getElementById("recipe-title");
const recipeHeroIllustration = document.getElementById("recipe-hero-illustration");
const recipeOutput = document.querySelector(".recipe-output");

const setupSections = Array.from(document.querySelectorAll('.setup-section'));
const progressDots = Array.from(document.querySelectorAll('.progress-dot'));
const recipeSummary = document.getElementById("recipe-summary");
const recipeSteps = document.getElementById("recipe-steps");
const summaryDose = document.getElementById("summary-dose");
const summaryYield = document.getElementById("summary-yield");
const summaryTime = document.getElementById("summary-time");
const summaryRatio = document.getElementById("summary-ratio");
const summaryShot = document.getElementById("summary-shot");
const summaryDoseRing = document.getElementById("summary-dose-ring");
const summaryYieldRing = document.getElementById("summary-yield-ring");
const summaryTimeRing = document.getElementById("summary-time-ring");
const startBrewingButton = document.getElementById("start-brewing");
const brewingMode = document.getElementById("brewing-mode");
const brewingOverlay = document.getElementById("brewing-overlay");
const brewingExit = document.getElementById("brewing-exit");
const brewingPrev = document.getElementById("brewing-prev");
const brewingNext = document.getElementById("brewing-next");
const brewingTitle = document.getElementById("brewing-title");
const brewingText = document.getElementById("brewing-text");
const brewingProgress = document.getElementById("brewing-progress");
const brewingIcon = document.getElementById("brewing-icon");

const segmentedControls = Array.from(document.querySelectorAll(".segmented-control"));
let segmentHighlightTimer = null;

const machineTypeInputs = Array.from(document.querySelectorAll('input[name="machine-type"]'));
const grinderTypeInputs = Array.from(document.querySelectorAll('input[name="grinder-type"]'));
const milkFrothingInputs = Array.from(document.querySelectorAll('input[name="milk-frothing"]'));
const recipeMachineSelect = document.getElementById("recipe-machine");
const latteArtInput = document.getElementById("latte-art");

const roastLevelInputs = Array.from(document.querySelectorAll('input[name="roast-level"]'));
const grindRangeInputs = Array.from(document.querySelectorAll('input[name="grind-range"]'));
const freshnessInputs = Array.from(document.querySelectorAll('input[name="bean-freshness"]'));
const waterTypeInputs = Array.from(document.querySelectorAll('input[name="water-type"]'));

const defaults = {
  machine: "Breville Bambino",
  basket: 18,
  dose: 18,
  yield: 36,
  time: 28,
  roast: "medium",
  grinder: "Baratza Encore ESP",
};

const fields = {
  machine: document.getElementById("machine"),
  basket: document.getElementById("basket"),
  dose: document.getElementById("dose"),
  yield: document.getElementById("yield"),
  time: document.getElementById("time"),
  roast: document.getElementById("roast"),
  grinder: document.getElementById("grinder"),
};

const machineDefaultsByType = {
  "semi-auto": "Semi-Auto (Generic)",
  automatic: "Automatic (Generic)",
  "super-auto": "Super-Auto (Generic)",
};

const machineProfiles = {
  "Semi-Auto (Generic)": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Automatic (Generic)": { type: "automatic", grinder: "burr", milk: "panarello", basket: 18 },
  "Super-Auto (Generic)": { type: "super-auto", grinder: "built-in", milk: "carafe", basket: 14 },
  "DeLonghi Magnifica Evo (non-LatteCrema version)": { type: "super-auto", grinder: "built-in", milk: "panarello", basket: 14 },
  "Breville Bambino": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Gaggia Classic Pro": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Lelit Anna": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Rancilio Silvia": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Smeg Semi-Pro": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Lelit MaraX": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Rocket Appartamento": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Miele CM6360": { type: "super-auto", grinder: "built-in", milk: "carafe", basket: 14 },
  "La Marzocco Linea Mini": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
};

// Drink illustration SVGs - cute minimalist cup drawings
const drinkIllustrations = {
  espresso: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="espressoCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
        <linearGradient id="cremaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d4a574"/>
          <stop offset="100%" stop-color="#8b5a2b"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="68" rx="22" ry="4" fill="#d4c4b5" opacity="0.4"/>
      <path d="M12 30 L16 65 Q30 70 44 65 L48 30" fill="url(#espressoCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="30" rx="18" ry="6" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="38" rx="14" ry="4" fill="url(#cremaGrad)"/>
      <ellipse cx="30" cy="36" rx="12" ry="3" fill="#d4a574" opacity="0.6"/>
      <path d="M48 36 Q58 36 58 46 Q58 56 48 56" fill="none" stroke="#c9b8a8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="26" cy="32" rx="4" ry="1.5" fill="#fff" opacity="0.4"/>
    </svg>
  `,
  doppio: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="doppioCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="70" rx="20" ry="4" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 26 L17 66 Q30 71 43 66 L46 26" fill="url(#doppioCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="26" rx="16" ry="5" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="42" rx="12" ry="4" fill="#8b5a2b"/>
      <ellipse cx="30" cy="38" rx="12" ry="3" fill="#d4a574"/>
      <ellipse cx="30" cy="36" rx="10" ry="2.5" fill="#c9956c" opacity="0.7"/>
      <path d="M46 32 Q56 32 56 44 Q56 56 46 56" fill="none" stroke="#c9b8a8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="26" cy="28" rx="4" ry="1.5" fill="#fff" opacity="0.4"/>
    </svg>
  `,
  americano: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="americanoGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8f0" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#f0e6dc" stop-opacity="0.8"/>
        </linearGradient>
        <linearGradient id="americanoLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6b4423"/>
          <stop offset="100%" stop-color="#3d2314"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="74" rx="18" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 14 L18 72 Q30 76 42 72 L46 14" fill="url(#americanoGlass)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="14" rx="16" ry="4" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <path d="M19 50 Q30 52 41 50 L42 72 Q30 76 18 72 Z" fill="url(#americanoLiquid)"/>
      <ellipse cx="30" cy="50" rx="11" ry="3" fill="#8b5a2b"/>
      <path d="M22 18h16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `,
  cappuccino: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="cappCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
        <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffaf5"/>
          <stop offset="100%" stop-color="#f5e6d8"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="72" rx="24" ry="4" fill="#d4c4b5" opacity="0.4"/>
      <path d="M8 32 L12 68 Q30 74 48 68 L52 32" fill="url(#cappCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="32" rx="22" ry="7" fill="url(#foamGrad)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="54" rx="16" ry="5" fill="#3d2314"/>
      <ellipse cx="30" cy="46" rx="17" ry="5" fill="#f5e6d8"/>
      <ellipse cx="30" cy="34" rx="18" ry="5" fill="url(#foamGrad)"/>
      <path d="M24 34 Q30 40 36 34" fill="none" stroke="#d4a574" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      <circle cx="30" cy="36" r="3" fill="#c9956c" opacity="0.4"/>
      <path d="M52 38 Q64 38 64 52 Q64 66 52 66" fill="none" stroke="#c9b8a8" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="24" cy="30" rx="5" ry="2" fill="#fff" opacity="0.5"/>
    </svg>
  `,
  latte: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="latteGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8f0" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#f0e6dc" stop-opacity="0.75"/>
        </linearGradient>
        <linearGradient id="latteMilk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff5e6"/>
          <stop offset="100%" stop-color="#f5e0c8"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="76" rx="16" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M16 10 L19 74 Q30 78 41 74 L44 10" fill="url(#latteGlass)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="10" rx="14" ry="4" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <rect x="20" y="60" width="20" height="14" rx="2" fill="#3d2314"/>
      <rect x="20" y="24" width="20" height="36" rx="2" fill="url(#latteMilk)"/>
      <ellipse cx="30" cy="18" rx="10" ry="3" fill="#fffaf5"/>
      <path d="M26 18 Q30 22 34 18" fill="none" stroke="#d4a574" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M22 14h16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `,
  "flat white": `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="fwCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="70" rx="22" ry="4" fill="#d4c4b5" opacity="0.4"/>
      <path d="M10 30 L14 66 Q30 72 46 66 L50 30" fill="url(#fwCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="30" rx="20" ry="6" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="52" rx="14" ry="4" fill="#3d2314"/>
      <ellipse cx="30" cy="40" rx="15" ry="5" fill="#fff5e6"/>
      <ellipse cx="30" cy="34" rx="16" ry="4" fill="#fffaf5"/>
      <path d="M26 34c2 3 6 3 8 0" fill="none" stroke="#c9956c" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M50 36 Q62 36 62 50 Q62 64 50 64" fill="none" stroke="#c9b8a8" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="24" cy="30" rx="5" ry="2" fill="#fff" opacity="0.5"/>
    </svg>
  `,
  cortado: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="cortadoGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8f0" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#f0e6dc" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="68" rx="18" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 24 L17 66 Q30 70 43 66 L46 24" fill="url(#cortadoGlass)" stroke="#c9b8a8" stroke-width="1.5"/>
      <path d="M14 24 L15 34 M46 24 L45 34 M14 44 L15 54 M46 44 L45 54" stroke="#c9b8a8" stroke-width="1" opacity="0.4"/>
      <ellipse cx="30" cy="24" rx="16" ry="4" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <rect x="18" y="48" width="24" height="18" rx="2" fill="#3d2314"/>
      <rect x="18" y="32" width="24" height="16" rx="2" fill="#fff5e6"/>
      <ellipse cx="30" cy="30" rx="12" ry="3" fill="#fffaf5"/>
      <path d="M24 14h12" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `,
  macchiato: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="macCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="66" rx="18" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 32 L17 62 Q30 67 43 62 L46 32" fill="url(#macCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="32" rx="16" ry="5" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="46" rx="12" ry="4" fill="#3d2314"/>
      <ellipse cx="30" cy="42" rx="10" ry="3" fill="#8b5a2b"/>
      <ellipse cx="30" cy="36" rx="8" ry="4" fill="#fffaf5"/>
      <circle cx="30" cy="36" r="3" fill="#f5e6d8"/>
      <path d="M46 38 Q56 38 56 48 Q56 58 46 58" fill="none" stroke="#c9b8a8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="26" cy="30" rx="4" ry="1.5" fill="#fff" opacity="0.4"/>
    </svg>
  `,
  mocha: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="mochaMug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
        <linearGradient id="mochaLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5c3d2e"/>
          <stop offset="100%" stop-color="#2d1810"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="74" rx="20" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M12 18 L15 70 Q30 76 45 70 L48 18" fill="url(#mochaMug)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="18" rx="18" ry="5" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <rect x="16" y="40" width="28" height="30" rx="3" fill="url(#mochaLiquid)"/>
      <ellipse cx="30" cy="28" rx="12" ry="6" fill="#fffaf5"/>
      <ellipse cx="30" cy="26" rx="10" ry="5" fill="#fff"/>
      <path d="M26 24c2-2 6-2 8 0" fill="none" stroke="#5c3d2e" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <circle cx="28" cy="28" r="2" fill="#5c3d2e" opacity="0.3"/>
      <circle cx="32" cy="26" r="1.5" fill="#5c3d2e" opacity="0.3"/>
      <path d="M48 26 Q60 26 60 42 Q60 58 48 58" fill="none" stroke="#c9b8a8" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="25" cy="20" rx="5" ry="2" fill="#fff" opacity="0.5"/>
    </svg>
  `,
  affogato: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="affogatoGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8f0" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#f0e6dc" stop-opacity="0.8"/>
        </linearGradient>
        <linearGradient id="gelatoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffef8"/>
          <stop offset="100%" stop-color="#f5e6d0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="74" rx="18" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 20 L18 72 Q30 76 42 72 L46 20" fill="url(#affogatoGlass)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="20" rx="16" ry="4" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <rect x="19" y="50" width="22" height="22" rx="2" fill="#3d2314"/>
      <ellipse cx="30" cy="50" rx="10" ry="3" fill="#6b4423"/>
      <ellipse cx="30" cy="32" rx="12" ry="10" fill="url(#gelatoGrad)"/>
      <ellipse cx="30" cy="28" rx="10" ry="8" fill="#fffef8"/>
      <path d="M24 30c3-4 9-4 12 0" fill="none" stroke="#e8dcd0" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="26" cy="26" rx="3" ry="2" fill="#fff" opacity="0.6"/>
      <path d="M38 34 L44 28" stroke="#6b4423" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      <path d="M22 14h16" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `,
  ristretto: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="ristCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="66" rx="18" ry="3" fill="#d4c4b5" opacity="0.4"/>
      <path d="M14 34 L17 62 Q30 67 43 62 L46 34" fill="url(#ristCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="34" rx="16" ry="5" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="50" rx="12" ry="3" fill="#2d1810"/>
      <ellipse cx="30" cy="46" rx="11" ry="3" fill="#5c3d2e"/>
      <ellipse cx="30" cy="42" rx="10" ry="3" fill="#8b5a2b"/>
      <path d="M46 40 Q56 40 56 50 Q56 58 46 58" fill="none" stroke="#c9b8a8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="26" cy="32" rx="4" ry="1.5" fill="#fff" opacity="0.4"/>
    </svg>
  `,
  default: `
    <svg class="drink-cup-svg" viewBox="0 0 60 80" aria-hidden="true">
      <defs>
        <linearGradient id="defCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="#e8dcd0"/>
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="70" rx="20" ry="4" fill="#d4c4b5" opacity="0.4"/>
      <path d="M12 28 L16 66 Q30 72 44 66 L48 28" fill="url(#defCup)" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="28" rx="18" ry="6" fill="#fff8f0" stroke="#c9b8a8" stroke-width="1.5"/>
      <ellipse cx="30" cy="50" rx="14" ry="4" fill="#3d2314"/>
      <ellipse cx="30" cy="44" rx="14" ry="4" fill="#8b5a2b"/>
      <path d="M48 34 Q60 34 60 48 Q60 62 48 62" fill="none" stroke="#c9b8a8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="25" cy="26" rx="5" ry="2" fill="#fff" opacity="0.4"/>
    </svg>
  `
};

const getDrinkIllustration = (drinkName) => {
  const name = (drinkName || "").toLowerCase();
  if (name.includes("espresso") && !name.includes("doppio")) return drinkIllustrations.espresso;
  if (name.includes("doppio") || name.includes("double")) return drinkIllustrations.doppio;
  if (name.includes("americano") || name.includes("long black")) return drinkIllustrations.americano;
  if (name.includes("cappuccino")) return drinkIllustrations.cappuccino;
  if (name.includes("latte") && !name.includes("flat")) return drinkIllustrations.latte;
  if (name.includes("flat white")) return drinkIllustrations["flat white"];
  if (name.includes("cortado")) return drinkIllustrations.cortado;
  if (name.includes("macchiato")) return drinkIllustrations.macchiato;
  if (name.includes("mocha")) return drinkIllustrations.mocha;
  if (name.includes("affogato")) return drinkIllustrations.affogato;
  if (name.includes("ristretto")) return drinkIllustrations.ristretto;
  return drinkIllustrations.default;
};

const machineCapabilitiesByType = {
  "semi-auto": { autoGrind: false, autoDose: false, grindStyle: "manual" },
  automatic: { autoGrind: false, autoDose: true, grindStyle: "manual" },
  "super-auto": { autoGrind: true, autoDose: true, grindStyle: "auto" },
};

let machineModelTouched = false;

const target = {
  ratio: 2.0,
  timeMin: 25,
  timeMax: 30,
};

let availableDrinks = [];
let activeDrinkId = null;
let currentRecipeContext = null;
let brewingSteps = [];
let brewingStepIndex = 0;

const formatNumber = (value, digits = 1) => {
  if (!Number.isFinite(value)) return "-";
  return Number(value).toFixed(digits);
};

const formatOz = (value, suffix = "fl oz") => {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value, 1)} ${suffix}`;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getRecipeHeroMarkup = (drinkName = "") => {
  const name = drinkName.toLowerCase();
  const cupBase = (layers) => `
    <svg class="recipe-hero-svg" viewBox="0 0 240 180" aria-hidden="true">
      <defs>
        <linearGradient id="cupGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#f2e6da" stop-opacity="0.8" />
        </linearGradient>
        <linearGradient id="latteFoam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fff8ef" />
          <stop offset="100%" stop-color="#f1dcc6" />
        </linearGradient>
      </defs>
      <rect x="62" y="20" width="116" height="140" rx="28" fill="url(#cupGlass)" />
      <rect x="72" y="30" width="96" height="120" rx="22" fill="#ffffff" opacity="0.85" />
      ${layers}
      <rect x="62" y="20" width="116" height="140" rx="28" fill="none" stroke="#d9c7b8" stroke-width="2" />
      <path d="M86 34h60" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round" />
    </svg>
  `;

  if (name.includes("cappuccino")) {
    return cupBase(`
      <rect x="78" y="118" width="84" height="34" rx="12" fill="#2d1810" />
      <rect x="78" y="84" width="84" height="34" rx="12" fill="#f1dbc6" />
      <rect x="78" y="52" width="84" height="34" rx="12" fill="url(#latteFoam)" />
      <path d="M82 52c8 6 14 4 20 0s12-6 20 0 14 6 20 0" stroke="#fffaf0" stroke-width="6" stroke-linecap="round" />
    `);
  }
  if (name.includes("latte")) {
    return cupBase(`
      <rect x="78" y="126" width="84" height="26" rx="10" fill="#2d1810" />
      <rect x="78" y="56" width="84" height="70" rx="20" fill="#fff5e6" />
      <circle cx="120" cy="68" r="18" fill="#f7dcc4" opacity="0.6" />
      <path d="M110 68c6 6 14 6 20 0" stroke="#f0c9a8" stroke-width="3" stroke-linecap="round" />
    `);
  }
  if (name.includes("cortado")) {
    return cupBase(`
      <rect x="78" y="102" width="84" height="48" rx="14" fill="#2d1810" />
      <rect x="78" y="58" width="84" height="44" rx="14" fill="#fff5e6" />
    `);
  }
  if (name.includes("flat white")) {
    return cupBase(`
      <rect x="78" y="112" width="84" height="38" rx="14" fill="#2d1810" />
      <rect x="78" y="58" width="84" height="54" rx="16" fill="#fff5e6" />
      <path d="M104 70c8 8 24 8 32 0" stroke="#f1d1b6" stroke-width="3" stroke-linecap="round" />
    `);
  }
  if (name.includes("americano") || name.includes("long black")) {
    return cupBase(`
      <rect x="78" y="80" width="84" height="70" rx="16" fill="#2d1810" />
      <rect x="78" y="70" width="84" height="10" rx="6" fill="#8b5a2b" />
    `);
  }
  if (name.includes("ristretto")) {
    return cupBase(`
      <rect x="78" y="116" width="84" height="34" rx="12" fill="#2d1810" />
      <rect x="78" y="108" width="84" height="6" rx="4" fill="#8b5a2b" />
    `);
  }
  return cupBase(`
    <rect x="78" y="112" width="84" height="38" rx="12" fill="#2d1810" />
    <rect x="78" y="104" width="84" height="6" rx="4" fill="#8b5a2b" />
  `);
};

const updateSegmentHighlight = (control) => {
  if (!control) return;
  let highlight = control.querySelector(".segmented-highlight");
  if (!highlight) {
    highlight = document.createElement("span");
    highlight.className = "segmented-highlight";
    control.insertBefore(highlight, control.firstChild);
  }

  const checked = control.querySelector("input:checked + .pill-option");
  if (!checked) return;
  const controlRect = control.getBoundingClientRect();
  const optionRect = checked.getBoundingClientRect();
  const left = optionRect.left - controlRect.left;

  highlight.style.width = `${optionRect.width}px`;
  highlight.style.transform = `translateX(${left}px)`;
};

const initSegmentHighlights = () => {
  segmentedControls.forEach((control) => updateSegmentHighlight(control));
};

const parseDoseFromBeanType = (beanType) => {
  if (!beanType) return null;
  const match = beanType.match(/(\d+(?:\.\d+)?)\s*g/i);
  return match ? Number(match[1]) : null;
};

const setRingProgress = (element, value, max) => {
  if (!element || !Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return;
  }
  const progress = clamp(value / max, 0.12, 1);
  element.style.setProperty("--progress", progress.toFixed(2));
};

const stepIcons = {
  grind: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="3" />
      <circle cx="14" cy="14" r="3" />
      <path d="M16 6l4 4" />
    </svg>
  `,
  dose: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="4" />
      <path d="M8 12h8" />
    </svg>
  `,
  tamp: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12" />
      <rect x="9" y="7" width="6" height="10" rx="2" />
      <path d="M7 19h10" />
    </svg>
  `,
  brew: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="10" rx="3" />
      <path d="M7 19c3-3 7-3 10 0" />
    </svg>
  `,
  steam: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4c-2 3 1 5 1 7" />
      <path d="M13 4c-2 3 1 5 1 7" />
      <path d="M7 16h10" />
    </svg>
  `,
  pour: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h9l-2 4H5z" />
      <path d="M15 9c2 2 2 4 0 7" />
    </svg>
  `,
  serve: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="6" width="10" height="9" rx="3" />
      <path d="M16 8h2a2 2 0 0 1 0 4h-2" />
      <path d="M5 18h14" />
    </svg>
  `,
  default: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8v4l3 2" />
    </svg>
  `,
};

const getStepIconMarkup = (step, index) => {
  const text = (step || "").toLowerCase();
  if (text.includes("grind")) return stepIcons.grind;
  if (text.includes("dose") || text.includes("weigh") || text.includes("measure")) return stepIcons.dose;
  if (text.includes("tamp")) return stepIcons.tamp;
  if (text.includes("brew") || text.includes("pull") || text.includes("extract"))
    return stepIcons.brew;
  if (text.includes("steam") || text.includes("microfoam")) return stepIcons.steam;
  if (text.includes("pour") || text.includes("latte art")) return stepIcons.pour;
  if (text.includes("serve") || text.includes("enjoy")) return stepIcons.serve;
  const fallback = [stepIcons.grind, stepIcons.dose, stepIcons.tamp, stepIcons.brew, stepIcons.pour];
  return fallback[index % fallback.length] || stepIcons.default;
};

const getValues = () => ({
  machine: fields.machine.value,
  basket: clamp(Number(fields.basket.value) || 18, 10, 24),
  dose: clamp(Number(fields.dose.value) || 18, 10, 24),
  yield: clamp(Number(fields.yield.value) || 36, 20, 60),
  time: clamp(Number(fields.time.value) || 28, 10, 60),
  roast: fields.roast.value,
  grinder: fields.grinder.value,
});

const getCheckedValue = (inputs) => inputs.find((input) => input.checked)?.value;

const milkCapabilityLabels = {
  steam: "steam wand (manual)",
  panarello: "panarello wand (assisted)",
  carafe: "automatic carafe",
  cappuccinatore: "cappuccinatore (auto siphon)",
  manual: "manual frother (separate)",
  none: "no milk frothing"
};

const getRecipeValues = () => {
  const selectedMachine = recipeMachineSelect?.value || machineDefaultsByType["semi-auto"];
  const profile = machineProfiles[selectedMachine];
  const machineType = profile?.type || getCheckedValue(machineTypeInputs) || "semi-auto";
  const grinderType = profile?.grinder || getCheckedValue(grinderTypeInputs) || "burr";
  const milkFrothing = getCheckedValue(milkFrothingInputs) || profile?.milk || "steam";
  const basketSize = profile?.basket || 18;
  const machine = selectedMachine;
  const machineCapabilities = machineCapabilitiesByType[machineType] || machineCapabilitiesByType["semi-auto"];

  const grinderLabels = {
    burr: "Burr grinder",
    "built-in": "Built-in grinder",
    preground: "Pre-ground coffee",
  };

  const roastLevel = getCheckedValue(roastLevelInputs) || "medium";
  const grindRange = getCheckedValue(grindRangeInputs) || "fine";
  const freshness = getCheckedValue(freshnessInputs) || "0-7";
  const waterType = getCheckedValue(waterTypeInputs) || "filtered";

  const hasMilkCapability = milkFrothing !== "none";

  return {
    machine,
    grinder: grinderLabels[grinderType] || grinderLabels.burr,
    milkCapability: milkCapabilityLabels[milkFrothing] || "steam wand (manual)",
    milkType: milkFrothing,
    hasMilkCapability,
    beanType: `House blend (${basketSize}g basket)`,
    roast: roastLevel,
    grindRange,
    freshness,
    waterType,
    latteArt: Boolean(latteArtInput?.checked) && hasMilkCapability,
    machineCapabilities,
  };
};

const getGrindGuidance = ({ ratio, time }) => {
  if (time < target.timeMin || ratio > target.ratio + 0.2) {
    return "Grind finer to slow the flow and increase extraction.";
  }
  if (time > target.timeMax || ratio < target.ratio - 0.2) {
    return "Grind coarser to speed up the flow and reduce over-extraction.";
  }
  return "Grind looks close; keep the same grind setting.";
};

const getDoseYieldGuidance = ({ dose, yield: out, time }) => {
  const ratio = out / dose;
  if (ratio < target.ratio - 0.2) {
    return "Increase yield slightly or reduce dose to reach the target ratio.";
  }
  if (ratio > target.ratio + 0.2) {
    return "Reduce yield slightly or increase dose to pull closer to 1:2.";
  }
  if (time < target.timeMin) {
    return "If flavor is sharp, extend time by grinding finer or slightly increasing dose.";
  }
  if (time > target.timeMax) {
    return "If flavor is bitter, shorten time by grinding coarser or slightly reducing dose.";
  }
  return "Dose and yield are balanced; adjust in small steps if taste needs a tweak.";
};

const getNextAdjustment = ({ ratio, time }) => {
  if (time < target.timeMin || ratio > target.ratio + 0.2) {
    return "Next adjustment: Grind finer slightly.";
  }
  if (time > target.timeMax || ratio < target.ratio - 0.2) {
    return "Next adjustment: Grind coarser slightly.";
  }
  return "Next adjustment: Keep settings and adjust yield ±1–2 g if needed.";
};

const buildGuidance = (values) => {
  const ratio = values.yield / values.dose;
  const bullets = [];

  bullets.push(getGrindGuidance({ ratio, time: values.time }));
  bullets.push(
    getDoseYieldGuidance({
      dose: values.dose,
      yield: values.yield,
      time: values.time,
    })
  );

  bullets.push(
    `Target ratio: 1:${formatNumber(target.ratio, 1)} (current ${formatNumber(
      ratio,
      2
    )}).`
  );
  bullets.push(
    `Target time: ${target.timeMin}-${target.timeMax}s (current ${values.time}s).`
  );

  return bullets;
};

const renderGuidance = () => {
  const values = getValues();
  const bullets = buildGuidance(values);
  guidanceList.innerHTML = "";
  bullets.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    guidanceList.appendChild(li);
  });

  const ratio = values.yield / values.dose;
  nextAdjustment.textContent = getNextAdjustment({ ratio, time: values.time });
};

const setGuidanceVisibility = (isVisible) => {
  outputCard.classList.toggle("is-hidden", !isVisible);
  outputCard.setAttribute("aria-hidden", String(!isVisible));
  resetButton.disabled = !isVisible;
  shareButton.disabled = !isVisible;
};

const handleGetGuidance = () => {
  renderGuidance();
  setGuidanceVisibility(true);
};

const resetForm = () => {
  fields.machine.value = defaults.machine;
  fields.basket.value = defaults.basket;
  fields.dose.value = defaults.dose;
  fields.yield.value = defaults.yield;
  fields.time.value = defaults.time;
  fields.roast.value = defaults.roast;
  fields.grinder.value = defaults.grinder;
  setGuidanceVisibility(false);
};

const shareSummary = async () => {
  if (shareButton.disabled) return;
  const values = getValues();
  const ratio = values.yield / values.dose;
  const summary = [
    "Espresso Dial-In Summary",
    `Machine: ${values.machine}`,
    `Basket: ${formatNumber(values.basket, 1)} g`,
    `Dose: ${formatNumber(values.dose, 1)} g`,
    `Yield: ${formatNumber(values.yield, 1)} g`,
    `Time: ${values.time} s`,
    `Roast: ${values.roast}`,
    `Grinder: ${values.grinder}`,
    `Ratio: 1:${formatNumber(ratio, 2)}`,
    `Guidance: ${getNextAdjustment({ ratio, time: values.time })}`,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(summary);
    shareButton.textContent = "Copied";
    setTimeout(() => {
      shareButton.textContent = "Share";
    }, 1500);
  } catch (error) {
    shareButton.textContent = "Copy failed";
    setTimeout(() => {
      shareButton.textContent = "Share";
    }, 1500);
  }
};

const setSidebarOpen = (isOpen) => {
  document.body.classList.toggle("sidebar-open", isOpen);
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  document.getElementById("sidebar").setAttribute("aria-hidden", String(!isOpen));
};

const setActiveView = (viewId) => {
  views.forEach((view) => {
    const isActive = view.dataset.view === viewId;
    view.classList.toggle("is-active", isActive);
    view.setAttribute("aria-hidden", String(!isActive));
  });

  segmentedControls.forEach((control) => {
  control.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => updateSegmentHighlight(control));
  });
});

window.addEventListener("resize", () => {
  clearTimeout(segmentHighlightTimer);
  segmentHighlightTimer = setTimeout(initSegmentHighlights, 120);
});

initSegmentHighlights();

viewLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewTarget === viewId);
  });

  closeBrewingMode();
};

const setDrinksStatus = (message, isVisible = true) => {
  drinksStatus.textContent = message;
  drinksStatus.classList.toggle("is-hidden", !isVisible);
};

const setDrinksLoading = (isLoading) => {
  generateDrinksButton.disabled = isLoading;
  generateDrinksButton.textContent = isLoading
    ? "Generating Drinks..."
    : "Next: Get Recipes";
};

const cremaHeights = {
  Light: 4,
  Soft: 5,
  Balanced: 6,
  Integrated: 5,
  Defined: 7,
  Bold: 8,
  Silky: 6,
  Lifted: 6,
};

const foamHeights = {
  None: 0,
  Light: 6,
  Silky: 8,
  Glossy: 9,
  Thick: 12,
};

const getDrinkLayers = (drink) => {
  const total = drink.espressoOz + drink.milkOz + drink.waterOz || 1;
  const crema = drink.espressoOz > 0 ? cremaHeights[drink.crema] ?? 5 : 0;
  const foam = drink.milkOz > 0 ? foamHeights[drink.microfoam] ?? 6 : 0;
  const baseHeight = clamp((total / 10) * 90, 42, 92);
  const liquidHeight = Math.max(30, Math.min(baseHeight, 100 - crema - foam - 2));
  const scale = liquidHeight / total;

  const water = drink.waterOz * scale;
  const espresso = drink.espressoOz * scale;
  const milk = drink.milkOz * scale;

  const waterStop = water;
  const espressoStop = waterStop + espresso;
  const milkStop = espressoStop + milk;
  const cremaStop = milkStop + crema;
  const foamStop = cremaStop + foam;

  return {
    waterStop,
    espressoStop,
    milkStop,
    cremaStop,
    foamStop,
  };
};

const renderDrinks = (drinks) => {
  drinksGrid.innerHTML = "";
  drinks.forEach((drink) => {
    const card = document.createElement("article");
    card.className = "drink-card";
    card.dataset.drinkId = drink.id;

    const header = document.createElement("div");
    header.className = "drink-card__header";

    const title = document.createElement("div");
    title.className = "drink-title";
    title.innerHTML = `<h3>${drink.name}</h3><p class="drink-measurements">${formatOz(
      drink.espressoOz
    )} espresso · ${formatOz(drink.milkOz, "fl oz")} milk</p>`;

    header.appendChild(title);

    const hero = document.createElement("div");
    hero.className = "drink-hero";

    // Use the new SVG illustrations
    const illustrationWrapper = document.createElement("div");
    illustrationWrapper.className = "drink-illustration-wrapper";
    illustrationWrapper.innerHTML = getDrinkIllustration(drink.name);

    hero.appendChild(illustrationWrapper);

    const detailsId = `drink-details-${drink.id}`;

    const detailsToggle = document.createElement("button");
    detailsToggle.type = "button";
    detailsToggle.className = "drink-toggle";
    detailsToggle.setAttribute("aria-expanded", "false");
    detailsToggle.setAttribute("aria-controls", detailsId);
    detailsToggle.textContent = "Details";

    const detailsWrapper = document.createElement("div");
    detailsWrapper.className = "drink-details-wrapper";
    detailsWrapper.id = detailsId;

    const details = document.createElement("div");
    details.className = "drink-details";
    details.innerHTML = `
      <div><span>Crema</span><strong>${drink.crema}</strong></div>
      <div><span>Microfoam</span><strong>${drink.microfoam}</strong></div>
      <div><span>Latte Art</span><strong>${drink.latteArt ? "Yes" : "No"}</strong></div>
    `;

    detailsWrapper.appendChild(details);

    const actions = document.createElement("div");
    actions.className = "drink-actions";

    const action = document.createElement("button");
    action.type = "button";
    action.className = "drink-action";
    action.textContent = "Make this";

    actions.appendChild(detailsToggle);
    actions.appendChild(action);

    card.appendChild(header);
    card.appendChild(hero);
    card.appendChild(actions);
    card.appendChild(detailsWrapper);

    drinksGrid.appendChild(card);
  });
};

const resetRecipeSummary = () => {
  if (summaryDose) summaryDose.textContent = "--";
  if (summaryYield) summaryYield.textContent = "--";
  if (summaryTime) summaryTime.textContent = "--";
  if (summaryRatio) summaryRatio.textContent = "--";
  if (summaryShot) summaryShot.textContent = "--";
  if (summaryDoseRing) summaryDoseRing.style.setProperty("--progress", "0.12");
  if (summaryYieldRing) summaryYieldRing.style.setProperty("--progress", "0.12");
  if (summaryTimeRing) summaryTimeRing.style.setProperty("--progress", "0.12");
  if (startBrewingButton) startBrewingButton.disabled = true;
  if (recipeOutput) recipeOutput.classList.remove("is-ready");
};

const renderRecipe = (recipe, drink) => {
  recipeTitle.textContent = recipe.name || drink?.name || "Recipe";
  const summaryText =
    recipe.summary ||
    `${formatOz(drink.espressoOz)} espresso · ${formatOz(
      drink.milkOz,
      "fl oz"
    )} milk · ${formatOz(drink.waterOz, "fl oz")} water`;
  recipeSummary.textContent = summaryText;
  if (recipeHeroIllustration) {
    recipeHeroIllustration.innerHTML = getRecipeHeroMarkup(recipe.name || drink?.name || "");
  }

  const dose = parseDoseFromBeanType(currentRecipeContext?.beanType) || 18;
  const espressoOz = Number(recipe.espressoOz ?? drink?.espressoOz ?? 0);
  const yieldGrams = espressoOz > 0 ? espressoOz * 30 : dose * 2;
  const ratio = yieldGrams / dose;
  const timeSeconds = recipe.steps
    ?.map((step) => step.match(/(\d+)\s*(?:s|sec|seconds)/i))
    .find(Boolean);
  const timeValue = timeSeconds ? Number(timeSeconds[1]) : 28;

  if (summaryDose) summaryDose.textContent = `${formatNumber(dose, 1)}g`;
  if (summaryYield) summaryYield.textContent = `${formatNumber(yieldGrams, 0)}g`;
  if (summaryTime) summaryTime.textContent = `${formatNumber(timeValue, 0)}s`;
  if (summaryRatio) summaryRatio.textContent = `1:${formatNumber(ratio, 1)}`;
  const shotLabel = (recipe.shotType || "Double").trim();
  if (summaryShot) summaryShot.textContent = shotLabel.charAt(0).toUpperCase() + shotLabel.slice(1);

  setRingProgress(summaryDoseRing, dose, 22);
  setRingProgress(summaryYieldRing, yieldGrams, 50);
  setRingProgress(summaryTimeRing, timeValue, 35);

  if (recipeOutput) {
    recipeOutput.classList.remove("is-ready");
    requestAnimationFrame(() => recipeOutput.classList.add("is-ready"));
  }

  recipeSteps.innerHTML = "";
  brewingSteps = recipe.steps || [];
  brewingStepIndex = 0;
  brewingSteps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "recipe-step-card";
    li.style.setProperty("--step-index", index);
    const icon = document.createElement("div");
    icon.className = "step-icon";
    icon.innerHTML = getStepIconMarkup(step, index);

    const content = document.createElement("div");
    content.className = "step-content";

    const label = document.createElement("span");
    label.className = "step-label";
    label.textContent = `Step ${index + 1}`;

    const text = document.createElement("p");
    text.textContent = step;

    content.appendChild(label);
    content.appendChild(text);
    li.appendChild(icon);
    li.appendChild(content);
    recipeSteps.appendChild(li);
  });

  if (startBrewingButton) {
    startBrewingButton.disabled = brewingSteps.length === 0;
  }

  recipeDetail.classList.remove("is-hidden");
  recipeDetail.setAttribute("aria-hidden", "false");
};

const renderBrewingStep = () => {
  if (!brewingSteps.length) return;
  const step = brewingSteps[brewingStepIndex] || "";
  const total = brewingSteps.length;
  if (brewingProgress) {
    brewingProgress.textContent = `Step ${brewingStepIndex + 1} of ${total}`;
  }
  if (brewingTitle) {
    brewingTitle.textContent = `Step ${brewingStepIndex + 1}`;
  }
  if (brewingText) {
    brewingText.textContent = step;
  }
  if (brewingIcon) {
    brewingIcon.innerHTML = getStepIconMarkup(step, brewingStepIndex);
  }
  if (brewingPrev) {
    brewingPrev.disabled = brewingStepIndex === 0;
  }
  if (brewingNext) {
    brewingNext.textContent = brewingStepIndex === total - 1 ? "Finish" : "Next step";
  }
};

const openBrewingMode = () => {
  if (!brewingMode || !brewingSteps.length) return;
  brewingMode.classList.add("is-active");
  brewingMode.setAttribute("aria-hidden", "false");
  document.body.classList.add("brewing-active");
  renderBrewingStep();
};

const closeBrewingMode = () => {
  if (!brewingMode) return;
  brewingMode.classList.remove("is-active");
  brewingMode.setAttribute("aria-hidden", "true");
  document.body.classList.remove("brewing-active");
};

const fetchDrinks = async () => {
  const response = await fetch("/api/drinks");
  if (!response.ok) {
    throw new Error("Unable to fetch drinks");
  }
  const data = await response.json();
  return data?.drinks || [];
};

const handleGenerateDrinks = async () => {
  const values = getRecipeValues();
  if (!values.machine || !values.grinder || !values.milkCapability) {
    setDrinksStatus("Please pick your equipment setup.");
    return;
  }

  setDrinksLoading(true);
  setDrinksStatus("Curating your drink lineup...");
  drinksGrid.innerHTML = "";
  recipeDetail.classList.add("is-hidden");
  resetRecipeSummary();
  brewingSteps = [];
  brewingStepIndex = 0;

  try {
    const drinks = await fetchDrinks();
    availableDrinks = drinks;
    activeDrinkId = null;

    let filtered = drinks;
    if (!values.hasMilkCapability) {
      filtered = drinks.filter((drink) => !drink.milkRequired);
    }

    if (filtered.length === 0) {
      setDrinksStatus("No drinks match that setup. Try enabling milk.");
      return;
    }

    renderDrinks(filtered);
    setDrinksStatus("Pick a drink to generate the full recipe.");
  } catch (error) {
    setDrinksStatus("Unable to load drinks. Please try again.");
  } finally {
    setDrinksLoading(false);
  }
};

const handleDrinkClick = async (event) => {
  const toggleButton = event.target.closest(".drink-toggle");
  if (toggleButton) {
    const card = toggleButton.closest(".drink-card");
    const detailsWrapper = card?.querySelector(".drink-details-wrapper");
    if (!card || !detailsWrapper) return;
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    toggleButton.textContent = isExpanded ? "Details" : "Hide details";
    card.classList.toggle("is-expanded", !isExpanded);
    return;
  }

  if (event.target.closest(".drink-details")) {
    return;
  }

  const card = event.target.closest(".drink-card");
  if (!card) return;

  const drinkId = card.dataset.drinkId;
  const drink = availableDrinks.find((item) => item.id === drinkId);
  if (!drink) return;

  const values = getRecipeValues();
  currentRecipeContext = values;
  activeDrinkId = drinkId;

  setDrinksStatus(`Building the ${drink.name} recipe...`);
  
  // Show loading state in recipe detail immediately
  recipeDetail.classList.remove("is-hidden");
  recipeDetail.setAttribute("aria-hidden", "false");
  recipeTitle.textContent = drink.name;
  recipeSummary.textContent = "Generating your recipe...";
  if (recipeHeroIllustration) {
    recipeHeroIllustration.innerHTML = getRecipeHeroMarkup(drink.name);
  }
  resetRecipeSummary();
  if (recipeOutput) recipeOutput.classList.remove("is-ready");
  recipeSteps.innerHTML = `
    <li class="recipe-step-card is-loading">
      <div class="step-icon"></div>
      <div class="step-content">
        <span class="step-label">Brewing plan</span>
        <p>Brewing instructions...</p>
      </div>
    </li>
  `;
  
  const actionButton = card.querySelector(".drink-action");
  const previousText = actionButton?.textContent;
  if (actionButton) {
    actionButton.disabled = true;
    actionButton.classList.add("is-loading");
    actionButton.textContent = "Brewing...";
  }

  try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, drink }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Recipe request failed");
    }

    const recipe = await response.json();
    setDrinksStatus(`Recipe ready for ${drink.name}.`);
    renderRecipe(recipe, drink);
  } catch (error) {
    setDrinksStatus("Unable to generate recipe. Please try again.");
  } finally {
    if (actionButton) {
      actionButton.disabled = false;
      actionButton.textContent = previousText || "Make this";
    }
  }
};

getGuidanceButton.addEventListener("click", handleGetGuidance);
resetButton.addEventListener("click", resetForm);
shareButton.addEventListener("click", shareSummary);

sidebarToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.contains("sidebar-open");
  setSidebarOpen(!isOpen);
});
sidebarClose.addEventListener("click", () => setSidebarOpen(false));
sidebarOverlay.addEventListener("click", () => setSidebarOpen(false));

recipesForm.addEventListener("submit", (event) => event.preventDefault());
generateDrinksButton.addEventListener("click", handleGenerateDrinks);
drinksGrid.addEventListener("click", handleDrinkClick);

if (startBrewingButton) {
  startBrewingButton.addEventListener("click", () => {
    brewingStepIndex = 0;
    openBrewingMode();
  });
}

if (brewingExit) {
  brewingExit.addEventListener("click", closeBrewingMode);
}

if (brewingOverlay) {
  brewingOverlay.addEventListener("click", closeBrewingMode);
}

if (brewingPrev) {
  brewingPrev.addEventListener("click", () => {
    brewingStepIndex = clamp(brewingStepIndex - 1, 0, brewingSteps.length - 1);
    renderBrewingStep();
  });
}

if (brewingNext) {
  brewingNext.addEventListener("click", () => {
    if (brewingStepIndex >= brewingSteps.length - 1) {
      closeBrewingMode();
      return;
    }
    brewingStepIndex = clamp(brewingStepIndex + 1, 0, brewingSteps.length - 1);
    renderBrewingStep();
  });
}

segmentedControls.forEach((control) => {
  control.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => updateSegmentHighlight(control));
  });
});

window.addEventListener("resize", () => {
  clearTimeout(segmentHighlightTimer);
  segmentHighlightTimer = setTimeout(initSegmentHighlights, 120);
});

initSegmentHighlights();

viewLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveView(link.dataset.viewTarget);
    setSidebarOpen(false);
  });
});

if (recipeMachineSelect) {
  recipeMachineSelect.addEventListener("change", () => {
    machineModelTouched = true;
  });
}

machineTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!machineModelTouched && recipeMachineSelect) {
      recipeMachineSelect.value = machineDefaultsByType[input.value] || recipeMachineSelect.value;
    }
  });
});

setGuidanceVisibility(false);
setSidebarOpen(false);
setActiveView("recipes");
resetRecipeSummary();


if (recipeMachineSelect) {
  recipeMachineSelect.addEventListener("change", () => {
    const profile = machineProfiles[recipeMachineSelect.value];
    if (!profile) return;
    machineTypeInputs.forEach((input) => (input.checked = input.value === profile.type));
    grinderTypeInputs.forEach((input) => (input.checked = input.value === profile.grinder));
    // Sync milk frothing - check if the profile milk type exists, otherwise default to steam
    const milkValue = profile.milk || "steam";
    milkFrothingInputs.forEach((input) => (input.checked = input.value === milkValue));
  });
}


const updateProgress = () => {
  const total = setupSections.length || 1;
  const openCount = setupSections.filter((section) => section.classList.contains('is-open')).length;
  const activeIndex = Math.min(total - 1, Math.max(0, openCount - 1));
  progressDots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index <= activeIndex);
  });
};

setupSections.forEach((section) => {
  const header = section.querySelector('.section-header');
  const content = section.querySelector('.section-content');
  if (header && content) {
    header.addEventListener('click', () => {
      const isOpen = section.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
      updateProgress();
    });
  }
});

updateProgress();
