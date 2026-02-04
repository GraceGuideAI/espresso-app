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

const recipesForm = document.getElementById("recipes-form");
const generateDrinksButton = document.getElementById("generate-drinks");
const drinksStatus = document.getElementById("drinks-status");
const drinksGrid = document.getElementById("drinks-grid");
const recipeDetail = document.getElementById("recipe-detail");
const recipeTitle = document.getElementById("recipe-title");
const recipeSummary = document.getElementById("recipe-summary");
const recipeSteps = document.getElementById("recipe-steps");

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

const recipeFields = {
  machine: document.getElementById("recipe-machine"),
  grinder: document.getElementById("recipe-grinder"),
  milkCapability: document.getElementById("recipe-milk-capability"),
  beanType: document.getElementById("recipe-bean-type"),
  roast: document.getElementById("recipe-roast"),
  latteArt: document.getElementById("recipe-latte-art"),
};

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

const formatOz = (value, suffix = "oz") => {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value, 1)} ${suffix}`;
};

const getValues = () => ({
  machine: fields.machine.value,
  basket: Number(fields.basket.value),
  dose: Number(fields.dose.value),
  yield: Number(fields.yield.value),
  time: Number(fields.time.value),
  roast: fields.roast.value,
  grinder: fields.grinder.value,
});

const getRecipeValues = () => ({
  machine: recipeFields.machine.value,
  grinder: recipeFields.grinder.value.trim(),
  milkCapability: recipeFields.milkCapability.value,
  beanType: recipeFields.beanType.value.trim(),
  roast: recipeFields.roast.value,
  latteArt: recipeFields.latteArt.checked,
});

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

const setDrinksStatus = (message, isVisible = true) => {
  drinksStatus.textContent = message;
  drinksStatus.classList.toggle("is-hidden", !isVisible);
};

const setDrinksLoading = (isLoading) => {
  generateDrinksButton.disabled = isLoading;
  generateDrinksButton.textContent = isLoading
    ? "Generating Drinks..."
    : "Generate Drinks";
};

const getDrinkTint = (drink) => {
  if (drink.milkOz > 0) return "#f3d9b1";
  if (drink.waterOz > 0) return "#2d2b2a";
  return "#3b261b";
};

const renderDrinks = (drinks) => {
  drinksGrid.innerHTML = "";
  drinks.forEach((drink) => {
    const card = document.createElement("article");
    card.className = "drink-card";
    card.dataset.drinkId = drink.id;

    const header = document.createElement("div");
    header.className = "drink-card__header";

    const emoji = document.createElement("div");
    emoji.className = "drink-emoji";
    emoji.textContent = drink.emoji || "☕️";

    const title = document.createElement("div");
    title.className = "drink-title";
    title.innerHTML = `<h3>${drink.name}</h3><p>${formatOz(
      drink.espressoOz
    )} espresso · ${formatOz(drink.milkOz, "fl oz")} milk</p>`;

    header.appendChild(emoji);
    header.appendChild(title);

    const illustration = document.createElement("div");
    illustration.className = `drink-illustration drink-illustration--${drink.glass}`;
    const fillLevel = Math.min(
      100,
      Math.round(((drink.espressoOz + drink.milkOz + drink.waterOz) / 10) * 100)
    );
    illustration.style.setProperty("--fill", `${fillLevel}%`);
    illustration.style.setProperty("--tint", getDrinkTint(drink));

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
  if (!values.grinder || !values.beanType) {
    setDrinksStatus("Please fill in grinder and bean type.");
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

sidebarToggle.addEventListener("click", () => setSidebarOpen(true));
sidebarClose.addEventListener("click", () => setSidebarOpen(false));
sidebarOverlay.addEventListener("click", () => setSidebarOpen(false));

recipesForm.addEventListener("submit", (event) => event.preventDefault());
generateDrinksButton.addEventListener("click", handleGenerateDrinks);
drinksGrid.addEventListener("click", handleDrinkClick);

setGuidanceVisibility(false);
setSidebarOpen(false);
