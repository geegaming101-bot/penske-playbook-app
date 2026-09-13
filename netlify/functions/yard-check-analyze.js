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

  const instructions = `
You extract vehicle rows from ONE photographed Yard Check report page for a personal training tool.

ACCURACY RULES:
- Return only information that is visibly present on the printed report.
- Never invent missing digits, statuses, locations, mileage, PM information, comments, or company procedure.
- Handwriting, highlighting, folds, shadows, and marks may obscure fields. If a unit number is uncertain, use your best visible transcription and set confidence to "low".
- If a field is not readable, return an empty string.
- Ignore customer names and company/customer identifying information.
- Do not infer physical yard row/location (RL, A, B, C, etc.) unless it is literally a printed report field. The user records physical location separately outside.
- Preserve visible report status wording such as OUT, LOCAL, AVAILABLE, DEADLINE, WASH, PM, etc. Do not translate it into a different policy meaning.
- One photographed page can contain many vehicle rows.
- Do not include headers, totals, or blank rows as vehicles.

Return ONLY valid JSON with this exact shape:
{
  "units": [
    {
      "unitNumber": "printed vehicle/unit number",
      "owningLocation": "",
      "vehicleStatus": "",
      "vehicleType": "",
      "mileage": "",
      "pmInfo": "",
      "comments": "",
      "confidence": "high"
    }
  ]
}

CONFIDENCE:
- high = unit number is clearly readable
- medium = probably readable but one part is slightly unclear
- low = unit number is obscured/ambiguous and must be checked against the original page
`.trim();

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `This is Yard Check report page ${pageNumber}. Extract the printed vehicle rows.`
        },
        {
          type: "input_image",
          image_url: imageDataUrl
        }
      ]
    }
  ];

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        store: false,
        max_output_tokens: 3500
      })
    });

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

    const units = Array.isArray(parsed.units)
      ? parsed.units.map((unit) => ({
          unitNumber: String(unit?.unitNumber || "").trim(),
          owningLocation: String(unit?.owningLocation || "").trim(),
          vehicleStatus: String(unit?.vehicleStatus || "").trim(),
          vehicleType: String(unit?.vehicleType || "").trim(),
          mileage: String(unit?.mileage || "").trim(),
          pmInfo: String(unit?.pmInfo || "").trim(),
          comments: String(unit?.comments || "").trim(),
          confidence: normalizeConfidence(unit?.confidence)
        }))
      : [];

    return jsonResponse(200, {
      pageNumber,
      units,
      model
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Could not reach OpenAI from the Yard Check function."
    });
  }
};

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
