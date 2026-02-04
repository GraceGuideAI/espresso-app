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
  "Automatic (Generic)": { type: "automatic", grinder: "burr", milk: "steam", basket: 18 },
  "Super-Auto (Generic)": { type: "super-auto", grinder: "built-in", milk: "frother", basket: 14 },
  "DeLonghi Magnifica Evo (non-LatteCrema version)": { type: "super-auto", grinder: "built-in", milk: "frother", basket: 14 },
  "Breville Bambino": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Gaggia Classic Pro": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Lelit Anna": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Rancilio Silvia": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Smeg Semi-Pro": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Lelit MaraX": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Rocket Appartamento": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
  "Miele CM6360": { type: "super-auto", grinder: "built-in", milk: "frother", basket: 14 },
  "La Marzocco Linea Mini": { type: "semi-auto", grinder: "burr", milk: "steam", basket: 18 },
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

const getRecipeValues = () => {
  const selectedMachine = recipeMachineSelect?.value || machineDefaultsByType["semi-auto"];
  const profile = machineProfiles[selectedMachine];
  const machineType = profile?.type || getCheckedValue(machineTypeInputs) || "semi-auto";
  const grinderType = profile?.grinder || getCheckedValue(grinderTypeInputs) || "burr";
  const milkFrothing = profile?.milk || getCheckedValue(milkFrothingInputs) || "steam";
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

  return {
    machine,
    grinder: grinderLabels[grinderType] || grinderLabels.burr,
    milkCapability:
      milkFrothing === "steam" ? "steam wand" : milkFrothing === "frother" ? "auto milk" : "no milk",
    beanType: `House blend (${basketSize}g basket)`,
    roast: roastLevel,
    grindRange,
    freshness,
    waterType,
    latteArt: Boolean(latteArtInput?.checked),
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

    const illustration = document.createElement("div");
    illustration.className = `drink-illustration drink-illustration--${drink.glass}`;
    illustration.innerHTML = `<div class="drink-illustration__liquid"></div>`;

    const layers = getDrinkLayers(drink);
    illustration.style.setProperty("--water-stop", `${layers.waterStop}%`);
    illustration.style.setProperty("--espresso-stop", `${layers.espressoStop}%`);
    illustration.style.setProperty("--milk-stop", `${layers.milkStop}%`);
    illustration.style.setProperty("--crema-stop", `${layers.cremaStop}%`);
    illustration.style.setProperty("--foam-stop", `${layers.foamStop}%`);

    hero.appendChild(illustration);

    const detailsId = `drink-details-${drink.id}`;

    const detailsToggle = document.createElement("button");
    detailsToggle.type = "button";
    detailsToggle.className = "drink-toggle";
    detailsToggle.setAttribute("aria-expanded", "false");
    detailsToggle.setAttribute("aria-controls", detailsId);
    detailsToggle.textContent = "Details";

    const details = document.createElement("div");
    details.className = "drink-details";
    details.id = detailsId;
    details.hidden = true;
    details.innerHTML = `
      <div><span>Crema</span><strong>${drink.crema}</strong></div>
      <div><span>Microfoam</span><strong>${drink.microfoam}</strong></div>
      <div><span>Latte Art</span><strong>${drink.latteArt ? "Yes" : "No"}</strong></div>
    `;

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
    card.appendChild(details);

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
    if (values.milkCapability === "no milk") {
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
    const details = card?.querySelector(".drink-details");
    if (!card || !details) return;
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    toggleButton.textContent = isExpanded ? "Details" : "Hide details";
    details.hidden = isExpanded;
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
    milkFrothingInputs.forEach((input) => (input.checked = input.value === profile.milk));
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
