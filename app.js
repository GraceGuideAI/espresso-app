const form = document.getElementById("dialin-form");
const guidanceList = document.getElementById("guidance");
const nextAdjustment = document.getElementById("next-adjustment");
const getGuidanceButton = document.getElementById("get-guidance");
const resetButton = document.getElementById("reset");
const shareButton = document.getElementById("share");
const outputCard = document.getElementById("output-card");

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

getGuidanceButton.addEventListener("click", handleGetGuidance);
resetButton.addEventListener("click", resetForm);
shareButton.addEventListener("click", shareSummary);

setGuidanceVisibility(false);
