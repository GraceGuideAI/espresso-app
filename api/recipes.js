const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const buildPrompt = ({
  machine,
  grinder,
  milkCapability,
  beanType,
  roast,
  latteArt,
  drink,
}) => {
  const latteArtRequested =
    latteArt && drink?.milkOz > 0 && milkCapability !== "no milk";

  return `Create a single espresso drink recipe based on the inputs below.

Inputs:
- Machine: ${machine}
- Grinder: ${grinder}
- Milk capability: ${milkCapability}
- Bean type: ${beanType}
- Roast: ${roast}
- Selected drink: ${drink?.name || "Unknown"}
- Drink volumes (liquid): espresso ${drink?.espressoOz ?? "-"} oz, milk ${
    drink?.milkOz ?? "-"
  } fl oz, water ${drink?.waterOz ?? "-"} fl oz
- Latte art requested: ${latteArtRequested ? "yes" : "no"}

Rules:
- Output ONLY JSON (no markdown) as a single object.
- The object must include: name, summary, espressoOz, milkOz, waterOz, shotType, steps (array of strings).
- Use oz/fl oz for liquids in both the summary and steps. Example: "2 oz espresso" or "6 fl oz milk".
- If milkOz is 0, do not include any milk steaming steps or latte art steps.
- If milk is used and milkCapability is "steam wand", say "steam to create microfoam" (avoid the word "froth") and include timing guidance (seconds) for steaming with the wand.
- If milk is used and milkCapability is "auto milk", use automatic milk program steps only (no manual steaming).
- If the machine is "DeLonghi Magnifica Evo (non-LatteCrema)", do NOT mention grinding. Choose single vs double shot based on espresso volume (<=1.5 oz = single, >1.5 oz = double). Include specific brew instructions for the super-auto.
- Keep steps concise, sequential, and practical.
- If latte art is requested, add steps that cover pitcher technique, stretching/texturing, when to start pouring, swirling/tapping to integrate microfoam, and the art pour. Only include latte art steps when requested.
`;
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const {
      machine,
      grinder,
      milkCapability,
      beanType,
      roast,
      latteArt,
      drink,
    } = req.body || {};

    if (
      !machine ||
      !grinder ||
      !milkCapability ||
      !beanType ||
      !roast ||
      !drink?.name
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = buildPrompt({
      machine,
      grinder,
      milkCapability,
      beanType,
      roast,
      latteArt: Boolean(latteArt),
      drink,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a precise barista recipe generator. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: "OpenAI API error", details: errorText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    let recipe = {};
    try {
      const parsed = JSON.parse(content);
      recipe = Array.isArray(parsed) ? parsed?.[0] : parsed;
    } catch (error) {
      return res.status(500).json({ error: "Invalid JSON from model" });
    }

    if (!recipe || !recipe.steps || !recipe.name) {
      return res.status(500).json({ error: "No recipes returned" });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
