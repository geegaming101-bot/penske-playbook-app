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
  } catch {
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
    V5.10 PDF / dense-page timeout fix

    The previous analyzer asked the model to generate a large JSON object.
    On dense PDF pages, formatting that JSON can consume a meaningful portion
    of the function's time limit.

    This version asks for compact pipe-delimited rows instead:
      unit|location|status|type|mileage|pm|comments|confidence

    The server converts those lines back into the exact object structure the
    browser already expects, so no changes are required in script.js.
  */

  const instructions = `
Read ONE printed Penske Yard Check report page.

Extract every identifiable vehicle row.

OUTPUT RULES:
- Return ONLY data rows. No heading. No JSON. No markdown. No explanation.
- One vehicle per line.
- Each line must contain exactly 8 pipe-separated fields:
unitNumber|owningLocation|vehicleStatus|vehicleType|mileage|pmInfo|comments|confidence
- confidence must be high, medium, or low.
- Keep pmInfo and comments extremely short.
- Ignore customer/company names.
- Do not infer physical yard row or company procedure.
- If a field is unreadable, leave that field blank.
- If unit number is uncertain, use the best transcription and confidence low.
- Never add extra pipe characters inside a field.

Example format only:
123456|0386-10|AVAILABLE|16 FT|84211|||high
`.trim();

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Page ${pageNumber}. Extract all printed vehicle rows now.`
        },
        {
          type: "input_image",
          image_url: imageDataUrl
        }
      ]
    }
  ];

  const controller = new AbortController();

  // Leave a small cushion before the hosting function's hard execution ceiling.
  const timeout = setTimeout(() => controller.abort(), 25500);

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        reasoning: { effort: "none" },
        store: false,
        max_output_tokens: 1800
      })
    });

    const contentType = response.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      const text = await response.text();
      data = { rawText: text };
    }

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
        error: `No readable vehicle rows were returned for page ${pageNumber}.`
      });
    }

    const units = parseCompactRows(raw);

    /*
      An empty page is allowed. Returning an empty units array is better than
      treating it as a function failure.
    */
    return jsonResponse(200, {
      pageNumber,
      units,
      model
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return jsonResponse(504, {
        error:
          "This Yard Check page reached the analyzer time limit. Try the same PDF again once; if it still times out, use the Excel/CSV export or a cropped image of that page."
      });
    }

    console.error("Yard Check analyzer error:", error);

    return jsonResponse(500, {
      error: "Could not reach OpenAI from the Yard Check function."
    });
  } finally {
    clearTimeout(timeout);
  }
};

function parseCompactRows(raw) {
  return String(raw || "")
    .replace(/^```(?:text|txt)?\s*/i, "")
    .replace(/```$/i, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCompactLine)
    .filter(Boolean);
}

function parseCompactLine(line) {
  // Ignore accidental headings or explanatory prose.
  if (!line.includes("|")) return null;

  const parts = line.split("|");

  /*
    We instructed exactly eight fields. If the model accidentally returned
    extra separators, preserve the first six fields, combine the middle text
    into comments, and keep the final field as confidence.
  */
  let fields;

  if (parts.length === 8) {
    fields = parts;
  } else if (parts.length > 8) {
    fields = [
      parts[0],
      parts[1],
      parts[2],
      parts[3],
      parts[4],
      parts[5],
      parts.slice(6, -1).join(" "),
      parts[parts.length - 1]
    ];
  } else {
    fields = [...parts];
    while (fields.length < 8) fields.push("");
  }

  const unit = {
    unitNumber: clean(fields[0]),
    owningLocation: clean(fields[1]),
    vehicleStatus: clean(fields[2]),
    vehicleType: clean(fields[3]),
    mileage: clean(fields[4]),
    pmInfo: clean(fields[5]),
    comments: clean(fields[6]),
    confidence: normalizeConfidence(fields[7])
  };

  if (!looksLikeUnitNumber(unit.unitNumber)) {
    return null;
  }

  return unit;
}

function looksLikeUnitNumber(value) {
  const text = clean(value);

  if (!text) return false;

  // Yard unit numbers may contain letters, numbers, or hyphens.
  // Reject obvious prose while keeping uncertain OCR transcriptions.
  if (text.length > 24) return false;
  if (/\s{2,}/.test(text)) return false;

  return /[0-9]/.test(text);
}

function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeConfidence(value) {
  const confidence = clean(value).toLowerCase();

  if (confidence === "high" || confidence === "medium" || confidence === "low") {
    return confidence;
  }

  return "medium";
}

function extractOutputText(data) {
  if (!data || typeof data !== "object") {
    return "";
  }

  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces = [];

  for (const item of Array.isArray(data.output) ? data.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (content?.type === "output_text" && typeof content.text === "string") {
        pieces.push(content.text);
      }
    }
  }

  if (pieces.length) {
    return pieces.join("\n").trim();
  }

  if (typeof data.rawText === "string") {
    return data.rawText.trim();
  }

  return "";
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
