const form = document.getElementById("dialin-form");
const guidanceList = document.getElementById("guidance");
const nextAdjustment = document.getElementById("next-adjustment");
const getGuidanceButton = document.getElementById("get-guidance");
const resetButton = document.getElementById("reset");
const shareButton = document.getElementById("share");
const outputCard = document.getElementById("output-card");
const recipesForm = document.getElementById("recipes-form");
const generateRecipesButton = document.getElementById("generate-recipes");
const recipesStatus = document.getElementById("recipes-status");
const recipesOutput = document.getElementById("recipes-output");

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

const formatNumber = (value, digits = 1) => {
  if (!Number.isFinite(value)) return "-";
  return Number(value).toFixed(digits);
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
  bullets.push(getDoseYieldGuidance({
    dose: values.dose,
    yield: values.yield,
    time: values.time,
  }));

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

const latteArtSteps = [
  "Purge the steam wand and wipe clean.",
  "Create glossy microfoam with fine bubbles.",
  "Swirl and tap the pitcher to polish the milk.",
  "Start with a higher pour, then lower to draw.",
  "Finish with a gentle wiggle and lift for shape.",
];

const setRecipeStatus = (message, isVisible = true) => {
  recipesStatus.textContent = message;
  recipesStatus.classList.toggle("is-hidden", !isVisible);
};

const setRecipesLoading = (isLoading) => {
  generateRecipesButton.disabled = isLoading;
  generateRecipesButton.textContent = isLoading
    ? "Generating..."
    : "Generate Recipes";
};

const renderRecipes = (recipes, { latteArt, milkCapability }) => {
  recipesOutput.innerHTML = "";
  recipes.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const title = document.createElement("h3");
    title.textContent = recipe.name || "Recipe";

    const meta = document.createElement("div");
    meta.className = "recipe-meta";
    meta.innerHTML = `
      <div>Dose: ${recipe.dose || "-"} · Yield: ${recipe.yield || "-"}</div>
      <div>Time: ${recipe.time || "-"} · Milk: ${recipe.milkAmount || "-"}</div>
      <div>Froth time: ${recipe.frothTime || "-"}</div>
    `;

    const stepsList = document.createElement("ol");
    stepsList.className = "recipe-steps";
    let steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    const shouldAddLatteArt =
      latteArt &&
      milkCapability !== "no milk" &&
      recipe.milkAmount &&
      recipe.milkAmount !== "0 ml";
    if (shouldAddLatteArt) {
      steps = [...steps, ...latteArtSteps];
    }
    steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(stepsList);
    recipesOutput.appendChild(card);
  });
};

const handleGenerateRecipes = async () => {
  const values = getRecipeValues();
  if (!values.grinder || !values.beanType) {
    setRecipeStatus("Please fill in grinder and bean type.");
    return;
  }

  setRecipesLoading(true);
  setRecipeStatus("Contacting the recipe barista...");
  recipesOutput.innerHTML = "";

  try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Recipe request failed");
    }

    const recipes = await response.json();
    setRecipeStatus(`Generated ${recipes.length} recipes.`);
    renderRecipes(recipes, values);
  } catch (error) {
    setRecipeStatus("Unable to generate recipes. Please try again.");
  } finally {
    setRecipesLoading(false);
  }
};

getGuidanceButton.addEventListener("click", handleGetGuidance);
resetButton.addEventListener("click", resetForm);
shareButton.addEventListener("click", shareSummary);
generateRecipesButton.addEventListener("click", handleGenerateRecipes);

setGuidanceVisibility(false);
