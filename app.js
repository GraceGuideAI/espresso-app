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
const recipeSummary = document.getElementById("recipe-summary");
const recipeSteps = document.getElementById("recipe-steps");

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

const formatNumber = (value, digits = 1) => {
  if (!Number.isFinite(value)) return "-";
  return Number(value).toFixed(digits);
};

const formatOz = (value, suffix = "fl oz") => {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value, 1)} ${suffix}`;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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

  viewLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewTarget === viewId);
  });
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
    title.innerHTML = `<h3>${drink.name}</h3><p>${formatOz(
      drink.espressoOz
    )} espresso · ${formatOz(drink.milkOz, "fl oz")} milk</p>`;

    header.appendChild(title);

    const illustration = document.createElement("div");
    illustration.className = `drink-illustration drink-illustration--${drink.glass}`;
    illustration.innerHTML = `<div class="drink-illustration__liquid"></div>`;

    const layers = getDrinkLayers(drink);
    illustration.style.setProperty("--water-stop", `${layers.waterStop}%`);
    illustration.style.setProperty("--espresso-stop", `${layers.espressoStop}%`);
    illustration.style.setProperty("--milk-stop", `${layers.milkStop}%`);
    illustration.style.setProperty("--crema-stop", `${layers.cremaStop}%`);
    illustration.style.setProperty("--foam-stop", `${layers.foamStop}%`);

    const details = document.createElement("div");
    details.className = "drink-details";
    details.innerHTML = `
      <div><span>Crema</span><strong>${drink.crema}</strong></div>
      <div><span>Microfoam</span><strong>${drink.microfoam}</strong></div>
      <div><span>Latte Art</span><strong>${drink.latteArt ? "Yes" : "No"}</strong></div>
    `;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "drink-action";
    action.textContent = "Make this";

    card.appendChild(header);
    card.appendChild(illustration);
    card.appendChild(details);
    card.appendChild(action);

    drinksGrid.appendChild(card);
  });
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

  recipeSteps.innerHTML = "";
  (recipe.steps || []).forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    recipeSteps.appendChild(li);
  });

  recipeDetail.classList.remove("is-hidden");
  recipeDetail.setAttribute("aria-hidden", "false");
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
  const card = event.target.closest(".drink-card");
  if (!card) return;

  const drinkId = card.dataset.drinkId;
  const drink = availableDrinks.find((item) => item.id === drinkId);
  if (!drink) return;

  const values = getRecipeValues();
  activeDrinkId = drinkId;

  setDrinksStatus(`Building the ${drink.name} recipe...`);
  
  // Show loading state in recipe detail immediately
  recipeDetail.classList.remove("is-hidden");
  recipeDetail.setAttribute("aria-hidden", "false");
  recipeTitle.textContent = drink.name;
  recipeSummary.textContent = "Generating your recipe...";
  recipeSteps.innerHTML = "<li class=\"loading-step\">Brewing instructions...</li>";
  
  const actionButton = card.querySelector(".drink-action");
  const previousText = actionButton?.textContent;
  if (actionButton) {
    actionButton.disabled = true;
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


if (recipeMachineSelect) {
  recipeMachineSelect.addEventListener("change", () => {
    const profile = machineProfiles[recipeMachineSelect.value];
    if (!profile) return;
    machineTypeInputs.forEach((input) => (input.checked = input.value === profile.type));
    grinderTypeInputs.forEach((input) => (input.checked = input.value === profile.grinder));
    milkFrothingInputs.forEach((input) => (input.checked = input.value === profile.milk));
  });
}
