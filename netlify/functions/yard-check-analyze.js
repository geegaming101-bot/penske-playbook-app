const OPENAI_URL = "https://api.openai.com/v1/responses";

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, {
      error: "OPENAI_API_KEY is not configured on the server."
    });
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, { error: "Invalid JSON request." });
  }

  const pageNumber = Number(body.pageNumber) || 0;
  const imageDataUrl = String(body.imageDataUrl || "");

  if (!pageNumber || !imageDataUrl.startsWith("data:image/")) {
    return jsonResponse(400, {
      error: "A Yard Check page number and image are required."
    });
  }

  const model =
    process.env.OPENAI_VISION_MODEL ||
    process.env.OPENAI_MODEL ||
    "gpt-5.6-luna";

  /*
    Keep the AI response intentionally compact.
    The first version asked for large JSON objects for every row, which can
    take too long on a dense Yard Check page. This version asks for compact
    arrays and then converts them back to the object shape the browser expects.
  */
  const instructions = `
You are extracting printed vehicle rows from ONE photographed Yard Check report page.

Be fast and literal.

Read ONLY printed report information. Do not invent missing digits or company procedure.
Ignore customer/company names.
Do not infer physical yard row (RL/A/B/C/etc.).
If text is unreadable, use "".
If the UNIT NUMBER is unclear, use your best transcription and confidence "low".

Return ONLY compact valid JSON in this exact shape:
{
  "rows": [
    ["unitNumber","owningLocation","vehicleStatus","vehicleType","mileage","pmInfo","comments","confidence"]
  ]
}

Each row has exactly 8 values in this order:
1 unit number
2 owning location
3 vehicle status
4 vehicle type
5 mileage
6 concise PM info
7 concise printed status/comment
8 confidence: high, medium, or low

Keep comments and PM info VERY SHORT.
Do not explain anything outside the JSON.
`.trim();

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Yard Check page ${pageNumber}. Extract every clearly identifiable printed vehicle row.`
        },
        {
          type: "input_image",
          image_url: imageDataUrl
        }
      ]
    }
  ];

  try {
    const controller = new AbortController();
    // Stop our upstream request slightly before Netlify's observed 30-second ceiling
    // so the app can receive a useful error rather than an abrupt function timeout.
    const timeout = setTimeout(() => controller.abort(), 27000);

    let response;

    try {
      response = await fetch(OPENAI_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          instructions,
          input,
          reasoning: { effort: "none" },
          store: false,
          max_output_tokens: 2200
        })
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse(response.status, {
        error:
          data?.error?.message ||
          `OpenAI Yard Check request failed with status ${response.status}.`
      });
    }

    const raw = extractOutputText(data);

    if (!raw) {
      return jsonResponse(502, {
        error: `OpenAI returned no readable data for page ${pageNumber}.`
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(
        raw
          .replace(/^```json\s*/i, "")
          .replace(/```$/i, "")
          .trim()
      );
    } catch (error) {
      return jsonResponse(502, {
        error: `Page ${pageNumber} returned unreadable structured data. Try a clearer photo.`
      });
    }

    const rows = Array.isArray(parsed.rows) ? parsed.rows : [];

    const units = rows
      .filter((row) => Array.isArray(row) && row.length >= 1)
      .map((row) => ({
        unitNumber: clean(row[0]),
        owningLocation: clean(row[1]),
        vehicleStatus: clean(row[2]),
        vehicleType: clean(row[3]),
        mileage: clean(row[4]),
        pmInfo: clean(row[5]),
        comments: clean(row[6]),
        confidence: normalizeConfidence(row[7])
      }))
      .filter((unit) => unit.unitNumber);

    return jsonResponse(200, {
      pageNumber,
      units,
      model
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return jsonResponse(504, {
        error:
          "This page took too long to analyze. Try a clearer/cropped photo of the report page."
      });
    }

    return jsonResponse(500, {
      error: "Could not reach OpenAI from the Yard Check function."
    });
  }
};

function clean(value) {
  return String(value ?? "").trim();
}

function normalizeConfidence(value) {
  const confidence = String(value || "").toLowerCase();

  if (["high", "medium", "low"].includes(confidence)) {
    return confidence;
  }

  return "medium";
}

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces = [];

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        pieces.push(content.text);
      }
    }
  }

  return pieces.join("\n").trim();
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}
