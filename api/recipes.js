const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const buildPrompt = ({
  machine,
  grinder,
  milkCapability,
  beanType,
  roast,
  latteArt,
}) => {
  return `Create espresso drink recipes based on the inputs below.

Inputs:
- Machine: ${machine}
- Grinder: ${grinder}
- Milk capability: ${milkCapability}
- Bean type: ${beanType}
- Roast: ${roast}
- Latte art requested: ${latteArt ? "yes" : "no"}

Rules:
- Output ONLY JSON (no markdown) as an array of 6-10 objects.
- Each object must include: name, steps (array of strings), dose, yield, time, milkAmount, frothTime.
- dose/yield must be in grams, time in seconds, milkAmount in milliliters, frothTime in seconds.
- Only include drinks supported by the milk capability:
  - "steam wand": allow milk drinks that assume manual steaming.
  - "auto milk": allow milk drinks but assume automatic milk system (no manual steaming steps).
  - "no milk": only espresso or water-based drinks (espresso, ristretto, lungo, americano, long black).
- If milk is not used, set milkAmount to "0 ml" and frothTime to "0 s".
- Keep steps concise and sequential.
- If the machine is "DeLonghi Magnifica Evo (non-LatteCrema)", assume it grinds and brews automatically and the user steams milk separately with a steam wand; include those details in steps.
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
    } = req.body || {};

    if (!machine || !grinder || !milkCapability || !beanType || !roast) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = buildPrompt({
      machine,
      grinder,
      milkCapability,
      beanType,
      roast,
      latteArt: Boolean(latteArt),
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

    let recipes = [];
    try {
      const parsed = JSON.parse(content);
      recipes = Array.isArray(parsed) ? parsed : parsed?.recipes || [];
    } catch (error) {
      return res.status(500).json({ error: "Invalid JSON from model" });
    }

    if (!Array.isArray(recipes) || recipes.length < 1) {
      return res.status(500).json({ error: "No recipes returned" });
    }

    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
